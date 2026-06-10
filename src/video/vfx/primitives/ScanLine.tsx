import { AbsoluteFill } from "remotion";
import { programTheme } from "../themes";
import { sweepX } from "./motion";

type ScanLineProps = {
  frame: number;
  durationInFrames: number;
  opacity?: number;
};

export const ScanLine: React.FC<ScanLineProps> = ({ frame, durationInFrames, opacity = 0.22 }) => {
  const x = sweepX(frame, 1920, durationInFrames);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x,
          width: 120,
          opacity,
          background: `linear-gradient(90deg, rgba(34,211,238,0), ${programTheme.colors.cyan}, rgba(34,211,238,0))`,
          filter: "blur(18px)",
          transform: "skewX(-14deg)",
        }}
      />
    </AbsoluteFill>
  );
};
