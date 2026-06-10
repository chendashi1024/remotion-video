const effectHeader = /^🎬\s*\[(自动|手动)\]\[(VFX-\d{3}|SHOT-\d{3})\]\[([A-Za-z]+)\]\s*$/;
const fieldLine = /^-\s*([^：:]+)[：:]\s*(.*)$/;
export const allowedVfxTypes = [
  "ProgramPackage",
  "ConceptContrast",
  "StepSystem",
  "RiskPackage",
  "InfraNetwork",
  "MilestoneNumber",
  "RevenueSignal",
  "ProofCard",
  "NextEpisodePackage",
  "AtmosphereOverlay",
];

const splitList = (value) =>
  value
    .split(/\\n|\n|\||\/|、|，/)
    .map((item) => item.trim())
    .filter(Boolean);

const parseIndex = (value) => {
  const number = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(number) && number > 0 ? number - 1 : 0;
};

const parseHighlightLine = (value) => {
  const number = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(number) && number > 0 ? number - 1 : undefined;
};

const normalizeOneBasedIndex = (value) => {
  const number = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(number) && number > 0 ? number - 1 : undefined;
};

const normalizeColor = (value) => {
  const lower = value.toLowerCase();
  if (lower.includes("黄") || lower.includes("yellow")) return "yellow";
  if (lower.includes("绿") || lower.includes("green")) return "green";
  if (lower.includes("红") || lower.includes("red")) return "red";
  if (lower.includes("蓝") || lower.includes("blue")) return "blue";
  return undefined;
};

export const parseVfxBrief = (markdown) => {
  const items = [];
  let current = null;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    const header = line.match(effectHeader);

    if (header) {
      if (current) {
        items.push(current);
      }
      current = {
        mode: header[1],
        id: header[2],
        type: header[3],
        anchor: "",
        name: "",
        text: "",
        motion: "",
        duration: "",
        sound: "",
        outputName: "",
        requiredAction: "",
        capcutAction: "",
        sections: [],
        activeIndex: 0,
        eyebrow: "",
        titleLines: [],
        highlightLineIndex: undefined,
        color: undefined,
        subLabel: "",
        indexText: "",
        mainNumber: "",
        mainLabelEn: "",
        mainLabelZh: "",
        secondaryNumber: "",
        secondaryLabelZh: "",
        proofLabel: "",
        proofText: "",
        footerText: "",
        layout: undefined,
        leftLabel: "",
        leftText: "",
        rightLabel: "",
        rightText: "",
        steps: [],
        highlightStep: undefined,
        mainTitle: "",
        subtitle: "",
        riskItems: [],
        nodes: [],
        highlightNode: undefined,
        suffix: "",
        value: "",
        title: "",
        badge: "",
        verified: "",
        position: undefined,
        image: "",
        overlayType: undefined,
        intensity: undefined,
        commentKeyword: "",
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const field = line.match(fieldLine);
    if (!field) {
      continue;
    }

    const key = field[1].trim();
    const value = field[2].trim();

    if (key === "锚点") current.anchor = value;
    if (key === "名称") current.name = value;
    if (key === "画面文字") current.text = value;
    if (key === "动效") current.motion = value;
    if (key === "建议时长") current.duration = value;
    if (key === "音效") current.sound = value;
    if (key === "导出命名") current.outputName = value;
    if (key === "需要你") current.requiredAction = value;
    if (key === "剪映处理") current.capcutAction = value;
    if (key === "章节导航") current.sections = splitList(value);
    if (key === "当前章节") current.activeIndex = parseIndex(value);
    if (key === "英文标签") current.eyebrow = value;
    if (key === "中文标签") current.subLabel = value;
    if (key === "编号") current.indexText = value;
    if (key === "标题行") current.titleLines = splitList(value);
    if (key === "高亮行") current.highlightLineIndex = parseHighlightLine(value);
    if (key === "颜色") current.color = normalizeColor(value);
    if (key === "主数字") current.mainNumber = value;
    if (key === "英文说明") current.mainLabelEn = value;
    if (key === "中文说明") current.mainLabelZh = value;
    if (key === "次级数字" || key === "次数字") current.secondaryNumber = value;
    if (key === "次级说明") current.secondaryLabelZh = value;
    if (key === "证据标签") current.proofLabel = value;
    if (key === "证据文字") current.proofText = value;
    if (key === "底部文字") current.footerText = value;
    if (key === "布局") current.layout = value.toLowerCase().includes("check") || value.includes("清单")
      ? "checklist"
      : value.toLowerCase().includes("flow") || value.includes("流程") || value.includes("链路")
        ? "flow"
        : value.includes("右") || value.toLowerCase().includes("right")
          ? "right"
          : value.includes("上") || value.toLowerCase().includes("top")
            ? "top"
            : value.includes("下") || value.toLowerCase().includes("bottom")
              ? "bottom"
              : "left";
    if (key === "左侧标签") current.leftLabel = value;
    if (key === "左侧文字") current.leftText = value;
    if (key === "右侧标签") current.rightLabel = value;
    if (key === "右侧文字") current.rightText = value;
    if (key === "步骤") current.steps = splitList(value);
    if (key === "高亮步骤") current.highlightStep = normalizeOneBasedIndex(value);
    if (key === "主标题") current.mainTitle = value;
    if (key === "副标题") current.subtitle = value;
    if (key === "风险项") current.riskItems = splitList(value);
    if (key === "节点") current.nodes = splitList(value);
    if (key === "高亮节点") current.highlightNode = normalizeOneBasedIndex(value);
    if (key === "后缀") current.suffix = value;
    if (key === "数值") current.value = value;
    if (key === "标题") current.title = value;
    if (key === "Badge") current.badge = value;
    if (key === "Verified") current.verified = value;
    if (key === "位置") current.position = value.includes("左") || value.toLowerCase().includes("left") ? "left" : "right";
    if (key === "图片") current.image = value;
    if (key === "类型") current.overlayType = value.includes("网格")
      ? "grid"
      : value.includes("扫描")
        ? "scanline"
        : value.includes("噪声")
          ? "noise"
          : value.includes("暗角")
            ? "vignette"
            : value.includes("金")
              ? "gold"
              : "glow";
    if (key === "强度") current.intensity = value.includes("高")
      ? "high"
      : value.includes("中")
        ? "medium"
        : "low";
    if (key === "评论关键词") current.commentKeyword = value;
  }

  if (current) {
    items.push(current);
  }

  return {
    effects: items.filter((item) => item.mode === "自动"),
    manualAssets: items.filter((item) => item.mode === "手动"),
  };
};
