import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { ProgramTag } from "../primitives";
import { programTheme } from "../themes";
import { appear } from "../utils";

export const BreakingLabel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const x = interpolate(frame, [0, 14], [-42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: programTheme.fontFamily, color: programTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: programTheme.layout.labelY,
          left: programTheme.layout.leftX,
          width: 860,
          transform: `translateX(${x}px)`,
        }}
      >
        <ProgramTag
          label={effect.eyebrow || effect.text || "BREAKING TRACK"}
          subLabel={effect.subLabel || effect.name}
          indexText={effect.indexText}
          color={effect.color ?? "yellow"}
        />
      </div>
    </AbsoluteFill>
  );
};
