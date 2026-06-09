import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { vfxTheme } from "../theme";
import { appear } from "../utils";

const fallbackSections = ["引言", "内容资产定义", "变现问题", "动效工作流", "利他"];

export const ProgramHeader: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const sections = effect.sections?.length ? effect.sections.slice(0, 6) : fallbackSections;
  const activeIndex = Math.min(Math.max(effect.activeIndex ?? 0, 0), sections.length - 1);
  const y = interpolate(frame, [0, 16], [-18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `translateY(${y}px)`,
          background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.28), rgba(0,0,0,0))",
        }}
      >
        {sections.map((section, index) => (
          <div
            key={`${section}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontSize: 28,
              fontWeight: index === activeIndex ? 950 : 780,
              color: index === activeIndex ? vfxTheme.colors.text : "rgba(248,250,252,0.72)",
              textShadow: index === activeIndex ? "0 0 18px rgba(255,255,255,0.35)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {index > 0 ? <span style={{ color: "rgba(248,250,252,0.7)" }}>|</span> : null}
            <span>{section}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
