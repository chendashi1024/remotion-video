import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { GlowPanel, StepRows } from "../primitives";
import { appear } from "../utils";

export const StepSystem: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = (effect.steps?.length ? effect.steps : splitVisualText(effect.text || effect.name)).slice(0, 5);
  const isFlow = effect.layout !== "checklist";

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <GlowPanel
        color={effect.color ?? "blue"}
        style={{
          position: "absolute",
          top: 260,
          left: 120,
          width: 1420,
          padding: "28px 32px",
        }}
      >
        <div style={{ color: vfxTheme.colors.cyan, fontSize: 24, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>
          {effect.eyebrow || "SYSTEM CHECK"}
        </div>
        <div style={{ marginTop: 8, marginBottom: 18, fontSize: 34, fontWeight: 1000 }}>
          {effect.titleLines?.[0] || effect.subLabel || effect.name || "结构化步骤"}
        </div>
        {isFlow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {items.map((item, index) => {
              const active = index === effect.highlightStep;
              return (
                <div key={`${item}-${index}`} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      minWidth: 150,
                      padding: "18px 20px",
                      border: `1px solid ${active ? vfxTheme.colors.gold : "rgba(34,211,238,0.42)"}`,
                      background: active ? "rgba(251,191,36,0.16)" : "rgba(15,23,42,0.58)",
                      color: active ? vfxTheme.colors.gold : vfxTheme.colors.text,
                      fontSize: 27,
                      fontWeight: 950,
                      textAlign: "center",
                      boxShadow: active ? vfxTheme.shadow.gold : "0 12px 28px rgba(0,0,0,0.22)",
                    }}
                  >
                    {item}
                  </div>
                  {index < items.length - 1 ? <div style={{ color: vfxTheme.colors.cyan, fontSize: 32, fontWeight: 1000 }}>→</div> : null}
                </div>
              );
            })}
          </div>
        ) : (
          <StepRows items={items} frame={frame} color={effect.color ?? "blue"} />
        )}
      </GlowPanel>
    </AbsoluteFill>
  );
};
