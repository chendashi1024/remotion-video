import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parseVfxBrief } from "./vfx-brief.mjs";

const projectRoot = process.cwd();
const inputArg = process.argv[2];

if (!inputArg) {
  console.error("请传入 OPC 视频目录或 template.json 路径");
  process.exit(1);
}

const inputPath = resolve(inputArg);
const templatePath = inputPath.endsWith(".json") ? inputPath : join(inputPath, "template.json");

if (!existsSync(templatePath)) {
  console.error(`缺少剪映 template.json：${templatePath}`);
  process.exit(1);
}

const videoDir = inputPath.endsWith(".json") ? dirname(inputPath) : inputPath;
const slug = basename(videoDir);
const outputDir = join(projectRoot, "out", slug);
const dataDir = join(outputDir, "data");
const runtimeDir = join(projectRoot, ".runtime", "timeline");
const extractedSubtitlesPath = join(dataDir, "extracted_subtitles.json");
const videoTimelinePath = join(dataDir, "videoTimeline.json");
const outputPath = join(outputDir, "chapter-timeline.mov");
const runtimePropsPath = join(runtimeDir, `${slug}.json`);

const roundSeconds = (value) => Math.round(value * 1000) / 1000;

const timeToSeconds = (value) => {
  if (!Number.isFinite(value)) return 0;
  if (Math.abs(value) >= 100000) return value / 1000000;
  if (Math.abs(value) >= 1000) return value / 1000;
  return value;
};

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const parseTextContent = (textMaterial) => {
  if (typeof textMaterial?.recognize_text === "string" && textMaterial.recognize_text.trim()) {
    return textMaterial.recognize_text.trim();
  }
  if (typeof textMaterial?.text === "string" && textMaterial.text.trim()) {
    return textMaterial.text.trim();
  }
  if (typeof textMaterial?.content === "string" && textMaterial.content.trim()) {
    try {
      const content = JSON.parse(textMaterial.content);
      if (typeof content.text === "string" && content.text.trim()) {
        return content.text.trim();
      }
    } catch {
      return "";
    }
  }
  return "";
};

const extractFromTextTracks = (template) => {
  const textById = new Map((template.materials?.texts ?? []).map((item) => [item.id, item]));
  const subtitles = [];

  for (const track of template.tracks ?? []) {
    if (track.type !== "text") continue;
    for (const segment of track.segments ?? []) {
      const timerange = segment.target_timerange;
      const text = parseTextContent(textById.get(segment.material_id));
      if (!timerange || !text) continue;
      const start = timeToSeconds(Number(timerange.start));
      const duration = timeToSeconds(Number(timerange.duration));
      const end = start + duration;
      if (end <= start) continue;
      subtitles.push({
        text,
        start: roundSeconds(start),
        end: roundSeconds(end),
      });
    }
  }

  return subtitles;
};

const extractFromSubtitleFragments = (template) => {
  const fragments = template.extra_info?.subtitle_fragment_info_list ?? [];
  const subtitles = [];

  for (const fragment of fragments) {
    let text = "";
    if (typeof fragment.subtitle_cache_info === "string" && fragment.subtitle_cache_info.trim()) {
      try {
        const cache = JSON.parse(fragment.subtitle_cache_info);
        text = cache.sentence_list?.map((item) => item.text).filter(Boolean).join(" ").trim() ?? "";
      } catch {
        text = "";
      }
    }
    const start = timeToSeconds(Number(fragment.start_time));
    const end = timeToSeconds(Number(fragment.end_time));
    if (!text || end <= start) continue;
    subtitles.push({
      text,
      start: roundSeconds(start),
      end: roundSeconds(end),
    });
  }

  return subtitles;
};

