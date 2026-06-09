import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { appear, itemProgress, slideY } from "../utils";

export const StepSystem: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = splitVisualText(effect.text || effect.name).slice(0, 5);

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 490,
          left: 48,
          width: 900,
          padding: "28px 32px",
          background: "linear-gradient(135deg, rgba(2,6,23,0.78), rgba(15,23,42,0.6))",
          borderLeft: `7px solid ${vfxTheme.colors.cyan}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.28), 0 0 28px rgba(34,211,238,0.22)",
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 24, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "SYSTEM CHECK"}
        </div>
        <div style={{ marginTop: 8, marginBottom: 18, fontSize: 34, fontWeight: 1000 }}>{effect.name || "结构化步骤"}</div>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item, index) => {
            const progress = itemProgress(frame, index, 6);
            return (
              <div
                key={`${item}-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  alignItems: "center",
                  gap: 18,
                  opacity: progress,
                  transform: `translateY(${slideY(frame - index * 6, 20)}px)`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: index === items.length - 1 ? vfxTheme.colors.gold : "rgba(34,211,238,0.18)",
                    color: index === items.length - 1 ? "#111827" : vfxTheme.colors.cyan,
                    fontSize: 20,
                    fontWeight: 1000,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.2 }}>{item}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
