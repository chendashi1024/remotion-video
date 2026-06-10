import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { appear } from "../utils";

const colorMap = {
  blue: vfxTheme.colors.blue,
  yellow: vfxTheme.colors.gold,
  green: vfxTheme.colors.green,
  red: vfxTheme.colors.red,
};

export const HeroTopicTitle: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const titleLines = effect.titleLines?.length ? effect.titleLines.slice(0, 3) : splitVisualText(effect.text || effect.name).slice(0, 3);
  const accent = colorMap[effect.color ?? "yellow"];
  const highlightLineIndex = effect.highlightLineIndex ?? titleLines.length - 1;
  const x = interpolate(frame, [0, 18], [-56, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: vfxTheme.layout.titleY,
          left: vfxTheme.layout.leftX,
          width: vfxTheme.layout.leftWidth,
          transform: `translateX(${x}px)`,
        }}
      >
        <div
          style={{
            color: effect.color === "yellow" ? vfxTheme.colors.blue : vfxTheme.colors.cyan,
            fontSize: 23,
            fontWeight: 1000,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 12,
            textShadow: "0 2px 0 rgba(0,0,0,0.42)",
          }}
        >
          {effect.eyebrow || "AI · ASSET"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {titleLines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                color: index === highlightLineIndex ? accent : vfxTheme.colors.text,
                fontSize: line.length > 6 ? 64 : 78,
                lineHeight: 0.96,
                fontWeight: 1000,
                letterSpacing: 0,
                textShadow:
                  index === highlightLineIndex
                    ? `0 0 10px ${accent}44, 0 4px 0 rgba(0,0,0,0.42)`
                    : "0 4px 0 rgba(0,0,0,0.44), 0 0 10px rgba(255,255,255,0.18)",
                WebkitTextStroke: "0.7px rgba(255,255,255,0.14)",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
