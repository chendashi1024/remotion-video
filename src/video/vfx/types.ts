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
  | "AtmosphereOverlay";

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
