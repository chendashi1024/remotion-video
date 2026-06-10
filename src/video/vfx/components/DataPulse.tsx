import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { getAccentColor } from "../themes";
import { fadeInOut } from "../primitives";
import { vfxTheme } from "../theme";

export const DataPulse: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const accent = getAccentColor(effect.color ?? "green");
  const opacity = fadeInOut(frame, durationInFrames, 8, 12);
  const pulse = interpolate(frame % 24, [0, 12, 24], [0.38, 1, 0.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, fontFamily: "monospace", color: accent }}>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: vfxTheme.layout.leftX + index * 96,
            top: 170 + ((index * 71) % 430),
            width: 56,
            height: 3,
            background: accent,
            opacity: pulse * (0.25 + (index % 3) * 0.18),
            boxShadow: `0 0 16px ${accent}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
