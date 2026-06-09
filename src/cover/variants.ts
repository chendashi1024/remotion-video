import type { CoverVariant } from "./types";

export const coverVariants: CoverVariant[] = ["impact", "tech", "poster"];

export const variantLabels: Record<CoverVariant, string> = {
  impact: "强冲击",
  tech: "科技感",
  poster: "爆款感",
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
    glow: "rgba(251, 191, 36, 0.72)",
    accent: "#facc15",
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
  poster: {
    titleTop: 176,
    titleSize: 108,
    titleLineHeight: 1.04,
    titleAlign: "left",
    titleLeft: 64,
    titleWidth: 820,
    subtitleTop: 438,
    personWidth: 820,
    personBottom: -28,
    personX: 650,
    panelOpacity: 0.68,
    strokeWidth: 10,
    glow: "rgba(34, 197, 94, 0.62)",
    accent: "#22c55e",
    secondary: "#facc15",
  },
};
