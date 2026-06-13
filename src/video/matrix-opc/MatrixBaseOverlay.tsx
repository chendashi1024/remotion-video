import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandSignature } from "./components/BrandSignature";
import { MatrixProgressNav, type MatrixProgressStep } from "./components/MatrixProgressNav";

type MatrixBaseOverlayProps = {
  steps: MatrixProgressStep[];
  activeIndex?: number;
  progress?: number;
};

export const MatrixBaseOverlay: React.FC<MatrixBaseOverlayProps> = ({ steps, activeIndex, progress }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const normalizedProgress = progress ?? Math.min(Math.max(frame / Math.max(durationInFrames - 1, 1), 0), 1);
  const normalizedActiveIndex =
    activeIndex ?? Math.min(Math.max(Math.floor(normalizedProgress * steps.length), 0), Math.max(steps.length - 1, 0));
  const entranceOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 1000, opacity: entranceOpacity }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 92,
          background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.26) 54%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 170,
          background: "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 48%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.30) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.30) 100%)",
        }}
      />
      <MatrixProgressNav
        frame={frame}
        steps={steps}
        activeIndex={normalizedActiveIndex}
        progress={normalizedProgress}
        edgeInset={0}
        variant="chapterStatus"
      />
      <BrandSignature frame={frame} />
    </AbsoluteFill>
  );
};
