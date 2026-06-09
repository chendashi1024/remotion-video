import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { GlowPanel, StepRows } from "../primitives";
import { appear } from "../utils";

export const StepSystem: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = splitVisualText(effect.text || effect.name).slice(0, 5);

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <GlowPanel
        color={effect.color ?? "blue"}
        style={{
          position: "absolute",
          top: 490,
          left: 48,
          width: 900,
          padding: "28px 32px",
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 24, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "SYSTEM CHECK"}
        </div>
        <div style={{ marginTop: 8, marginBottom: 18, fontSize: 34, fontWeight: 1000 }}>{effect.name || "结构化步骤"}</div>
        <StepRows items={items} frame={frame} color={effect.color ?? "blue"} />
      </GlowPanel>
    </AbsoluteFill>
  );
};
