import { Easing, interpolate, spring } from "remotion";
import { matrixOpcTheme } from "../matrix-opc";

export const opcHud = {
  fontFamily: matrixOpcTheme.fontFamily,
  monoFont: matrixOpcTheme.monoFont,
  canvas: matrixOpcTheme.canvas,
  layout: {
    panelX: 72,
    panelY: 142,
    panelWidth: 820,
    panelHeight: 610,
    fullX: 96,
    fullY: 96,
    fullWidth: 1728,
    fullHeight: 820,
    subtitleTop: 820,
    humanSafeLeft: 860,
    humanSafeRight: 1760,
  },
  radius: 0,
  colors: {
    bg: "#020706",
    panel: "rgba(0, 18, 14, 0.72)",
    panelDeep: "rgba(0, 10, 8, 0.86)",
    panelSoft: "rgba(3, 30, 22, 0.56)",
    green: "#28f59a",
    greenHot: "#4cffb2",
    greenDim: "#0a7a52",
    text: "#e8fff5",
    muted: "#7ea08f",
    mutedDeep: "#315a4a",
    hairline: "rgba(40, 245, 154, 0.36)",
    blue: "#1cb7ff",
    orange: "#ff8a1f",
    red: "#ff3b3b",
    yellow: "#facc15",
  },
  shadow: {
    panel: "0 22px 54px rgba(0, 0, 0, 0.34)",
    glow: "0 0 28px rgba(40, 245, 154, 0.32)",
    strongGlow: "0 0 42px rgba(40, 245, 154, 0.5)",
  },
};

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const systemEase = Easing.bezier(0.16, 1, 0.3, 1);

export const enterProgress = (frame: number, delay = 0, duration = 18) =>
  interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: systemEase,
  });

export const exitOpacity = (frame: number, durationInFrames: number) =>
  interpolate(frame, [0, 10, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: systemEase,
  });

export const springIn = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 18,
      stiffness: 150,
      mass: 0.75,
    },
  });

export const accentForStatus = (status?: string) => {
  if (status === "danger" || status === "error" || status === "high") return opcHud.colors.red;
  if (status === "warning" || status === "medium") return opcHud.colors.orange;
  if (status === "good" || status === "success" || status === "low") return opcHud.colors.green;
  if (status === "blue") return opcHud.colors.blue;
  return opcHud.colors.green;
};

export const toTextList = (value: unknown, fallback: string[] = []) => {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value !== "string") {
    return fallback;
  }
  return value
    .split(/\\n|\n|\||、|，|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const numberFrom = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getProp = (props: Record<string, unknown> | undefined, key: string) => props?.[key];

export const textProp = (props: Record<string, unknown> | undefined, key: string, fallback = "") => {
  const value = getProp(props, key);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return fallback;
};
