import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parseVfxBrief } from "./vfx-brief.mjs";

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
const maybeOpcVideoDir = basename(sourceDir) === "脚本" ? dirname(sourceDir) : "";
const outputDir = join(projectRoot, "out", slug, "assets");
mkdirSync(outputDir, { recursive: true });

const markdown = readFileSync(scriptPath, "utf8");
const { effects, manualAssets } = parseVfxBrief(markdown);
const allScenes = [...effects, ...manualAssets];

const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const videoExts = new Set([".mp4", ".mov", ".m4v"]);

const listFiles = (dir) => {
  if (!dir || !existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...listFiles(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
};

const candidateDirs = [
  maybeOpcVideoDir ? join(maybeOpcVideoDir, "素材", "raw") : "",
  maybeOpcVideoDir ? join(maybeOpcVideoDir, "素材", "evidence") : "",
  maybeOpcVideoDir ? join(maybeOpcVideoDir, "素材", "screenshots") : "",
  join(sourceDir, "assets", "raw"),
  join(sourceDir, "assets", "evidence"),
].filter(Boolean);

const rawFiles = candidateDirs.flatMap(listFiles);

const hasPrivateHint = (text) => /后台|聊天|私密|账号|订单|手机号|邮箱|微信|抖音|小红书|公众号/.test(text);

const componentNeedsAsset = (effect) =>
  ["EvidenceCard"].includes(effect.type) ||
  effect.assetStrategy?.required === true ||
  Boolean(effect.image) ||
  effect.type?.includes("Screenshot");

const expectedAssetType = (effect) => {
  if (effect.type?.includes("ScreenRecording")) return "video";
  if (effect.sourceUrl) return "url";
  if (componentNeedsAsset(effect)) return "screenshot";
  return "text";
};

const sourceTypeFor = (effect) => {
  if (effect.sourceType) return effect.sourceType;
  if (/官方|官网|文档|pricing|price/i.test(`${effect.name} ${effect.text} ${effect.proofText}`)) return "official_website";
  if (hasPrivateHint(`${effect.name} ${effect.text} ${effect.requiredAction}`)) return "dashboard";
  return "unknown";
};

const typeForFile = (file, effect) => {
  const ext = extname(file).toLowerCase();
  if (videoExts.has(ext)) return "video_frame";
  if (/价格|pricing|price/i.test(`${effect.name} ${effect.text} ${basename(file)}`)) return "pricing_page";
  if (/后台|数据/.test(`${effect.name} ${effect.text}`)) return "dashboard_screenshot";
  if (/评论/.test(`${effect.name} ${effect.text}`)) return "social_comment";
  if (imageExts.has(ext)) return "webpage_screenshot";
  return "unknown";
};

const readImageMetadata = (file) => {
  const ext = extname(file).toLowerCase();
  if (!imageExts.has(ext)) return {};
  const result = spawnSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf8",
  });
  if (result.status !== 0) return {};
  const width = result.stdout.match(/pixelWidth:\s*(\d+)/)?.[1];
  const height = result.stdout.match(/pixelHeight:\s*(\d+)/)?.[1];
  return {
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
  };
};

const readVideoMetadata = (file) => {
  const ext = extname(file).toLowerCase();
  if (!videoExts.has(ext)) return {};
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,duration", "-of", "json", file],
    { encoding: "utf8" }
  );
  if (result.status !== 0) return {};
  try {
    const parsed = JSON.parse(result.stdout);
    const stream = parsed.streams?.[0] ?? {};
    return {
      width: stream.width,
      height: stream.height,
      duration: stream.duration ? Number(stream.duration) : undefined,
    };
  } catch {
    return {};
  }
};

const readSidecarText = (file) => {
  const withoutExt = file.slice(0, -extname(file).length);
  const candidates = [`${withoutExt}.ocr.txt`, `${withoutExt}.txt`];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, "utf8")
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 20);
    }
  }
  return [];
};

const qualityFor = (confidence) => {
  if (confidence >= 0.88) return "excellent";
  if (confidence >= 0.72) return "usable";
  if (confidence >= 0.45) return "weak";
  return "unusable";
};

const chooseFileFor = (effect) => {
  if (effect.image && existsSync(effect.image)) return effect.image;
  const expected = expectedAssetType(effect);
  const pool = rawFiles.filter((file) => {
    const ext = extname(file).toLowerCase();
    if (expected === "video") return videoExts.has(ext);
    if (expected === "screenshot") return imageExts.has(ext);
    return true;
  });
  return pool[0] ?? "";
};

