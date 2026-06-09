import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { appear, slideY } from "../utils";

export const RiskCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const text = clampText(effect.text, effect.name);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: `0 ${vfxTheme.safeX}px`,
        fontFamily: vfxTheme.fontFamily,
        color: vfxTheme.colors.text,
        opacity,
      }}
    >
      <div
        style={{
          width: 880,
          padding: "48px 56px",
          background: "linear-gradient(135deg, rgba(45, 7, 12, 0.92), rgba(15, 23, 42, 0.72))",
          border: "1px solid rgba(251, 113, 133, 0.52)",
          boxShadow: vfxTheme.shadow.red,
          transform: `translateY(${slideY(frame, 28)}px)`,
        }}
      >
        <div style={{ fontSize: 32, color: vfxTheme.colors.red, fontWeight: 1000, marginBottom: 18 }}>
          RISK CHECK
        </div>
        <div style={{ fontSize: 62, fontWeight: 950, lineHeight: 1.14 }}>{text}</div>
        <div style={{ marginTop: 24, height: 3, width: 180, background: vfxTheme.colors.red }} />
      </div>
    </AbsoluteFill>
  );
};
