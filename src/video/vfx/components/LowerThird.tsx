import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { GlowPanel } from "../primitives";
import { appear } from "../utils";

export const LowerThird: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const y = interpolate(frame, [0, 14], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text = clampText(effect.text || effect.name, effect.name);

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <GlowPanel
        color={effect.color ?? "blue"}
        variant="line"
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 140,
          padding: "18px 24px",
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 20, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "NEXT STEP"}
        </div>
        <div style={{ marginTop: 7, fontSize: 38, fontWeight: 1000, lineHeight: 1.15 }}>{text}</div>
        {effect.footerText ? (
          <div style={{ marginTop: 8, color: vfxTheme.colors.muted, fontSize: 22, fontWeight: 820 }}>{effect.footerText}</div>
        ) : null}
      </GlowPanel>
    </AbsoluteFill>
  );
};
