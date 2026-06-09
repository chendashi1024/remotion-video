import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const variants = ["impact", "tech", "clean"];
const projectRoot = process.cwd();

const usage = () => {
  console.error("用法：npm run cover -- /path/to/moqi-opc/视频/<主题>");
};

const videoDirArg = process.argv[2];
if (!videoDirArg) {
  usage();
  process.exit(1);
}

const videoDir = resolve(videoDirArg);
const videoRoot = dirname(videoDir);
const opcRoot = dirname(videoRoot);
const coverDir = join(videoDir, "素材", "封面");
const promptDir = join(coverDir, "prompt");
const renderBriefPath = join(promptDir, "cover.render.md");
const backgroundPath = join(coverDir, "bg.png");
const personPath = join(opcRoot, "视频", "通用素材", "person", "fixed-person.png");
const outputDir = join(coverDir, "候选");

const readBrief = () => {
  if (!existsSync(renderBriefPath)) {
    console.error(`缺少封面制作说明：${renderBriefPath}`);
    process.exit(1);
  }

  return readFileSync(renderBriefPath, "utf8");
};

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

const resolveOpcPath = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (isAbsolute(value)) {
    return value;
  }
  return join(opcRoot, value);
};

const ensureFile = (path, message) => {
  if (!existsSync(path)) {
    console.error(`${message}：${path}`);
    process.exit(1);
  }
};

const brief = readBrief();
const title = field(brief, "标题") || basename(videoDir);
const subtitle = field(brief, "副标题") || "普通人也能照着做";
const topic = field(brief, "视频主题") || basename(videoDir);
const highlightWords = listField(brief, "高亮词");
const briefBackgroundPath = resolveOpcPath(field(brief, "背景图"), backgroundPath);
const briefPersonPath = resolveOpcPath(field(brief, "固定人物"), personPath);
const briefOutputDir = resolveOpcPath(field(brief, "输出目录"), outputDir);

ensureFile(briefBackgroundPath, "缺少背景图，请先把 ChatGPT Image 生成的图片保存为 bg.png");
ensureFile(briefPersonPath, "缺少固定人物图");

const runtimePublicDir = join(projectRoot, "public", "runtime");
const runtimePropsDir = join(projectRoot, ".runtime");
rmSync(runtimePublicDir, { recursive: true, force: true });
mkdirSync(runtimePublicDir, { recursive: true });
mkdirSync(runtimePropsDir, { recursive: true });
mkdirSync(briefOutputDir, { recursive: true });

copyFileSync(briefBackgroundPath, join(runtimePublicDir, "bg.png"));
copyFileSync(briefPersonPath, join(runtimePublicDir, "person.png"));

const baseData = {
  id: topic,
  title,
  subtitle,
  background: "runtime/bg.png",
  person: "runtime/person.png",
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
};

for (const variant of variants) {
  const propsPath = join(runtimePropsDir, `cover-${variant}.json`);
  writeFileSync(
    propsPath,
    JSON.stringify({ data: baseData, variant }, null, 2),
    "utf8"
  );

  const output = join(briefOutputDir, `cover-${variant}.png`);
  const result = spawnSync(
    "npx",
    ["remotion", "still", `cover-${variant}`, output, "--props", propsPath],
    {
      cwd: projectRoot,
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`封面已导出：${briefOutputDir}`);
