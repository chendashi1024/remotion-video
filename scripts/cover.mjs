import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const variants = ["impact", "tech", "poster"];
const projectRoot = process.cwd();

const usage = () => {
  console.error("用法：npm run cover -- src/articles/<slug>");
  console.error("不传路径时默认使用 src/articles/demo-opc");
};

const inputDirArg = process.argv[2] ?? "src/articles/demo-opc";
const inputDir = resolve(inputDirArg);

const firstExistingPath = (paths) => paths.find((path) => existsSync(path)) ?? paths[0];

const readArticleProject = (dir) => {
  const flatCoverBriefPath = firstExistingPath([
    join(dir, "cover-prompt.md"),
  ]);

  return {
    titleFallback: basename(dir),
    outputSlug: basename(dir),
    rootDir: dir,
    renderBriefPath: flatCoverBriefPath,
    backgroundPath: firstExistingPath([
      join(dir, "cover-bg.png"),
      join(dir, "cover-bg.svg"),
      join(dir, "cover-bg.jpg"),
      join(dir, "cover-bg.jpeg"),
      join(dir, "cover-bg.webp"),
    ]),
    personPath: join(projectRoot, "public", "cover-placeholder", "person.svg"),
  };
};

const articleProject = readArticleProject(inputDir);

const readBrief = () => {
  if (!existsSync(articleProject.renderBriefPath)) {
    console.error(`缺少封面制作说明：${articleProject.renderBriefPath}`);
    process.exit(1);
  }

  return readFileSync(articleProject.renderBriefPath, "utf8");
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
  if (value.startsWith("public/") || value.startsWith("src/")) {
    return join(projectRoot, value);
  }
  return join(articleProject.rootDir, value);
};

const ensureFile = (path, message) => {
  if (!existsSync(path)) {
    console.error(`${message}：${path}`);
    process.exit(1);
  }
};

const brief = readBrief();
const title = field(brief, "标题") || articleProject.titleFallback;
const subtitle = field(brief, "副标题") || "普通人也能照着做";
const topic = field(brief, "视频主题") || articleProject.titleFallback;
const highlightWords = listField(brief, "高亮词");
const briefBackgroundPath = resolveOpcPath(field(brief, "背景图"), articleProject.backgroundPath);
const briefPersonPath = resolveOpcPath(field(brief, "固定人物"), articleProject.personPath);
const outputDir = join(projectRoot, "out", articleProject.outputSlug);

ensureFile(briefBackgroundPath, "缺少背景图，请先把 ChatGPT Image 生成的图片保存为 bg.png");
ensureFile(briefPersonPath, "缺少固定人物图");

const runtimePublicDir = join(projectRoot, "public", "runtime");
const runtimePropsDir = join(projectRoot, ".runtime");
rmSync(runtimePublicDir, { recursive: true, force: true });
mkdirSync(runtimePublicDir, { recursive: true });
mkdirSync(runtimePropsDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const backgroundExt = extname(briefBackgroundPath) || ".png";
const personExt = extname(briefPersonPath) || ".png";
const runtimeBackgroundName = `bg${backgroundExt}`;
const runtimePersonName = `person${personExt}`;

copyFileSync(briefBackgroundPath, join(runtimePublicDir, runtimeBackgroundName));
copyFileSync(briefPersonPath, join(runtimePublicDir, runtimePersonName));

const baseData = {
  id: topic,
  title,
  subtitle,
  background: `runtime/${runtimeBackgroundName}`,
  person: `runtime/${runtimePersonName}`,
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

  const output = join(outputDir, `cover-${variant}.png`);
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

console.log(`封面已导出：${outputDir}`);
