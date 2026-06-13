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
  "EvidenceCard",
  "CompareCard",
  "MetricCounterCard",
  "FlowPipelineCard",
  "TerminalLogCard",
  "QuoteCard",
  "CostCard",
  "BarChartPanel",
  "LineChartPanel",
  "DonutChartPanel",
  "ProgressGauge",
  "AgentStatusPanel",
  "NetworkGraph",
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

const parseJsonObject = (value) => {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const parseJsonArray = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const parseNumber = (value) => {
  const number = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : undefined;
};

const parseTrend = (value) => {
  const lower = value.toLowerCase();
  if (value.includes("下降") || lower.includes("down")) return "down";
  if (value.includes("上升") || lower.includes("up")) return "up";
  return "neutral";
};

const parseStatus = (value) => {
  const lower = value.toLowerCase();
  if (value.includes("好") || value.includes("安全") || lower.includes("good") || lower.includes("success")) return "good";
  if (value.includes("警") || value.includes("中") || lower.includes("warning")) return "warning";
  if (value.includes("险") || value.includes("高") || lower.includes("danger") || lower.includes("error")) return "danger";
  return "neutral";
};

const parseRiskLevel = (value) => {
  const lower = value.toLowerCase();
  if (value.includes("高") || lower.includes("high")) return "high";
  if (value.includes("中") || lower.includes("medium")) return "medium";
  return "low";
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
        forbiddenFields: [],
        componentProps: undefined,
        assetStrategy: undefined,
        sceneId: "",
        sourceLabel: "",
        sourceType: "",
        sourceUrl: "",
        confidence: undefined,
        takeaway: "",
        verdict: "",
        centerLabel: "",
        compareType: undefined,
        startValue: undefined,
        endValue: undefined,
        prefix: "",
        decimals: undefined,
        trend: undefined,
        status: undefined,
        conclusion: "",
        chartType: undefined,
        chartData: undefined,
        data: undefined,
        xKey: "",
        yKey: "",
        nameKey: "",
        valueKey: "",
        unit: "",
        riskLevel: undefined,
        amountStart: undefined,
        amountEnd: undefined,
        currency: undefined,
        period: undefined,
        logs: undefined,
        quote: "",
        authorLabel: "",
        emphasisWords: [],
        tone: undefined,
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
    if (key === "章节导航" || key === "当前章节") current.forbiddenFields.push(key);
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
    if (key === "组件参数") current.componentProps = parseJsonObject(value);
    if (key === "素材策略") current.assetStrategy = parseJsonObject(value);
    if (key === "场景ID" || key === "Scene ID") current.sceneId = value;
    if (key === "来源标签") current.sourceLabel = value;
    if (key === "来源类型") current.sourceType = value;
    if (key === "来源URL" || key === "来源链接") current.sourceUrl = value;
    if (key === "可信度" || key === "置信度") current.confidence = parseNumber(value);
    if (key === "结论" || key === "Takeaway") current.takeaway = value;
    if (key === "判定" || key === "Verdict") current.verdict = value;
    if (key === "中间标签") current.centerLabel = value;
    if (key === "对比类型") current.compareType = value.includes("图") || value.toLowerCase().includes("image")
      ? "image"
      : value.includes("数字") || value.toLowerCase().includes("metric")
        ? "metric"
        : value.includes("流程") || value.toLowerCase().includes("flow")
          ? "flow"
          : "text";
    if (key === "起始值") current.startValue = parseNumber(value);
    if (key === "目标值" || key === "结束值") current.endValue = parseNumber(value);
    if (key === "前缀") current.prefix = value;
    if (key === "小数位") current.decimals = parseNumber(value);
    if (key === "趋势") current.trend = parseTrend(value);
    if (key === "状态") current.status = parseStatus(value);
    if (key === "说明" || key === "总结") current.conclusion = value;
    if (key === "图表类型") current.chartType = value.includes("线") || value.toLowerCase().includes("line")
      ? "line"
      : value.includes("环") || value.toLowerCase().includes("donut")
        ? "donut"
        : value.includes("进度") || value.toLowerCase().includes("gauge")
          ? "gauge"
          : "bar";
    if (key === "图表数据" || key === "数据") current.chartData = parseJsonArray(value);
    if (key === "X字段") current.xKey = value;
    if (key === "Y字段") current.yKey = value;
    if (key === "名称字段") current.nameKey = value;
    if (key === "数值字段") current.valueKey = value;
    if (key === "单位") current.unit = value;
    if (key === "风险等级") current.riskLevel = parseRiskLevel(value);
    if (key === "起始金额") current.amountStart = parseNumber(value);
    if (key === "目标金额" || key === "金额") current.amountEnd = parseNumber(value);
    if (key === "币种") current.currency = value.toUpperCase().includes("USD")
      ? "USD"
      : value.toUpperCase().includes("JPY")
        ? "JPY"
        : value.includes("无") || value.toLowerCase().includes("none")
          ? "none"
          : "CNY";
    if (key === "周期") current.period = value.includes("月") || value.toLowerCase().includes("monthly")
      ? "monthly"
      : value.includes("条") || value.toLowerCase().includes("per_video")
        ? "per_video"
        : value.includes("年") || value.toLowerCase().includes("year")
          ? "yearly"
          : "one_time";
    if (key === "日志") {
      const logItems = splitList(value);
      current.logs = logItems.map((text, index) => ({
        time: `00:${String(index * 3 + 1).padStart(2, "0")}`,
        level: index === logItems.length - 1 ? "success" : "info",
        text,
      }));
    }
    if (key === "引用" || key === "金句") current.quote = value;
    if (key === "作者标签") current.authorLabel = value;
    if (key === "强调词") current.emphasisWords = splitList(value);
    if (key === "语气") current.tone = value.includes("警") || value.toLowerCase().includes("warning")
      ? "warning"
      : value.includes("锋") || value.toLowerCase().includes("sharp")
        ? "sharp"
        : value.includes("燃") || value.toLowerCase().includes("inspiring")
          ? "inspiring"
          : "calm";
  }

  if (current) {
    items.push(current);
  }

  return {
    effects: items.filter((item) => item.mode === "自动"),
    manualAssets: items.filter((item) => item.mode === "手动"),
  };
};
