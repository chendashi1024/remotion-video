import type { CSSProperties, PropsWithChildren } from "react";
import { getAccentColor, programTheme, type AccentColor } from "../themes";

type GlowPanelProps = PropsWithChildren<{
  color?: AccentColor;
  variant?: "solid" | "glass" | "line";
  style?: CSSProperties;
}>;

export const GlowPanel: React.FC<GlowPanelProps> = ({ children, color = "blue", variant = "glass", style }) => {
  const accent = getAccentColor(color);
  const background =
    variant === "solid"
      ? "rgba(2,6,23,0.88)"
      : variant === "line"
        ? "linear-gradient(90deg, rgba(2,6,23,0.78), rgba(2,6,23,0.34), rgba(2,6,23,0))"
        : "linear-gradient(135deg, rgba(2,6,23,0.78), rgba(15,23,42,0.6))";

  return (
    <div
      style={{
        background,
        borderLeft: variant === "line" ? `6px solid ${accent}` : undefined,
        border: variant === "line" ? undefined : `1px solid ${accent}66`,
        boxShadow: `${programTheme.effects.cardShadow}, 0 0 28px ${accent}33`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
