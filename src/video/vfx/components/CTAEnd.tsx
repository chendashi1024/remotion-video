import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { appear, slideY } from "../utils";

export const CTAEnd: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
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
          width: 820,
          padding: "46px 54px",
          background: "linear-gradient(135deg, rgba(2, 6, 23, 0.78), rgba(8, 47, 73, 0.66))",
          border: vfxTheme.border,
          boxShadow: vfxTheme.shadow.cyan,
          textAlign: "center",
          transform: `translateY(${slideY(frame, 34)}px)`,
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 34, fontWeight: 950, marginBottom: 16 }}>
          下期继续拆
        </div>
        <div style={{ fontSize: 64, fontWeight: 1000, lineHeight: 1.12 }}>{text}</div>
        <div style={{ marginTop: 24, fontSize: 30, color: vfxTheme.colors.muted, fontWeight: 800 }}>
          收藏备用，关注不迷路
        </div>
      </div>
    </AbsoluteFill>
  );
};
