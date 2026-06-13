import { showcaseScenes } from "../opc-components-showcase/showcaseEffects";
import demoEffects from "../vfx/demo-effects.json";
import type { VfxBriefItem, VfxType } from "../vfx";

export type ComponentCaseScene = {
  chapter: string;
  subtitle: string;
  effect: VfxBriefItem;
};

const fx = (effect: Partial<VfxBriefItem> & Pick<VfxBriefItem, "id" | "type" | "anchor" | "name" | "duration" | "outputName">): VfxBriefItem => ({
  mode: "自动",
  text: "",
  motion: "",
  sound: "",
  requiredAction: "",
  capcutAction: "",
  color: "green",
  ...effect,
});

const demoItems = demoEffects.effects as VfxBriefItem[];

const demoEffect = (type: VfxType) => {
  const found = demoItems.find((effect) => effect.type === type);
  return found ? { ...found, color: "green" as const } : fx({
    id: `DEMO-${type}`,
    type,
    anchor: "",
    name: type,
    duration: "3秒",
    outputName: `${type}.mov`,
  });
};

const showcaseEffect = (id: string) => {
  const found = showcaseScenes.find((scene) => scene.effect.id === id)?.effect;
  return found ? { ...found, color: "green" as const } : fx({
    id,
    type: "ProgramPackage",
    anchor: "",
    name: id,
    duration: "4秒",
    outputName: `${id}.mov`,
  });
};

const scene = (chapter: string, subtitle: string, effect: VfxBriefItem): ComponentCaseScene => ({
  chapter,
  subtitle,
  effect,
});

export const componentCaseSceneDuration = 90;

export const componentCaseScenes: ComponentCaseScene[] = [
  scene("系统开场", "ProgramPackage：把主题包装成统一的系统入口。", demoEffect("ProgramPackage")),
  scene(
    "系统开场",
    "AtmosphereOverlay：只做中性边缘氛围，不改人物主体色。",
    fx({
      id: "P2-ATMOS",
      type: "AtmosphereOverlay",
      anchor: "统一的基础遮罩，不应该污染主体视频。",
      name: "中性氛围遮罩",
      duration: "3秒",
      outputName: "P2-ATMOS-AtmosphereOverlay-中性氛围遮罩.mov",
      overlayType: "vignette",
    }),
  ),
  scene("问题诊断", "ConceptContrast：把一次性产出和资产沉淀做反差。", demoEffect("ConceptContrast")),
  scene("问题诊断", "StepSystem：把内容散落路径做成可视化节点。", demoEffect("StepSystem")),
  scene(
    "证据来源",
    "RiskPackage：低置信度素材只能做风险提示，不能直接当结论。",
    fx({
      id: "P0-RISK",
      type: "RiskPackage",
      anchor: "素材进入最终视频前，要先过来源、隐私和置信度检查。",
      name: "素材风险提示",
      duration: "4秒",
      outputName: "P0-RISK-RiskPackage-素材风险提示.mov",
      eyebrow: "VALIDATION RISK",
      subLabel: "素材质检",
      mainTitle: "低置信度素材",
      subtitle: "不能直接进入最终视频",
      riskItems: ["来源不明", "不能支撑观点", "可能含隐私", "需要人工确认"],
    }),
  ),
  scene("证据来源", "EvidenceCard：官方网页截图、URL、来源类型和置信度一起呈现。", showcaseEffect("P0-001B")),
  scene(
    "证据来源",
    "ProofCard：把证据来源整理成可审核的素材卡片。",
    fx({
      id: "P0-PROOF",
      type: "ProofCard",
      anchor: "证据不是好看的图，而是可追溯的信息。",
      name: "来源审核卡",
      duration: "4秒",
      outputName: "P0-PROOF-ProofCard-来源审核卡.mov",
      proofLabel: "SOURCE MANIFEST",
      badge: "VERIFIED",
      proofText: "URL 已记录|截图时间已记录|置信度已标注|隐私边界已检查",
      verified: "TRACEABLE",
      position: "left",
    }),
  ),
  scene("对比判断", "CompareCard：用官方素材和资产结构做左右对比。", showcaseEffect("P0-002B")),
  scene("对比判断", "MetricCounterCard：用关键数字锁定观点。", showcaseEffect("P0-003")),
  scene(
    "资产标准",
    "MilestoneNumber：把组件库覆盖情况变成一个大数字锚点。",
    fx({
      id: "P1-MILESTONE",
      type: "MilestoneNumber",
      anchor: "这不是几个零散动效，而是一整套可复用组件。",
      name: "组件库覆盖",
      duration: "4秒",
      outputName: "P1-MILESTONE-MilestoneNumber-组件库覆盖.mov",
      eyebrow: "COMPONENT COVERAGE",
      mainNumber: "23",
      suffix: "",
      mainLabelEn: "COMPONENTS ONLINE",
      mainLabelZh: "组件进入同一套视频系统",
      secondaryNumber: "8",
      secondaryLabelZh: "叙事章节",
    }),
  ),
  scene("资产标准", "FlowPipelineCard：把 OPC 从选题到复盘的闭环放进同一条线。", showcaseEffect("P0-004")),
  scene("自动执行", "TerminalLogCard：把素材入库、质检和渲染表现成系统日志。", showcaseEffect("P0-005")),
  scene("自动执行", "QuoteCard：用于关键转折和系统结论。", showcaseEffect("P0-006")),
  scene("成本收益", "CostCard：把混乱和返工转成可感知成本。", showcaseEffect("P1-001")),
  scene(
    "成本收益",
    "RevenueSignal：表达资产复用带来的生产收益。",
    fx({
      id: "P1-REV",
      type: "RevenueSignal",
      anchor: "一条视频背后沉淀的资产，会在下一条继续省时间。",
      name: "资产复用收益",
      duration: "4秒",
      outputName: "P1-REV-RevenueSignal-资产复用收益.mov",
      eyebrow: "REUSE SIGNAL",
      value: "68",
      suffix: "%",
      title: "复用效率提升",
      subtitle: "素材、脚本、封面和复盘都能继续使用",
    }),
  ),
  scene("数据图表", "BarChartPanel：比较内容散落位置。", showcaseEffect("P1-002")),
  scene("数据图表", "LineChartPanel：表现资产复利趋势。", showcaseEffect("P1-003")),
  scene("数据图表", "DonutChartPanel：拆解单条视频背后的资产结构。", showcaseEffect("P1-004")),
  scene("数据图表", "ProgressGauge：展示资产化流程覆盖率。", showcaseEffect("P1-005")),
  scene("系统网络", "AgentStatusPanel：展示不同工作流节点的执行状态。", showcaseEffect("P1-006")),
  scene("系统网络", "InfraNetwork：把选题、素材、脚本、模板、复盘连成网络。", demoEffect("InfraNetwork")),
  scene("系统网络", "NetworkGraph：把内容资产库表现成可连接的节点系统。", showcaseEffect("P2-002")),
  scene("系统收束", "NextEpisodePackage：把下一步行动收束成一个清晰指令。", demoEffect("NextEpisodePackage")),
];

export const componentCaseChapters = ["系统开场", "问题诊断", "证据来源", "对比判断", "资产标准", "自动执行", "数据图表", "系统收束"];
