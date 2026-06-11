import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { appear } from "../utils";
import { getMatrixAccent, matrixOpcTheme } from "../../matrix-opc";

const cornerBase = {
  position: "absolute" as const,
  width: 28,
  height: 28,
  pointerEvents: "none" as const,
};

export const NextEpisodePackage: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getMatrixAccent(effect.color === "red" ? "red" : effect.color === "blue" ? "blue" : effect.color === "yellow" ? "orange" : "green");
  const y = interpolate(frame, [0, 18], [42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: matrixOpcTheme.fontFamily, color: matrixOpcTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          left: matrixOpcTheme.layout.leftPanelX,
          bottom: 220,
          width: 820,
          padding: "28px 30px 34px",
          background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panel}, rgba(0,8,6,0.54))`,
          border: `1px solid ${accent}66`,
          boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 18px ${accent}18`,
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ ...cornerBase, top: -1, left: -1, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, top: -1, right: -1, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, bottom: -1, left: -1, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
        <div style={{ ...cornerBase, bottom: -1, right: -1, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
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
            {effect.eyebrow || "NEXT COMMAND"}
          </div>
          <div style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 12, letterSpacing: 1.2 }}>
            / {effect.subLabel || effect.name || "下期预告"}
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 42, fontWeight: 950, lineHeight: 1.08 }}>
          {effect.mainTitle || effect.title || effect.name || "下期内容"}
        </div>
        {effect.subtitle ? (
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 850, color: matrixOpcTheme.colors.muted }}>
            {effect.subtitle}
          </div>
        ) : null}
        {effect.commentKeyword ? (
          <div
            style={{
              marginTop: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              border: `1px solid ${accent}`,
              background: `${accent}14`,
            }}
          >
            <span style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 15, letterSpacing: 2 }}>
              COMMENT
            </span>
            <span style={{ color: accent, fontSize: 26, fontWeight: 950 }}>{effect.commentKeyword}</span>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