const confidenceFor = (effect, file) => {
  if (!file) return 0;
  if (effect.confidence) return effect.confidence;
  if (effect.sourceUrl || effect.sourceType?.includes("official")) return 0.82;
  if (hasPrivateHint(`${effect.name} ${effect.text} ${effect.requiredAction}`)) return 0.62;
  return 0.68;
};

const actionRequired = [];
const assets = [];

for (const effect of allScenes) {
  if (!componentNeedsAsset(effect)) continue;

  const file = chooseFileFor(effect);
  const confidence = confidenceFor(effect, file);
  const minimumConfidence = Number(effect.assetStrategy?.validation?.minimum_confidence ?? (effect.type === "EvidenceCard" ? 0.8 : 0.65));
  const privacyRisk = hasPrivateHint(`${effect.name} ${effect.text} ${effect.requiredAction}`) ? "high" : "low";
  const quality = qualityFor(confidence);

  if (file) {
    const imageMeta = readImageMetadata(file);
    const videoMeta = readVideoMetadata(file);
    const detectedText = readSidecarText(file);
    const dimensionText = imageMeta.width && imageMeta.height
      ? `图片尺寸 ${imageMeta.width}x${imageMeta.height}`
      : videoMeta.width && videoMeta.height
        ? `视频尺寸 ${videoMeta.width}x${videoMeta.height}${videoMeta.duration ? `，时长 ${videoMeta.duration.toFixed(1)} 秒` : ""}`
        : "已读取素材文件，未能提取尺寸信息";
    assets.push({
      asset_id: `asset_${effect.id.toLowerCase()}_${assets.length + 1}`,
      file_path: file,
      type: typeForFile(file, effect),
      source_type: sourceTypeFor(effect),
      source_url: effect.sourceUrl || undefined,
      captured_at: new Date().toISOString().slice(0, 10),
      detected_content: `${dimensionText}；${detectedText.length > 0 ? "已读取同名 OCR 文本。" : "未发现同名 OCR 文本，语义匹配需要视觉模型或人工确认。"}`,
      detected_text: detectedText,
      used_for_scene: effect.sceneId || effect.id,
      intended_component: effect.type,
      claim_supported: effect.takeaway || effect.verdict || effect.proofText || effect.text || effect.name,
      confidence,
      quality,
      privacy_risk: privacyRisk,
      recommended_action: privacyRisk === "high" ? "blur_sensitive_before_render" : confidence >= minimumConfidence ? "use_with_validation" : "manual_review_required",
    });
  }

  if (!file || confidence < minimumConfidence || privacyRisk === "high") {
    actionRequired.push({
      scene_id: effect.sceneId || effect.id,
      component: effect.type,
      reason: !file
        ? "没有找到可用于该场景的素材文件。"
        : privacyRisk === "high"
          ? "素材涉及后台、账号、聊天或私密信息，需要先脱敏确认。"
          : `素材置信度 ${confidence.toFixed(2)} 低于阈值 ${minimumConfidence.toFixed(2)}。`,
      request_to_user: effect.requiredAction || "请补充一张能支撑该观点的截图或录屏，并确保敏感信息已打码。",
      expected_asset_type: expectedAssetType(effect),
      focus_hint: effect.takeaway || effect.proofText || effect.text || effect.name,
      fallback_plan: effect.type === "EvidenceCard" ? "如果没有可信素材，改用 CompareCard 或 QuoteCard 表达观点，不渲染证据截图。" : "降级为纯文字信息卡。",
    });
  }
}

writeFileSync(join(outputDir, "asset_manifest.json"), JSON.stringify({ assets }, null, 2) + "\n", "utf8");
writeFileSync(join(outputDir, "action_required.json"), JSON.stringify({ items: actionRequired }, null, 2) + "\n", "utf8");

if (maybeOpcVideoDir) {
  const opcAssetDir = join(maybeOpcVideoDir, "素材", "remotion-assets");
  mkdirSync(opcAssetDir, { recursive: true });
  writeFileSync(join(opcAssetDir, "asset_manifest.json"), JSON.stringify({ assets }, null, 2) + "\n", "utf8");
  writeFileSync(join(opcAssetDir, "action_required.json"), JSON.stringify({ items: actionRequired }, null, 2) + "\n", "utf8");
}

console.log(`素材清单已生成：${join(outputDir, "asset_manifest.json")}`);
console.log(`待处理清单已生成：${join(outputDir, "action_required.json")}`);
console.log(`候选素材 ${assets.length} 个，待处理 ${actionRequired.length} 项`);
