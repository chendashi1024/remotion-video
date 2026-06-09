import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { appear } from "../utils";

export const SectionTitle: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const x = interpolate(frame, [0, 14], [-70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text = clampText(effect.text, effect.name);
  const number = text.match(/\d+/)?.[0] ?? effect.id.replace(/\D/g, "");

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
          width: 930,
          minHeight: 240,
          padding: "44px 54px",
          border: vfxTheme.border,
          background: "linear-gradient(135deg, rgba(15,23,42,0.88), rgba(8,13,28,0.74))",
          boxShadow: vfxTheme.shadow.blue,
          display: "flex",
          alignItems: "center",
          gap: 34,
          transform: `translateX(${x}px)`,
        }}
      >
        <div
          style={{
            fontSize: 118,
            fontWeight: 1000,
            color: "rgba(125, 211, 252, 0.3)",
            lineHeight: 1,
          }}
        >
          {number.padStart(2, "0")}
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.12 }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
