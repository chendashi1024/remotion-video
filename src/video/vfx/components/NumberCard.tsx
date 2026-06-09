import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { appear } from "../utils";

export const NumberCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const text = clampText(effect.text, effect.name);
  const lift = interpolate(frame, [0, 14], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: vfxTheme.fontFamily,
        color: vfxTheme.colors.text,
        opacity,
      }}
    >
      <div
        style={{
          minWidth: 620,
          maxWidth: 900,
          padding: "52px 64px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.84), rgba(15, 23, 42, 0.68))",
          border: "1px solid rgba(251, 191, 36, 0.46)",
          boxShadow: vfxTheme.shadow.gold,
          transform: `translateY(${lift}px)`,
        }}
      >
        <div style={{ fontSize: text.length > 14 ? 80 : 118, fontWeight: 1000, color: vfxTheme.colors.gold }}>
          {text}
        </div>
        <div style={{ marginTop: 18, fontSize: 28, color: vfxTheme.colors.muted, fontWeight: 750 }}>
          {effect.name}
        </div>
      </div>
    </AbsoluteFill>
  );
};
