import type { CoverVariant } from "./types";

export const coverVariants: CoverVariant[] = ["impact", "tech", "clean"];

export const variantLabels: Record<CoverVariant, string> = {
  impact: "强冲击",
  tech: "科技感",
  clean: "简洁版",
};

export const variantStyles: Record<
  CoverVariant,
  {
    titleTop: number;
    titleSize: number;
    titleLineHeight: number;
    titleAlign: "left" | "center";
    titleLeft: number;
    titleWidth: number;
    subtitleTop: number;
    personWidth: number;
    personBottom: number;
    personX: number;
    panelOpacity: number;
    strokeWidth: number;
    glow: string;
    accent: string;
    secondary: string;
  }
> = {
  impact: {
    titleTop: 160,
    titleSize: 126,
    titleLineHeight: 1.02,
    titleAlign: "center",
    titleLeft: 74,
    titleWidth: 932,
    subtitleTop: 462,
    personWidth: 860,
    personBottom: -38,
    personX: 540,
    panelOpacity: 0.76,
    strokeWidth: 12,
    glow: "rgba(34, 211, 238, 0.72)",
    accent: "#22d3ee",
    secondary: "#f8fafc",
  },
  tech: {
    titleTop: 188,
    titleSize: 104,
    titleLineHeight: 1.08,
    titleAlign: "left",
    titleLeft: 72,
    titleWidth: 780,
    subtitleTop: 438,
    personWidth: 800,
    personBottom: -30,
    personX: 610,
    panelOpacity: 0.62,
    strokeWidth: 9,
    glow: "rgba(96, 165, 250, 0.64)",
    accent: "#60a5fa",
    secondary: "#a78bfa",
  },
  clean: {
    titleTop: 214,
    titleSize: 94,
    titleLineHeight: 1.12,
    titleAlign: "center",
    titleLeft: 96,
    titleWidth: 888,
    subtitleTop: 456,
    personWidth: 780,
    personBottom: -18,
    personX: 540,
    panelOpacity: 0.5,
    strokeWidth: 7,
    glow: "rgba(255, 255, 255, 0.42)",
    accent: "#f8fafc",
    secondary: "#22d3ee",
  },
};
