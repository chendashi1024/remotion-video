import { AbsoluteFill, Easing, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { appear } from "../utils";
import { matrixOpcTheme } from "../../matrix-opc";

const statusRows = [
  { label: "生成内容", value: "90%", state: "HIGH WASTE RISK" },
  { label: "沉淀路径", value: "0", state: "NO ASSET TRACE" },
  { label: "复用指数", value: "LOW", state: "SYSTEM REQUIRED" },
];

const cornerBase = {
  position: "absolute" as const,
  width: 30,
  height: 30,
  pointerEvents: "none" as const,
};

export const ProgramPackage: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = effect.color === "red" ? matrixOpcTheme.colors.red : effect.color === "yellow" ? matrixOpcTheme.colors.orange : matrixOpcTheme.colors.green;
  const scan = interpolate(frame, [0, durationInFrames], [-220, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const progress = interpolate(frame, [8, durationInFrames - 18], [0.08, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOffset = interpolate(frame, [0, 18], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleLines = effect.titleLines?.length ? effect.titleLines : [effect.name || "内容风险扫描"];

  return (
    <AbsoluteFill style={{ fontFamily: matrixOpcTheme.fontFamily, color: matrixOpcTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 134,
          left: matrixOpcTheme.layout.leftPanelX,
          width: 860,
          height: 430,
          padding: "30px 34px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panelDeep}, rgba(0, 18, 14, 0.58))`,
          border: `1px solid ${accent}66`,
          boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 20px ${accent}1f`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(40,245,154,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(40,245,154,0.2) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: scan,
            width: 190,
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${accent}22, transparent)`,
            transform: "skewX(-12deg)",
          }}
        />
        <div style={{ ...cornerBase, top: 8, left: 8, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, top: 8, right: 8, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, bottom: 8, left: 8, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, right: 8, bottom: 8, borderRight: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 268px", gap: 34 }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                color: accent,
                fontFamily: matrixOpcTheme.monoFont,
                fontSize: 19,
                fontWeight: 900,
                letterSpacing: 2.6,
                textTransform: "uppercase",
                transform: `translateY(${lineOffset}px)`,
              }}
            >
              <span style={{ width: 10, height: 10, background: accent, boxShadow: `0 0 14px ${accent}` }} />
              {effect.eyebrow || "ASSET SYSTEM"}
              <span style={{ color: matrixOpcTheme.colors.muted, fontSize: 12, letterSpacing: 1.4 }}>/ {effect.indexText || "1/7"}</span>
            </div>
            <div style={{ marginTop: 26, display: "grid", gap: 8 }}>
              {titleLines.slice(0, 2).map((line, index) => {
                const active = index === effect.highlightLineIndex;
                return (
                  <div
                    key={`${line}-${index}`}
                    style={{
                      fontSize: 58,
                      lineHeight: 1.03,
                      fontWeight: 950,
                      letterSpacing: 0,
                      color: active ? accent : matrixOpcTheme.colors.text,
                      textShadow: active ? `0 0 20px ${accent}44` : "none",
                      transform: `translateY(${Math.max(0, lineOffset - index * 7)}px)`,
                    }}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 30,
                width: 490,
                height: 8,
                border: `1px solid ${accent}55`,
                background: "rgba(0,0,0,0.22)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${accent}, ${matrixOpcTheme.colors.greenHot})`,
                  boxShadow: `0 0 18px ${accent}44`,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 12,
                color: matrixOpcTheme.colors.muted,
                fontFamily: matrixOpcTheme.monoFont,
                fontSize: 13,
                letterSpacing: 1.4,
              }}
            >
              CONTENT ASSET SCAN // {effect.subLabel || effect.name || "SYSTEM CHECK"}
            </div>
          </div>
          <div style={{ display: "grid", gap: 12, alignContent: "start", paddingTop: 8 }}>
            {statusRows.map((row, index) => {
              const rowOpacity = interpolate(frame - index * 5, [0, 10], [0.35, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={row.label}
                  style={{
                    opacity: rowOpacity,
                    padding: "14px 16px",
                    border: `1px solid ${index === 0 ? accent : matrixOpcTheme.colors.hairline}`,
                    background: index === 0 ? `${accent}12` : "rgba(0, 14, 11, 0.48)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ color: matrixOpcTheme.colors.muted, fontSize: 15, fontWeight: 800 }}>{row.label}</div>
                    <div style={{ color: index === 0 ? accent : matrixOpcTheme.colors.text, fontSize: 26, fontWeight: 950 }}>
                      {row.value}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      color: index === 0 ? accent : matrixOpcTheme.colors.muted,
                      fontFamily: matrixOpcTheme.monoFont,
                      fontSize: 11,
                      letterSpacing: 1,
                    }}
                  >
                    {row.state}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
