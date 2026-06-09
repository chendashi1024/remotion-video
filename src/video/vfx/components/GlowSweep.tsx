import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { ScanLine, fadeInOut } from "../primitives";

export const GlowSweep: React.FC<VfxComponentProps> = ({ frame, durationInFrames }) => {
  const opacity = fadeInOut(frame, durationInFrames, 8, 10);

  return (
    <AbsoluteFill style={{ opacity }}>
      <ScanLine frame={frame} durationInFrames={durationInFrames} opacity={0.32} />
    </AbsoluteFill>
  );
};
