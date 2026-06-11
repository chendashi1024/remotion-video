import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { appear } from "../utils";
import { getMatrixAccent, matrixOpcTheme } from "../../matrix-opc";

const cornerBase = {
  position: "absolute" as const,
  width: 30,
  height: 30,
  pointerEvents: "none" as const,
};

export const ConceptContrast: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getMatrixAccent(effect.color === "red" ? "red" : effect.color === "blue" ? "blue" : effect.color === "yellow" ? "orange" : "green");
  const leftX = interpolate(frame, [0, 16], [-42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightX = interpolate(frame, [4, 22], [56, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scan = interpolate(frame, [0, durationInFrames], [-200, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: matrixOpcTheme.fontFamily, color: matrixOpcTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: matrixOpcTheme.layout.leftPanelY + 160,
          left: matrixOpcTheme.layout.leftPanelX,
          width: 820,
          padding: "28px 30px 34px",
          background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panel}, rgba(0,8,6,0.54))`,
          border: `1px solid ${accent}66`,
          boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 18px ${accent}18`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.14,
            backgroundImage:
              "linear-gradient(rgba(40,245,154,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(40,245,154,0.18) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: scan,
            width: 160,
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${accent}1a, transparent)`,
            transform: "skewX(-12deg)",
          }}
        />
        <div style={{ ...cornerBase, top: 8, left: 8, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, top: 8, right: 8, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, bottom: 8, left: 8, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, bottom: 8, right: 8, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
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
            {effect.eyebrow || "OUTPUT vs ASSET"}
          </div>
          <div style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 12, letterSpacing: 1.2 }}>
            / {effect.subLabel || effect.name || "对比分析"}
          </div>
        </div>
        <div style={{ marginTop: 24, display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
          <div
            style={{
              padding: "22px 26px",
              opacity: 0.78,
              border: `1px solid ${matrixOpcTheme.colors.hairline}`,
              background: "rgba(0,14,11,0.48)",
              transform: `translateX(${leftX}px)`,
            }}
          >
            <div style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 17, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
              {effect.leftLabel || "OUTPUT"}
            </div>
            <div style={{ marginTop: 10, fontSize: 38, lineHeight: 1.08, fontWeight: 950 }}>
              {effect.leftText || "生成很多"}
            </div>
          </div>
          <div
            style={{
              padding: "24px 28px",
              border: `1px solid ${accent}`,
              background: `${accent}12`,
              boxShadow: `0 0 28px ${accent}33`,
              transform: `translateX(${rightX}px)`,
            }}
          >
            <div style={{ color: accent, fontFamily: matrixOpcTheme.monoFont, fontSize: 17, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
              {effect.rightLabel || "ASSET"}
            </div>
            <div style={{ marginTop: 10, color: accent, fontSize: 42, lineHeight: 1.04, fontWeight: 950 }}>
              {effect.rightText || "留下很少"}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
