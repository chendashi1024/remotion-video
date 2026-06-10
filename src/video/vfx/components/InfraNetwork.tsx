import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { getAccentColor } from "../themes";
import { splitVisualText, vfxTheme } from "../theme";
import { appear } from "../utils";

const points = [
  [220, 570],
  [430, 400],
  [650, 570],
  [430, 725],
  [680, 370],
];

export const InfraNetwork: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const accent = getAccentColor(effect.color ?? "blue");
  const nodes = (effect.nodes?.length ? effect.nodes : splitVisualText(effect.text || effect.name)).slice(0, 5);

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div style={{ position: "absolute", top: 150, left: vfxTheme.layout.leftX, width: 660 }}>
        <div style={{ color: accent, fontSize: 23, fontWeight: 1000, letterSpacing: 5, textTransform: "uppercase" }}>{effect.eyebrow || "SYSTEM MAP"}</div>
        <div style={{ marginTop: 8, fontSize: 27, fontWeight: 850, color: "rgba(248,250,252,0.72)" }}>{effect.subLabel || effect.name}</div>
        <div style={{ marginTop: 16, fontSize: 48, fontWeight: 1000, lineHeight: 1.06 }}>{effect.mainTitle || effect.name}</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(1).map((_, index) => (
          <line
            key={index}
            x1={points[0][0]}
            y1={points[0][1]}
            x2={points[index + 1][0]}
            y2={points[index + 1][1]}
            stroke={accent}
            strokeWidth="3"
            opacity={interpolate(frame - index * 6, [0, 12], [0, 0.44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
        ))}
      </svg>
      {nodes.map((node, index) => {
        const active = index === effect.highlightNode;
        return (
          <div
            key={`${node}-${index}`}
            style={{
              position: "absolute",
              left: points[index][0] - 78,
              top: points[index][1] - 42,
              width: 156,
              minHeight: 84,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 16px",
              color: active ? "#06121f" : vfxTheme.colors.text,
              background: active ? accent : "rgba(2,6,23,0.74)",
              border: `1px solid ${accent}`,
              boxShadow: `0 0 28px ${accent}55`,
              fontSize: 24,
              fontWeight: 950,
              opacity: interpolate(frame - index * 8, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {node}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
