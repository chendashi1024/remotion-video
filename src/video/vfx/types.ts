export type VfxType =
  | "HeroTitle"
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
