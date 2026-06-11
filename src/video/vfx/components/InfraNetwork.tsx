import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText } from "../theme";
import { appear } from "../utils";
import { getMatrixAccent, matrixOpcTheme } from "../../matrix-opc";

const cornerBase = {
  position: "absolute" as const,
  width: 28,
  height: 28,
  pointerEvents: "none" as const,
};

const nodePositions = [
  { x: 80, y: 230 },
  { x: 330, y: 90 },
  { x: 580, y: 230 },
  { x: 330, y: 350 },
  { x: 610, y: 60 },
];

export const InfraNetwork: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getMatrixAccent(effect.color === "red" ? "red" : effect.color === "blue" ? "blue" : effect.color === "yellow" ? "orange" : "green");
  const nodes = (effect.nodes?.length ? effect.nodes : splitVisualText(effect.text || effect.name)).slice(0, 5);
  const panelWidth = 820;
  const panelHeight = 510;

  return (
    <AbsoluteFill style={{ fontFamily: matrixOpcTheme.fontFamily, color: matrixOpcTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: matrixOpcTheme.layout.leftPanelY + 130,
          left: matrixOpcTheme.layout.leftPanelX,
          width: panelWidth,
          height: panelHeight,
          padding: "28px 30px 34px",
          background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panel}, rgba(0,8,6,0.54))`,
          border: `1px solid ${accent}66`,
          boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 18px ${accent}18`,
          overflow: "hidden",
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
            {effect.eyebrow || "OPC ASSET SYSTEM"}
          </div>
          <div style={{ color: matrixOpcTheme.colors.muted, fontFamily: matrixOpcTheme.monoFont, fontSize: 12, letterSpacing: 1.2 }}>
            / {effect.subLabel || effect.name || "系统架构"}
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 36, lineHeight: 1.06, fontWeight: 950, letterSpacing: 0 }}>
          {effect.mainTitle || effect.name || "内容资产系统"}
        </div>
        <div style={{ position: "relative", marginTop: 18, height: 390 }}>
          <svg width="760" height="390" style={{ position: "absolute", inset: 0 }}>
            {nodes.slice(1).map((_, index) => (
              <line
                key={index}
                x1={nodePositions[0].x}
                y1={nodePositions[0].y}
                x2={nodePositions[index + 1].x}
                y2={nodePositions[index + 1].y}
                stroke={accent}
                strokeWidth="2"
                opacity={interpolate(frame - index * 6, [0, 12], [0, 0.38], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            ))}
            {/* 回流线：从最后一个节点回到中心 */}
            {nodes.length >= 2 ? (
              <line
                x1={nodePositions[nodes.length - 1]?.x ?? nodePositions[1].x}
                y1={nodePositions[nodes.length - 1]?.y ?? nodePositions[1].y}
                x2={nodePositions[0].x}
                y2={nodePositions[0].y}
                stroke={accent}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity={interpolate(frame - nodes.length * 6, [0, 16], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            ) : null}
          </svg>
          {nodes.map((node, index) => {
            const active = index === effect.highlightNode;
            const pos = nodePositions[index] ?? nodePositions[0];
            return (
              <div
                key={`${node}-${index}`}
                style={{
                  position: "absolute",
                  left: pos.x - 65,
                  top: pos.y - 36,
                  width: 130,
                  minHeight: 72,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "0 14px",
                  color: active ? matrixOpcTheme.colors.bg : matrixOpcTheme.colors.text,
                  background: active ? accent : matrixOpcTheme.colors.panel,
                  border: `1px solid ${active ? accent : matrixOpcTheme.colors.hairline}`,
                  boxShadow: active ? `0 0 24px ${accent}55` : matrixOpcTheme.shadow.greenSoft,
                  fontSize: 22,
                  fontWeight: 950,
                  opacity: interpolate(frame - index * 8, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                {node}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
