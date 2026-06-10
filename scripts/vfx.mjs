import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { allowedVfxTypes, parseVfxBrief } from "./vfx-brief.mjs";

const projectRoot = process.cwd();
const inputArg = process.argv[2] ?? "src/articles/demo-opc";

const inputPath = resolve(inputArg);
const scriptPath = existsSync(inputPath) && inputPath.endsWith(".md")
  ? inputPath
  : join(inputPath, "video-script.md");

if (!existsSync(scriptPath)) {
  console.error(`缺少视频脚本：${scriptPath}`);
  process.exit(1);
}

const sourceDir = dirname(scriptPath);
const slug = basename(sourceDir) === "脚本" ? basename(dirname(sourceDir)) : basename(sourceDir);
const markdown = readFileSync(scriptPath, "utf8");
const { effects } = parseVfxBrief(markdown);

if (effects.length === 0) {
  console.error("没有找到可渲染的 [自动][VFX-xxx] 动效项");
  process.exit(1);
}

const invalidEffects = effects.filter((effect) => !allowedVfxTypes.includes(effect.type));
if (invalidEffects.length > 0) {
  for (const effect of invalidEffects) {
    console.error(`不支持的 VFX 类型：${effect.id} ${effect.type}`);
  }
  console.error(`允许的 VFX 类型：${allowedVfxTypes.join(", ")}`);
  process.exit(1);
}

const timelineFieldEffects = effects.filter((effect) => effect.forbiddenFields?.length);
if (timelineFieldEffects.length > 0) {
  for (const effect of timelineFieldEffects) {
    console.error(`VFX brief 不允许生成顶部时间轴字段：${effect.id} ${effect.forbiddenFields.join(", ")}`);
  }
  process.exit(1);
}

const parseDurationInFrames = (duration) => {
  const secondMatch = duration.match(/(\d+(?:\.\d+)?)\s*秒/);
  if (secondMatch) {
    return Math.max(30, Math.round(Number(secondMatch[1]) * 30));
  }
  const frameMatch = duration.match(/(\d+)\s*帧/);
  if (frameMatch) {
    return Math.max(30, Number(frameMatch[1]));
  }
  return 90;
};

const safeFileName = (name) =>
  name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "")
    .slice(0, 120);

const runtimeDir = join(projectRoot, ".runtime", "vfx");
const outputDir = join(projectRoot, "out", slug, "vfx");
const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browserArgs = existsSync(systemChrome) ? ["--browser-executable", systemChrome] : [];
mkdirSync(runtimeDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

for (const fileName of readdirSync(outputDir)) {
  if (fileName.endsWith(".mov") || fileName === "manifest.json") {
    rmSync(join(outputDir, fileName), { force: true });
  }
}

const manifest = [];

for (const effect of effects) {
  const durationInFrames = parseDurationInFrames(effect.duration);
  const outputName = safeFileName(effect.outputName || `${effect.id}-${effect.type}-${effect.name}.mov`);
  const propsPath = join(runtimeDir, `${effect.id}.json`);
  const outputPath = join(outputDir, outputName);

  writeFileSync(
    propsPath,
    JSON.stringify(
      {
        effect,
        durationInFrames,
      },
      null,
      2
    ),
    "utf8"
  );

  const result = spawnSync(
    "npx",
    [
      "remotion",
      "render",
      "vfx-clip",
      outputPath,
      "--props",
      propsPath,
      "--frames",
      `0-${durationInFrames - 1}`,
      "--concurrency",
      "1",
      "--timeout",
      "120000",
      ...browserArgs,
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  manifest.push({
    id: effect.id,
    type: effect.type,
    name: effect.name,
    anchor: effect.anchor,
    output: outputPath,
    durationInFrames,
  });
}

writeFileSync(join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
const maybeOpcVideoDir = basename(sourceDir) === "脚本" ? dirname(sourceDir) : "";
if (maybeOpcVideoDir && existsSync(join(maybeOpcVideoDir, "脚本", "video-script.md"))) {
  const opcVfxDir = join(maybeOpcVideoDir, "素材", "vfx");
  mkdirSync(opcVfxDir, { recursive: true });
  const rows = manifest
    .map(
      (item) =>
        `| ${item.id} | ${item.type} | ${item.name} | ${item.anchor.replace(/\|/g, "｜")} | ${basename(item.output)} |`
    )
    .join("\n");

  writeFileSync(
    join(opcVfxDir, "vfx-manifest.md"),
    `# VFX 清单\n\n` +
      `- Remotion 输出目录：${outputDir}\n` +
      `- 来源脚本：${scriptPath}\n` +
      `- 说明：这里只记录局部动效素材索引，不保存 .mov 文件本体。\n\n` +
      `| 编号 | 类型 | 名称 | 锚点 | 文件 |\n` +
      `| --- | --- | --- | --- | --- |\n` +
      `${rows}\n`,
    "utf8"
  );
  console.log(`OPC VFX 清单已写入：${join(opcVfxDir, "vfx-manifest.md")}`);
}
console.log(`VFX 已导出：${outputDir}`);
console.log(`共 ${effects.length} 个自动动效`);
