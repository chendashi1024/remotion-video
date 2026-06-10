import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { getAccentColor } from "../themes";
import { fadeInOut } from "../primitives";
import { vfxTheme } from "../theme";

export const FocusRing: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const accent = getAccentColor(effect.color ?? "yellow");
  const opacity = fadeInOut(frame, durationInFrames, 8, 12);
  const scale = interpolate(frame, [0, 16], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: effect.layout === "right" ? 1370 : vfxTheme.layout.leftX,
          top: 300,
          width: 390,
          height: 220,
          border: `5px solid ${accent}`,
          borderRadius: 18,
          boxShadow: `0 0 28px ${accent}, inset 0 0 18px ${accent}44`,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
};
