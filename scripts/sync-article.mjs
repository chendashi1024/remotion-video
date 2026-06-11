import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { parseVfxBrief } from "./vfx-brief.mjs";

const projectRoot = process.cwd();
const sourceArg = process.argv[2];

if (!sourceArg) {
  console.error("用法：npm run article:sync -- /path/to/cge-opc/视频/<主题>/脚本");
  process.exit(1);
}

const sourceDir = resolve(sourceArg);
const slug = basename(sourceDir) === "脚本" ? basename(dirname(sourceDir)) : basename(sourceDir);
const articleDir = join(projectRoot, "src", "articles", slug);

const readIfExists = (path) => (path && existsSync(path) ? readFileSync(path, "utf8") : "");

const sourceVideoScriptPath = join(sourceDir, "video-script.md");
const sourceBgPromptPath = join(sourceDir, "bg-prompt.md");
const sourceMusicPath = join(sourceDir, "music.md");

if (!existsSync(sourceVideoScriptPath)) {
  console.error(`缺少视频脚本：${sourceVideoScriptPath}`);
  process.exit(1);
}

const videoScript = readIfExists(sourceVideoScriptPath);
const { effects, manualAssets } = parseVfxBrief(videoScript);
const title =
  videoScript.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
  slug;
const style = videoScript.match(/^-\s*风格[：:]\s*(.+)$/m)?.[1]?.trim() || "透明背景 + 文章调试层";
const durationText = videoScript.match(/^-\s*时长[：:]\s*(.+)$/m)?.[1]?.trim() || "";
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

writeFileSync(join(articleDir, "video-script.md"), videoScript.trimEnd() + "\n", "utf8");
if (existsSync(sourceBgPromptPath)) {
  writeFileSync(join(articleDir, "bg-prompt.md"), readIfExists(sourceBgPromptPath).trimEnd() + "\n", "utf8");
}
if (existsSync(sourceMusicPath)) {
  writeFileSync(join(articleDir, "music.md"), readIfExists(sourceMusicPath).trimEnd() + "\n", "utf8");
}

const meta = {
  id: slug,
  title,
  slug,
  video: {
    title,
    scriptSummary,
    durationInFrames,
    style,
    effects,
    manualAssets,
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
console.log(`文章已同步：${relativeArticleDir}`);
