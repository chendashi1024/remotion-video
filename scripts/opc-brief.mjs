import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
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
const outputDir = join(projectRoot, "out", slug, "brief");
mkdirSync(outputDir, { recursive: true });

const markdown = readFileSync(scriptPath, "utf8");
const { effects } = parseVfxBrief(markdown);

const defaultStrategy = {
  required: false,
  preferred_mode: "none",
  fallback_modes: [],
  owner_priority: ["codex"],
  source_rules: {
    prefer: [],
    avoid: [],
  },
  validation: {
    must_read_image: false,
    must_match_claim: false,
    minimum_confidence: 1,
    if_confidence_low: "fallback_to_text_card",
    do_not_fabricate: true,
  },
};

const evidenceStrategy = {
  required: true,
  preferred_mode: "auto_web_capture",
  fallback_modes: ["auto_web_search_then_capture", "user_asset_folder_scan", "ask_user_for_asset"],
  owner_priority: ["codex", "user"],
  source_rules: {
    prefer: ["official_website", "official_docs", "public_product_page"],
    avoid: ["unknown_blog", "outdated_screenshot", "login_required_page", "private_dashboard"],
  },
  validation: {
    must_read_image: true,
    must_match_claim: true,
    minimum_confidence: 0.8,
    if_confidence_low: "mark_action_required",
    do_not_fabricate: true,
  },
};

const strategyFor = (effect) => {
  if (effect.assetStrategy) return effect.assetStrategy;
  if (effect.type === "EvidenceCard") return evidenceStrategy;
  if (effect.image) {
    return {
      ...evidenceStrategy,
      preferred_mode: "user_asset_folder_scan",
      source_rules: {
        prefer: ["user_asset_folder"],
        avoid: ["filename_only_match"],
      },
    };
  }
  return defaultStrategy;
};

const secondsFromDuration = (duration) => {
  const match = duration.match(/(\d+(?:\.\d+)?)\s*秒/);
  return match ? Number(match[1]) : 3;
};

const animationFor = (effect) => {
  if (effect.type === "TerminalLogCard") return { enter: "typewriter", focus: "highlight_box", exit: "fade_out" };
  if (effect.type === "MetricCounterCard" || effect.type === "CostCard" || effect.type === "ProgressGauge") {
    return { enter: "scan_in", focus: "count_up", exit: "fade_out" };
  }
  if (effect.type === "FlowPipelineCard" || effect.type === "NetworkGraph") {
    return { enter: "scan_in", focus: "step_glow", exit: "fade_out" };
  }
  return { enter: "scan_in", focus: "highlight_box", exit: "fade_out" };
};

const scenes = effects.map((effect) => ({
  scene_id: effect.sceneId || effect.id,
  duration_seconds: secondsFromDuration(effect.duration),
  narration_text: effect.anchor,
  narration_goal: effect.takeaway || effect.verdict || effect.conclusion || effect.name,
  visual_goal: effect.motion || effect.name,
  component: effect.type,
  component_props: {
    ...effect.componentProps,
    title: effect.title || effect.mainTitle || effect.name,
    headline: effect.title || effect.mainTitle || effect.name,
    takeaway: effect.takeaway || effect.conclusion || effect.footerText,
    imagePath: effect.image,
    sourceLabel: effect.sourceLabel || effect.proofLabel,
    sourceType: effect.sourceType,
    confidence: effect.confidence,
  },
  asset_strategy: strategyFor(effect),
  animation: animationFor(effect),
  risk_notes: effect.type === "EvidenceCard" ? ["证据素材必须经过 asset_manifest 校验后才能进入最终渲染。"] : [],
}));

const brief = {
  version: 1,
  source_script: scriptPath,
  generated_at: new Date().toISOString(),
  scenes,
};

writeFileSync(join(outputDir, "brief.json"), JSON.stringify(brief, null, 2) + "\n", "utf8");

if (maybeOpcVideoDir) {
  const opcBriefDir = join(maybeOpcVideoDir, "素材", "remotion-brief");
  mkdirSync(opcBriefDir, { recursive: true });
  writeFileSync(join(opcBriefDir, "brief.json"), JSON.stringify(brief, null, 2) + "\n", "utf8");
}

console.log(`Remotion Brief 已生成：${join(outputDir, "brief.json")}`);
console.log(`场景数量：${scenes.length}`);
