export const matrixOpcTheme = {
  fontFamily:
    "'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, sans-serif",
  monoFont:
    "'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', monospace",
  canvas: {
    width: 1920,
    height: 1080,
  },
  layout: {
    safeX: 48,
    safeY: 42,
    topNavY: 30,
    brandLeft: 56,
    brandBottom: 58,
    leftPanelX: 48,
    leftPanelY: 118,
    leftPanelWidth: 760,
    subtitleTop: 850,
  },
  colors: {
    bg: "#020706",
    bgSoft: "#06120e",
    green: "#28f59a",
    greenHot: "#4cffb2",
    greenDim: "#0a7a52",
    greenDark: "#063626",
    text: "#e8fff5",
    muted: "#6c8f82",
    mutedDeep: "#315a4a",
    blue: "#1cb7ff",
    orange: "#ff8a1f",
    red: "#ff3b3b",
    panel: "rgba(0, 18, 14, 0.7)",
    panelDeep: "rgba(0, 10, 8, 0.82)",
    hairline: "rgba(40, 245, 154, 0.34)",
  },
  shadow: {
    green: "0 0 28px rgba(40, 245, 154, 0.32)",
    greenSoft: "0 0 16px rgba(40, 245, 154, 0.2)",
    panel: "0 22px 54px rgba(0, 0, 0, 0.34)",
  },
};

export type MatrixAccent = "green" | "blue" | "orange" | "red";

export const getMatrixAccent = (accent: MatrixAccent = "green") => {
  if (accent === "blue") return matrixOpcTheme.colors.blue;
  if (accent === "orange") return matrixOpcTheme.colors.orange;
  if (accent === "red") return matrixOpcTheme.colors.red;
  return matrixOpcTheme.colors.green;
};

