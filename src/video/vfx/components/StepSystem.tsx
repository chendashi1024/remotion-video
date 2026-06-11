import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText } from "../theme";
import { appear } from "../utils";
import { matrixOpcTheme } from "../../matrix-opc";

export const StepSystem: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const items = (effect.steps?.length ? effect.steps : splitVisualText(effect.text || effect.name)).slice(0, 5);
  const isFlow = effect.layout !== "checklist";
  const accent = effect.color === "red" ? matrixOpcTheme.colors.red : effect.color === "yellow" ? matrixOpcTheme.colors.orange : matrixOpcTheme.colors.green;
  const cornerLineStyle = {
    position: "absolute" as const,
    width: 28,
    height: 28,
    borderColor: accent,
    opacity: 0.86,
    pointerEvents: "none" as const,
  };

  return (
    <AbsoluteFill style={{ fontFamily: matrixOpcTheme.fontFamily, color: matrixOpcTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: matrixOpcTheme.layout.leftPanelY + 160,
          left: matrixOpcTheme.layout.leftPanelX,
          width: 820,
          padding: "28px 30px 34px",
          background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panel}, rgba(0, 8, 6, 0.54))`,
          border: `1px solid ${accent}66`,
          boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 18px ${accent}18`,
        }}
      >
        <div style={{ ...cornerLineStyle, top: -1, left: -1, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerLineStyle, top: -1, right: -1, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
        <div style={{ ...cornerLineStyle, bottom: -1, left: -1, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerLineStyle, bottom: -1, right: -1, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 22,
            right: 22,
            height: 1,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            opacity: 0.86,
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              color: accent,
              fontFamily: matrixOpcTheme.monoFont,
              fontSize: 19,
              fontWeight: 900,
              letterSpacing: 2.6,
              textTransform: "uppercase",
              textShadow: `0 0 10px ${accent}44`,
            }}
          >
            {effect.eyebrow || "SYSTEM PIPELINE"}
          </div>
          <div style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 12, letterSpacing: 1.2 }}>
            / {effect.indexText || effect.subLabel || "OPC"}
          </div>
        </div>
        <div style={{ marginTop: 10, marginBottom: 30, fontSize: 36, lineHeight: 1.06, fontWeight: 950, letterSpacing: 0 }}>
          {effect.titleLines?.[0] || effect.subLabel || effect.name || "结构化步骤"}
        </div>
        {isFlow ? (
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 12 }}>
            <div
              style={{
                position: "absolute",
                left: 45,
                right: 45,
                top: 38,
                height: 1,
                background: `linear-gradient(90deg, ${accent}77, ${accent}22)`,
              }}
            />
            {items.map((item, index) => {
              const active = index === effect.highlightStep;
              const isPassed = index <= (effect.highlightStep ?? 0);
              return (
                <div key={`${item}-${index}`} style={{ position: "relative", minWidth: 0, textAlign: "center" }}>
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      margin: "0 auto",
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${isPassed ? accent : matrixOpcTheme.colors.mutedDeep}`,
                      background: active ? `${accent}24` : isPassed ? `${accent}12` : "rgba(0,0,0,0.22)",
                      color: isPassed ? accent : matrixOpcTheme.colors.muted,
                      fontFamily: matrixOpcTheme.monoFont,
                      fontSize: 21,
                      fontWeight: 900,
                      boxShadow: active ? `0 0 16px ${accent}44` : "none",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      color: active ? matrixOpcTheme.colors.text : "rgba(232,255,245,0.72)",
                      fontSize: 23,
                      lineHeight: 1.15,
                      fontWeight: active ? 900 : 720,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item, index) => {
              const active = index === effect.highlightStep || index === items.length - 1;
              return (
                <div
                  key={`${item}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42px 1fr",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    border: `1px solid ${active ? accent : "rgba(40,245,154,0.24)"}`,
                    background: active ? `${accent}16` : "rgba(0,18,14,0.36)",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${accent}`,
                      color: accent,
                      fontFamily: matrixOpcTheme.monoFont,
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div style={{ color: matrixOpcTheme.colors.text, fontSize: 31, lineHeight: 1.12, fontWeight: 900 }}>{item}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
