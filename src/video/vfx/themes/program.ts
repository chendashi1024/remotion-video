import { vfxTheme } from "../theme";

export const programTheme = {
  ...vfxTheme,
  layout: {
    topNavY: 90,
    leftX: 120,
    rightX: 120,
    titleY: 210,
    labelY: 150,
    lowerThirdBottom: 140,
    subtitleReservedBottom: 150,
  },
  effects: {
    glowSoft: "0 0 12px rgba(34,211,238,0.28)",
    glowCyan: "0 0 28px rgba(34,211,238,0.34)",
    glowGold: "0 0 24px rgba(251,191,36,0.34)",
    cardShadow: "0 18px 44px rgba(0,0,0,0.3)",
    textLift: "0 4px 0 rgba(0,0,0,0.44)",
  },
};

export type AccentColor = "blue" | "yellow" | "green" | "red";

export const getAccentColor = (color: AccentColor = "blue") => {
  if (color === "yellow") return programTheme.colors.gold;
  if (color === "green") return programTheme.colors.green;
  if (color === "red") return programTheme.colors.red;
  return programTheme.colors.blue;
};
