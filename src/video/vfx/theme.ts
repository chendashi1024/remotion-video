export const vfxTheme = {
  fontFamily:
    "'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, sans-serif",
  safeX: 86,
  safeY: 150,
  colors: {
    text: "#f8fafc",
    muted: "#94a3b8",
    cyan: "#22d3ee",
    blue: "#60a5fa",
    gold: "#fbbf24",
    red: "#fb7185",
    green: "#34d399",
    panel: "rgba(2, 6, 23, 0.74)",
    panelStrong: "rgba(15, 23, 42, 0.9)",
  },
  shadow: {
    cyan: "0 0 34px rgba(34, 211, 238, 0.42)",
    blue: "0 0 42px rgba(96, 165, 250, 0.36)",
    gold: "0 0 34px rgba(251, 191, 36, 0.38)",
    red: "0 0 38px rgba(248, 113, 113, 0.42)",
  },
  border: "1px solid rgba(125, 211, 252, 0.38)",
};

export const clampText = (text: string, fallback: string) => {
  const value = text.trim() || fallback;
  return value.length > 80 ? `${value.slice(0, 80)}...` : value;
};

export const splitVisualText = (text: string) =>
  text
    .split(/\\n|\n|\/|、|，/)
    .map((item) => item.trim())
    .filter(Boolean);
