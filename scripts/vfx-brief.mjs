const effectHeader = /^🎬\s*\[(自动|手动)\]\[(VFX-\d{3}|SHOT-\d{3})\]\[([A-Za-z]+)\]\s*$/;
const fieldLine = /^-\s*([^：:]+)[：:]\s*(.*)$/;

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
    if (key === "次级数字") current.secondaryNumber = value;
    if (key === "次级说明") current.secondaryLabelZh = value;
    if (key === "证据标签") current.proofLabel = value;
    if (key === "证据文字") current.proofText = value;
    if (key === "底部文字") current.footerText = value;
    if (key === "布局") current.layout = value;
  }

  if (current) {
    items.push(current);
  }

  return {
    effects: items.filter((item) => item.mode === "自动"),
    manualAssets: items.filter((item) => item.mode === "手动"),
  };
};
