import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { appear, itemProgress, slideY } from "../utils";

export const StepList: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = splitVisualText(effect.text || effect.name).slice(0, 6);

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
          width: 900,
          padding: "42px 48px",
          background: vfxTheme.colors.panel,
          border: vfxTheme.border,
          boxShadow: vfxTheme.shadow.cyan,
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 32, fontWeight: 900, marginBottom: 24 }}>
          {effect.name || "步骤列表"}
        </div>
        {items.map((item, index) => {
          const progress = itemProgress(frame, index);
          return (
            <div
              key={`${item}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginTop: index === 0 ? 0 : 18,
                opacity: progress,
                transform: `translateY(${slideY(frame - index * 7, 22)}px)`,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: index === items.length - 1 ? vfxTheme.colors.gold : "rgba(34,211,238,0.18)",
                  color: index === items.length - 1 ? "#111827" : vfxTheme.colors.cyan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 1000,
                }}
              >
                {index + 1}
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.22 }}>{item}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
