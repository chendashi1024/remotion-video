import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { GlowPanel } from "../primitives";
import { getAccentColor } from "../themes";
import { vfxTheme } from "../theme";
import { appear } from "../utils";

export const NextEpisodePackage: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getAccentColor(effect.color ?? "yellow");
  const y = interpolate(frame, [0, 18], [42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <GlowPanel
        color={effect.color ?? "yellow"}
        variant="line"
        style={{ position: "absolute", left: vfxTheme.layout.leftX, bottom: 250, width: 760, padding: "22px 28px", transform: `translateY(${y}px)` }}
      >
        <div style={{ color: accent, fontSize: 22, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>{effect.eyebrow || "NEXT TRACK"}</div>
        <div style={{ marginTop: 8, color: "rgba(248,250,252,0.72)", fontSize: 24, fontWeight: 850 }}>{effect.subLabel || "下期预告"}</div>
        <div style={{ marginTop: 12, fontSize: 46, fontWeight: 1000, lineHeight: 1.08 }}>{effect.mainTitle || effect.title || effect.name}</div>
        {effect.subtitle ? <div style={{ marginTop: 10, fontSize: 26, fontWeight: 850, color: "rgba(248,250,252,0.78)" }}>{effect.subtitle}</div> : null}
        {effect.commentKeyword ? (
          <div style={{ marginTop: 18, display: "inline-flex", padding: "10px 16px", borderRadius: 999, background: `${accent}22`, color: accent, fontSize: 24, fontWeight: 1000 }}>
            评论区打：{effect.commentKeyword}
          </div>
        ) : null}
      </GlowPanel>
    </AbsoluteFill>
  );
};
