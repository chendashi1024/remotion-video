import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandSignature } from "./components/BrandSignature";
import { MatrixProgressNav, type MatrixProgressStep } from "./components/MatrixProgressNav";

const defaultSteps: MatrixProgressStep[] = [
  { title: "机会扫描" },
  { title: "结构拆解" },
  { title: "风险判断" },
  { title: "行动建议" },
  { title: "数据回流" },
];

export const MatrixPersistentOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = Math.min(Math.max(frame / Math.max(durationInFrames - 1, 1), 0), 1);
  const activeIndex = Math.min(defaultSteps.length - 1, Math.floor(progress * defaultSteps.length));
  const entranceOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const entranceY = interpolate(frame, [0, 24], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <AbsoluteFill style={{ opacity: entranceOpacity, transform: `translateY(${entranceY}px)` }}>
        <MatrixProgressNav frame={frame} steps={defaultSteps} activeIndex={activeIndex} progress={progress} />
        <BrandSignature frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