const dedupeSubtitles = (subtitles) => {
  const seen = new Set();
  return subtitles
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .filter((item) => {
      const key = `${item.start}:${item.end}:${item.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const normalizeText = (value) =>
  value
    .replace(/\s+/g, "")
    .replace(/[，。、“”‘’：:；;！!？?（）()《》【】\[\]'"`]/g, "")
    .toLowerCase();

const findAnchorTime = (anchor, subtitles) => {
  const normalizedAnchor = normalizeText(anchor);
  if (!normalizedAnchor) return undefined;
  const matched = subtitles.find((subtitle) => {
    const normalizedSubtitle = normalizeText(subtitle.text);
    return normalizedAnchor.includes(normalizedSubtitle) || normalizedSubtitle.includes(normalizedAnchor);
  });
  return matched?.start;
};

const getVideoTitle = (videoDir) => {
  const scriptPath = join(videoDir, "脚本", "video-script.md");
  if (!existsSync(scriptPath)) return basename(videoDir);
  const markdown = readFileSync(scriptPath, "utf8");
  const title = markdown.match(/-\s*视频标题[：:]\s*(.+)/)?.[1]?.trim();
  return title || basename(videoDir);
};

const readManualChapters = (videoDir) => {
  const candidates = [
    join(videoDir, "timeline-anchors.json"),
    join(videoDir, "章节锚点.json"),
    join(videoDir, "脚本", "timeline-anchors.json"),
  ];
  const configPath = candidates.find((path) => existsSync(path));
  if (!configPath) return undefined;
  const config = readJson(configPath);
  const chapters = Array.isArray(config) ? config : config.chapters;
  if (!Array.isArray(chapters)) return undefined;
  return {
    configPath,
    videoTitle: config.videoTitle,
    duration: config.duration,
    chapters,
  };
};

const deriveChaptersFromScript = (videoDir, subtitles, duration) => {
  const scriptPath = join(videoDir, "脚本", "video-script.md");
  if (!existsSync(scriptPath)) return undefined;
  const markdown = readFileSync(scriptPath, "utf8");
  const { effects } = parseVfxBrief(markdown);
  const sectionSource = effects.find((effect) => effect.sections?.length)?.sections ?? [];
  if (sectionSource.length === 0) return undefined;

  const starts = new Array(sectionSource.length).fill(undefined);
  starts[0] = 0;
  for (const effect of effects) {
    const index = Number.isFinite(effect.activeIndex) ? effect.activeIndex : 0;
    if (index < 0 || index >= starts.length || starts[index] !== undefined) continue;
    starts[index] = findAnchorTime(effect.anchor, subtitles);
  }

  const fallbackStep = duration / sectionSource.length;
  const normalizedStarts = starts.map((start, index) =>
    Number.isFinite(start) ? start : roundSeconds(index * fallbackStep)
  );

  return sectionSource.map((title, index) => ({
    title,
    start: normalizedStarts[index],
    end: normalizedStarts[index + 1] ?? duration,
  }));
};

const buildTimeline = ({ videoDir, subtitles, template }) => {
  const templateDuration = timeToSeconds(Number(template.duration));
  const subtitleDuration = subtitles.at(-1)?.end ?? 0;
  const baseDuration = roundSeconds(Math.max(templateDuration, subtitleDuration, 1));
  const manual = readManualChapters(videoDir);
  const videoTitle = manual?.videoTitle || getVideoTitle(videoDir);
  const duration = roundSeconds(Number.isFinite(manual?.duration) ? Number(manual.duration) : baseDuration);

  let chapters = [];
  if (manual?.chapters?.length) {
    chapters = manual.chapters.map((chapter) => {
      const start = Number.isFinite(chapter.start)
        ? Number(chapter.start)
        : findAnchorTime(chapter.anchor ?? "", subtitles) ?? 0;
      return {
        title: String(chapter.title ?? "章节").trim() || "章节",
        start: roundSeconds(start),
        end: Number.isFinite(chapter.end) ? roundSeconds(Number(chapter.end)) : undefined,
      };
    });
  } else {
    chapters = deriveChaptersFromScript(videoDir, subtitles, duration) ?? [
      { title: "全片", start: 0, end: duration },
    ];
  }

  const sorted = chapters.sort((a, b) => a.start - b.start);
  const filled = sorted.map((chapter, index) => ({
    title: chapter.title,
    start: roundSeconds(Math.max(0, chapter.start)),
    end: roundSeconds(Math.min(duration, chapter.end ?? sorted[index + 1]?.start ?? duration)),
  })).filter((chapter) => chapter.end > chapter.start);

  return {
    timeline: {
      videoTitle,
      duration,
      chapters: filled.length ? filled : [{ title: "全片", start: 0, end: duration }],
    },
    manualConfigPath: manual?.configPath,
  };
};

const template = readJson(templatePath);
const trackSubtitles = extractFromTextTracks(template);
const fragmentSubtitles = extractFromSubtitleFragments(template);
const subtitles = dedupeSubtitles(trackSubtitles.length ? trackSubtitles : fragmentSubtitles);

if (subtitles.length === 0) {
  console.error("没有从 template.json 提取到字幕");
  process.exit(1);
}

const { timeline, manualConfigPath } = buildTimeline({ videoDir, subtitles, template });
const durationInFrames = Math.max(1, Math.ceil(timeline.duration * 30));

mkdirSync(dataDir, { recursive: true });
mkdirSync(runtimeDir, { recursive: true });

for (const fileName of readdirSync(outputDir, { withFileTypes: true })) {
  if (fileName.isFile() && (fileName.name === "chapter-timeline.mov" || fileName.name === "timeline-manifest.json")) {
    rmSync(join(outputDir, fileName.name), { force: true });
  }
}

writeFileSync(extractedSubtitlesPath, JSON.stringify(subtitles, null, 2) + "\n", "utf8");
writeFileSync(videoTimelinePath, JSON.stringify(timeline, null, 2) + "\n", "utf8");
writeFileSync(runtimePropsPath, JSON.stringify({ timeline }, null, 2) + "\n", "utf8");

const renderResult = spawnSync(
  "npx",
  [
    "remotion",
    "render",
    "chapter-timeline",
    outputPath,
    "--props",
    runtimePropsPath,
    "--frames",
    `0-${durationInFrames - 1}`,
    "--codec",
    "prores",
    "--prores-profile",
    "4444",
  ],
  {
    cwd: projectRoot,
    stdio: "inherit",
  }
);

if (renderResult.status !== 0) {
  process.exit(renderResult.status ?? 1);
}

const manifest = {
  slug,
  sourceTemplate: templatePath,
  manualConfig: manualConfigPath ?? null,
  output: outputPath,
  extractedSubtitles: extractedSubtitlesPath,
  videoTimeline: videoTimelinePath,
  durationInFrames,
  subtitles: subtitles.length,
  chapters: timeline.chapters,
};

writeFileSync(join(outputDir, "timeline-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

const opcTimelineDir = join(videoDir, "素材", "timeline");
mkdirSync(opcTimelineDir, { recursive: true });
const rows = [
  ["剪映模板", templatePath],
  ["字幕数据", extractedSubtitlesPath],
  ["章节时间轴", videoTimelinePath],
  ["Remotion 视频", outputPath],
  ["Remotion 清单", join(outputDir, "timeline-manifest.json")],
];

writeFileSync(
  join(opcTimelineDir, "timeline-manifest.md"),
  `# 时间轴清单\n\n` +
    `- Remotion 输出目录：${outputDir}\n` +
    `- 来源模板：${templatePath}\n` +
    `- 手动章节配置：${manualConfigPath ?? "未提供，已从 video-script.md 生成初稿"}\n` +
    `- 说明：这里只记录字幕时间轴素材索引，不保存 .mov 文件本体。\n\n` +
    `| 类型 | 路径 |\n` +
    `| --- | --- |\n` +
    rows.map(([label, path]) => `| ${label} | ${path} |`).join("\n") +
    `\n\n` +
    `## 章节\n\n` +
    `| 标题 | 开始 | 结束 |\n` +
    `| --- | ---: | ---: |\n` +
    timeline.chapters.map((chapter) => `| ${chapter.title} | ${chapter.start} | ${chapter.end} |`).join("\n") +
    `\n`,
  "utf8"
);

console.log(`字幕已提取：${extractedSubtitlesPath}`);
console.log(`章节时间轴已生成：${videoTimelinePath}`);
console.log(`时间轴视频已导出：${outputPath}`);
console.log(`OPC 时间轴清单已写入：${join(opcTimelineDir, "timeline-manifest.md")}`);
