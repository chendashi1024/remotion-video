import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { GlowPanel } from "../primitives";
import { getAccentColor } from "../themes";
import { appear } from "../utils";
import { vfxTheme } from "../theme";

export const ConceptContrast: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getAccentColor(effect.color ?? "yellow");
  const leftX = interpolate(frame, [0, 16], [-42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightX = interpolate(frame, [4, 22], [56, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div style={{ position: "absolute", top: 320, left: 48, width: 984 }}>
        <div style={{ color: accent, fontSize: 22, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "SURFACE vs REAL BUSINESS"}
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900, color: "rgba(248,250,252,0.78)" }}>
          {effect.subLabel || effect.name}
        </div>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "0.86fr 1.14fr", gap: 24 }}>
          <GlowPanel color="blue" style={{ padding: "34px 36px", opacity: 0.72, transform: `translateX(${leftX}px)` }}>
            <div style={{ color: vfxTheme.colors.muted, fontSize: 24, fontWeight: 1000, letterSpacing: 4 }}>
              {effect.leftLabel || "SURFACE"}
            </div>
            <div style={{ marginTop: 18, fontSize: 58, lineHeight: 1.08, fontWeight: 1000 }}>{effect.leftText || "表面"}</div>
          </GlowPanel>
          <GlowPanel color={effect.color ?? "yellow"} style={{ padding: "38px 40px", transform: `translateX(${rightX}px)`, boxShadow: `0 0 36px ${accent}55` }}>
            <div style={{ color: accent, fontSize: 24, fontWeight: 1000, letterSpacing: 4 }}>{effect.rightLabel || "REAL BUSINESS"}</div>
            <div style={{ marginTop: 18, color: accent, fontSize: 70, lineHeight: 1.04, fontWeight: 1000 }}>{effect.rightText || "本质"}</div>
          </GlowPanel>
        </div>
      </div>
    </AbsoluteFill>
  );
};
