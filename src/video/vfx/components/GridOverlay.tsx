import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { getAccentColor } from "../themes";
import { fadeInOut } from "../primitives";

export const GridOverlay: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const accent = getAccentColor(effect.color ?? "blue");
  const opacity = fadeInOut(frame, durationInFrames, 12, 12);
  const shift = interpolate(frame, [0, durationInFrames], [0, 42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(${accent}24 1px, transparent 1px),
          linear-gradient(90deg, ${accent}24 1px, transparent 1px)
        `,
        backgroundSize: "42px 42px",
        backgroundPosition: `${shift}px ${shift}px`,
        maskImage: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.35) 72%, rgba(0,0,0,0))",
      }}
    />
  );
};
