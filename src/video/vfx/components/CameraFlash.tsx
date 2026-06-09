import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";

export const CameraFlash: React.FC<VfxComponentProps> = ({ frame, durationInFrames }) => {
  const first = interpolate(frame, [0, 4, 12], [0, 0.78, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames - 6, durationInFrames], [0, 0.32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <AbsoluteFill style={{ backgroundColor: "white", opacity: Math.max(first, exit), mixBlendMode: "screen" }} />;
};
