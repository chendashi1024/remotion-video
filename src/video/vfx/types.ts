export type VfxType =
  | "HeroTitle"
  | "ProgramHeader"
  | "BreakingLabel"
  | "HeroTopicTitle"
  | "MilestoneNumber"
  | "ProofCard"
  | "ProgramPackage"
  | "StepSystem"
  | "LowerThird"
  | "SectionTitle"
  | "StepList"
  | "NumberCard"
  | "KeywordCards"
  | "RiskCard"
  | "CTAEnd";

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
  layout?: "left" | "right" | "top" | "bottom";
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
