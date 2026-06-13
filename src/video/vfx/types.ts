export type VfxType =
  | "ProgramPackage"
  | "ConceptContrast"
  | "StepSystem"
  | "RiskPackage"
  | "InfraNetwork"
  | "MilestoneNumber"
  | "RevenueSignal"
  | "ProofCard"
  | "NextEpisodePackage"
  | "AtmosphereOverlay"
  | "EvidenceCard"
  | "CompareCard"
  | "MetricCounterCard"
  | "FlowPipelineCard"
  | "TerminalLogCard"
  | "QuoteCard"
  | "CostCard"
  | "BarChartPanel"
  | "LineChartPanel"
  | "DonutChartPanel"
  | "ProgressGauge"
  | "AgentStatusPanel"
  | "NetworkGraph";

export type VfxBriefItem = {
  mode: string;
  id: string;
  type: VfxType | string;
  anchor: string;
  name: string;
  text: string;
  motion: string;
  duration: string;
  sound: string;
  outputName: string;
  requiredAction: string;
  capcutAction: string;
  sections?: string[];
  activeIndex?: number;
  eyebrow?: string;
  titleLines?: string[];
  highlightLineIndex?: number;
  color?: "blue" | "yellow" | "green" | "red";
  subLabel?: string;
  indexText?: string;
  mainNumber?: string;
  mainLabelEn?: string;
  mainLabelZh?: string;
  secondaryNumber?: string;
  secondaryLabelZh?: string;
  proofLabel?: string;
  proofText?: string;
  footerText?: string;
  layout?: "left" | "right" | "top" | "bottom" | "flow" | "checklist";
  leftLabel?: string;
  leftText?: string;
  rightLabel?: string;
  rightText?: string;
  steps?: string[];
  highlightStep?: number;
  mainTitle?: string;
  subtitle?: string;
  riskItems?: string[];
  nodes?: string[];
  highlightNode?: number;
  suffix?: string;
  value?: string;
  title?: string;
  badge?: string;
  verified?: string;
  position?: "left" | "right";
  image?: string;
  overlayType?: "glow" | "scanline" | "grid" | "noise" | "vignette" | "gold";
  intensity?: "low" | "medium" | "high";
  commentKeyword?: string;
  forbiddenFields?: string[];
  componentProps?: Record<string, unknown>;
  assetStrategy?: Record<string, unknown>;
  sceneId?: string;
  sourceLabel?: string;
  sourceType?: string;
  sourceUrl?: string;
  confidence?: number;
  takeaway?: string;
  verdict?: string;
  centerLabel?: string;
  compareType?: "text" | "metric" | "flow" | "image";
  startValue?: number;
  endValue?: number;
  prefix?: string;
  decimals?: number;
  trend?: "up" | "down" | "neutral";
  status?: "good" | "warning" | "danger" | "neutral";
  conclusion?: string;
  chartType?: "bar" | "line" | "donut" | "gauge";
  chartData?: Array<Record<string, string | number>>;
  data?: Array<Record<string, string | number>>;
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  valueKey?: string;
  unit?: string;
  riskLevel?: "low" | "medium" | "high";
  amountStart?: number;
  amountEnd?: number;
  currency?: "CNY" | "USD" | "JPY" | "none";
  period?: "one_time" | "per_video" | "monthly" | "yearly";
  logs?: Array<{
    time?: string;
    level?: "info" | "success" | "warning" | "error";
    text: string;
  }>;
  quote?: string;
  authorLabel?: string;
  emphasisWords?: string[];
  tone?: "calm" | "sharp" | "warning" | "inspiring";
};

export type VfxClipProps = {
  effect: VfxBriefItem;
  durationInFrames?: number;
};

export type VfxComponentProps = {
  effect: VfxBriefItem;
  frame: number;
  durationInFrames: number;
};
