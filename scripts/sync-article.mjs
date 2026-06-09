import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";

const projectRoot = process.cwd();
const sourceArg = process.argv[2];

if (!sourceArg) {
  console.error("用法：npm run article:sync -- /path/to/文章/<slug>");
  console.error("兼容旧结构：npm run article:sync -- /path/to/moqi-opc/视频/<主题>");
  process.exit(1);
}

const sourceDir = resolve(sourceArg);
const slug = basename(sourceDir);
const articleDir = join(projectRoot, "src", "articles", slug);
const publicArticleDir = join(projectRoot, "public", "articles", slug);

const firstExistingPath = (paths) => paths.find((path) => existsSync(path)) ?? "";

const readIfExists = (path) => (path && existsSync(path) ? readFileSync(path, "utf8") : "");

const field = (markdown, label) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`^-\\s*${escaped}[：:]\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
};

const listField = (markdown, label) =>
  field(markdown, label)
    .split(/[、,，/]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

const sourceCoverPromptPath = firstExistingPath([
  join(sourceDir, "cover.prompt.md"),
  join(sourceDir, "cover.render.md"),
  join(sourceDir, "cover", "prompt.md"),
  join(sourceDir, "cover", "prompt", "cover.render.md"),
  join(sourceDir, "素材", "封面", "prompt", "cover.render.md"),
]);

const sourceVideoScriptPath = firstExistingPath([
  join(sourceDir, "video.script.md"),
  join(sourceDir, "video", "script.md"),
  join(sourceDir, "script.md"),
  join(sourceDir, "脚本.md"),
]);

const sourceBackgroundPath = firstExistingPath([
  join(sourceDir, "cover.bg.png"),
  join(sourceDir, "cover.bg.svg"),
  join(sourceDir, "cover.bg.jpg"),
  join(sourceDir, "cover.bg.jpeg"),
  join(sourceDir, "cover.bg.webp"),
  join(sourceDir, "cover", "bg.png"),
  join(sourceDir, "素材", "封面", "bg.png"),
]);

if (!sourceCoverPromptPath) {
  console.error(`缺少封面提示词：${sourceDir}`);
  process.exit(1);
}

if (!sourceVideoScriptPath) {
  console.error(`缺少视频脚本：${sourceDir}`);
  process.exit(1);
}

const coverPrompt = readIfExists(sourceCoverPromptPath);
const videoScript = readIfExists(sourceVideoScriptPath);
const title =
  field(coverPrompt, "标题") ||
  videoScript.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
  slug;
const subtitle = field(coverPrompt, "副标题") || "普通人也能照着做";
const topic = field(coverPrompt, "视频主题") || slug;
const highlightWords = listField(coverPrompt, "高亮词");
const style = field(videoScript, "风格") || "透明背景 + 文章调试层";
const durationText = field(videoScript, "时长");
const frameDurationMatch = durationText.match(/(\d+)\s*帧/);
const secondDurationMatch = durationText.match(/(\d+(?:\.\d+)?)\s*秒/);
const durationInFrames = frameDurationMatch
  ? Number(frameDurationMatch[1])
  : secondDurationMatch
    ? Math.round(Number(secondDurationMatch[1]) * 30)
    : 180;

const summaryLines = videoScript
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

mkdirSync(articleDir, { recursive: true });
mkdirSync(publicArticleDir, { recursive: true });

let backgroundRef = "cover-placeholder/bg.svg";
let syncedCoverPrompt = coverPrompt;
if (sourceBackgroundPath) {
  const backgroundExt = extname(sourceBackgroundPath) || ".png";
  const backgroundName = `cover.bg${backgroundExt}`;
  copyFileSync(sourceBackgroundPath, join(publicArticleDir, backgroundName));
  backgroundRef = `articles/${slug}/${backgroundName}`;
  syncedCoverPrompt = coverPrompt.replace(
    /^-\s*背景图[：:].*$/m,
    `- 背景图：public/articles/${slug}/${backgroundName}`
  );
  if (syncedCoverPrompt === coverPrompt) {
    syncedCoverPrompt = `${coverPrompt.trim()}\n- 背景图：public/articles/${slug}/${backgroundName}\n`;
  }
}

writeFileSync(join(articleDir, "cover.prompt.md"), syncedCoverPrompt.trimEnd() + "\n", "utf8");
writeFileSync(join(articleDir, "video.script.md"), videoScript.trimEnd() + "\n", "utf8");

const meta = {
  id: slug,
  title,
  slug,
  cover: {
    variants: ["impact", "tech", "poster"],
    data: {
      id: topic,
      title,
      subtitle,
      background: backgroundRef,
      person: "cover-placeholder/person.svg",
      textStyle: {
        highlightWords: highlightWords.length > 0 ? highlightWords : [title.slice(0, 2)],
        mood: "impact-tech",
        contrast: "high",
        layoutHint: "title-top-person-bottom",
      },
      personStyle: {
        position: "bottom-center",
        scale: 1,
        rimLight: "cyan-blue",
        ambientColor: "#2563eb",
        shadow: "strong",
        lowerFade: true,
      },
    },
  },
  video: {
    title,
    scriptSummary,
    durationInFrames,
    style,
  },
};

writeFileSync(join(articleDir, "meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");

const articlesRoot = join(projectRoot, "src", "articles");
const articleSlugs = readdirSync(articlesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(join(articlesRoot, name, "meta.json")))
  .sort();

const toImportName = (name) => `article_${name.replace(/[^a-zA-Z0-9_$]/g, "_")}`;

const imports = articleSlugs
  .map((name) => {
    const importName = toImportName(name);
    return `import ${importName} from "./${name}/meta.json";`;
  })
  .join("\n");

const registryItems = articleSlugs
  .map((name) => `${toImportName(name)} as ArticleProject`)
  .join(",\n  ");

writeFileSync(
  join(articlesRoot, "registry.ts"),
  `${imports}\nimport type { ArticleProject } from "./types";\n\nexport const studioArticleProjects: ArticleProject[] = [\n  ${registryItems},\n];\n`,
  "utf8"
);

const relativeArticleDir = relative(projectRoot, articleDir);
const relativePublicDir = relative(projectRoot, publicArticleDir);
console.log(`文章已同步：${relativeArticleDir}`);
console.log(`预览素材已同步：${relativePublicDir}`);
