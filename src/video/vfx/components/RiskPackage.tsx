import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { GlowPanel, StepRows } from "../primitives";
import { splitVisualText, vfxTheme } from "../theme";
import { appear } from "../utils";

export const RiskPackage: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = (effect.riskItems?.length ? effect.riskItems : splitVisualText(effect.proofText || "")).slice(0, 4);
  const y = interpolate(frame, [0, 16], [44, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <GlowPanel
        color="red"
        style={{
          position: "absolute",
          top: 205,
          left: vfxTheme.layout.leftX,
          width: 700,
          padding: "30px 34px",
          transform: `translateY(${y}px)`,
          background: "linear-gradient(135deg, rgba(45,7,12,0.92), rgba(15,23,42,0.7))",
        }}
      >
        <div style={{ color: vfxTheme.colors.red, fontSize: 24, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "RISK CHECK"}
          {effect.indexText ? ` · ${effect.indexText}` : ""}
        </div>
        <div style={{ marginTop: 8, color: "rgba(248,250,252,0.72)", fontSize: 26, fontWeight: 850 }}>{effect.subLabel || "风险提示"}</div>
        <div style={{ marginTop: 18, fontSize: 54, lineHeight: 1.04, fontWeight: 1000 }}>{effect.mainTitle || effect.name}</div>
        {effect.subtitle ? <div style={{ marginTop: 10, color: vfxTheme.colors.red, fontSize: 34, fontWeight: 950 }}>{effect.subtitle}</div> : null}
        {items.length ? <div style={{ marginTop: 28 }}><StepRows items={items} frame={frame} color="red" compact /></div> : null}
      </GlowPanel>
    </AbsoluteFill>
  );
};
