import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { appear, itemProgress, slideY } from "../utils";

export const KeywordCards: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const keywords = splitVisualText(effect.text || effect.name).slice(0, 4);

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
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {keywords.map((keyword, index) => {
          const progress = itemProgress(frame, index, 6);
          return (
            <div
              key={`${keyword}-${index}`}
              style={{
                padding: "26px 34px",
                minWidth: 220,
                textAlign: "center",
                background: index === keywords.length - 1 ? "rgba(34, 211, 238, 0.18)" : vfxTheme.colors.panel,
                border: vfxTheme.border,
                boxShadow: index === keywords.length - 1 ? vfxTheme.shadow.cyan : "0 16px 36px rgba(0,0,0,0.32)",
                opacity: progress,
                transform: `translateY(${slideY(frame - index * 6, 32)}px) scale(${0.96 + progress * 0.04})`,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 950, lineHeight: 1.1 }}>{keyword}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
