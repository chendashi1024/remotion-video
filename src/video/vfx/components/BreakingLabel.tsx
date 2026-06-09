import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { vfxTheme } from "../theme";
import { appear } from "../utils";

const colorMap = {
  blue: vfxTheme.colors.blue,
  yellow: vfxTheme.colors.gold,
  green: vfxTheme.colors.green,
  red: vfxTheme.colors.red,
};

export const BreakingLabel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = colorMap[effect.color ?? "yellow"];
  const x = interpolate(frame, [0, 14], [-42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 292,
          left: 38,
          width: 610,
          transform: `translateX(${x}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: accent,
            fontSize: 19,
            fontWeight: 1000,
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow: "0 2px 0 rgba(0,0,0,0.42)",
          }}
        >
          <span style={{ width: 8, height: 22, borderRadius: 999, background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span>{effect.eyebrow || effect.text || "BREAKING TRACK"}</span>
          {effect.indexText ? <span style={{ letterSpacing: 2 }}>· {effect.indexText}</span> : null}
        </div>
        <div style={{ marginTop: 7, marginLeft: 20, fontSize: 21, fontWeight: 780, color: "rgba(248,250,252,0.78)" }}>
          {effect.subLabel || effect.name}
        </div>
      </div>
    </AbsoluteFill>
  );
};
