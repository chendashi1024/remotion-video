import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const inputDirArg = process.argv[2] ?? "src/articles/demo-opc";
const inputDir = resolve(inputDirArg);
const slug = basename(inputDir);

const firstExistingPath = (paths) => paths.find((path) => existsSync(path)) ?? paths[0];
const scriptPath = firstExistingPath([
  join(inputDir, "video.script.md"),
  join(inputDir, "video", "script.md"),
  join(inputDir, "script.md"),
]);

if (!existsSync(scriptPath)) {
  console.error(`缺少视频脚本：${scriptPath}`);
  process.exit(1);
}

const markdown = readFileSync(scriptPath, "utf8");

const field = (label) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`^-\\s*${escaped}[：:]\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
};

const title =
  markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
  field("标题") ||
  slug;

const style = field("风格") || "透明背景 + 文章调试层";
const durationText = field("时长");
const frameDurationMatch = durationText.match(/(\d+)\s*帧/);
const secondDurationMatch = durationText.match(/(\d+(?:\.\d+)?)\s*秒/);
const durationInFrames = frameDurationMatch
  ? Number(frameDurationMatch[1])
  : secondDurationMatch
    ? Math.round(Number(secondDurationMatch[1]) * 30)
    : 180;

const summaryLines = markdown
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("- "))
  .map((line) => line.slice(2).trim())
  .filter(
    (line) =>
      !line.startsWith("时长") &&
      !line.startsWith("fps") &&
      !line.startsWith("分辨率") &&
      !line.startsWith("风格")
  )
  .slice(0, 3);

const scriptSummary =
  summaryLines.length > 0
    ? summaryLines.join("；")
    : "从文章脚本生成调试视频，用于在 Remotion Studio 中确认布局、节奏和动效方向。";

const runtimePropsDir = join(projectRoot, ".runtime");
const outputDir = join(projectRoot, "out", slug);
mkdirSync(runtimePropsDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const propsPath = join(runtimePropsDir, `video-${slug}.json`);
writeFileSync(
  propsPath,
  JSON.stringify(
    {
      data: {
        title,
        scriptSummary,
        durationInFrames,
        style,
      },
    },
    null,
    2
  ),
  "utf8"
);

const output = join(outputDir, "video.mov");
const result = spawnSync(
  "npx",
  ["remotion", "render", "article-video", output, "--props", propsPath],
  {
    cwd: projectRoot,
    stdio: "inherit",
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`视频已导出：${output}`);
