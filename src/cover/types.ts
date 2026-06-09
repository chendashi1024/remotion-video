export type CoverVariant = "impact" | "tech" | "poster";

export type CoverTextStyle = {
  highlightWords: string[];
  mood: "impact-tech" | "clean-tech" | "warning-tech" | "premium-tech";
  contrast: "high" | "medium";
  layoutHint:
    | "title-top-person-bottom"
    | "title-center-person-bottom"
    | "title-left-person-right";
};

export type CoverPersonStyle = {
  position: "bottom-center";
  scale: number;
  rimLight: "cyan-blue" | "purple-blue" | "gold-cyan" | "white-blue";
  ambientColor: string;
  shadow: "soft" | "strong";
  lowerFade: boolean;
};

export type CoverData = {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  person: string;
  textStyle: CoverTextStyle;
  personStyle: CoverPersonStyle;
};
