import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { BigNumber } from "../primitives";
import { getAccentColor } from "../themes";
import { vfxTheme } from "../theme";
import { appear } from "../utils";

export const RevenueSignal: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getAccentColor(effect.color ?? "green");
  const y = interpolate(frame, [0, 16], [38, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div style={{ position: "absolute", top: 230, left: 120, width: 900, transform: `translateY(${y}px)` }}>
        <div style={{ color: accent, fontSize: 23, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>{effect.eyebrow || "REVENUE SIGNAL"}</div>
        <div style={{ marginTop: 24 }}><BigNumber value={effect.value || effect.mainNumber || "70"} suffix={effect.suffix ?? "%"} color={effect.color ?? "green"} /></div>
        <div style={{ marginTop: 18, fontSize: 44, fontWeight: 1000 }}>{effect.title || effect.mainTitle || effect.name}</div>
        {effect.subtitle ? <div style={{ marginTop: 10, fontSize: 28, color: "rgba(248,250,252,0.76)", fontWeight: 820 }}>{effect.subtitle}</div> : null}
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} style={{ width: 30, height: 30, borderRadius: 999, background: accent, opacity: 0.22 + index * 0.12, boxShadow: `0 0 18px ${accent}` }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
