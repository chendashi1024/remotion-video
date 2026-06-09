import type { CoverData } from "./types";

export const sampleCoverData: CoverData = {
  id: "preview",
  title: "封面预览",
  subtitle: "等待 OPC 素材输入",
  background: "cover-placeholder/bg.svg",
  person: "cover-placeholder/person.svg",
  textStyle: {
    highlightWords: ["封面"],
    mood: "impact-tech",
    contrast: "high",
    layoutHint: "title-top-person-bottom",
  },
  personStyle: {
    position: "bottom-center",
    scale: 1,
    rimLight: "cyan-blue",
    ambientColor: "#2563eb",
    shadow: "strong",
    lowerFade: true,
  },
};
