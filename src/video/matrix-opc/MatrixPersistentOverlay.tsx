import { useCurrentFrame, useVideoConfig } from "remotion";
import { MatrixBaseOverlay } from "./MatrixBaseOverlay";
import type { MatrixProgressStep } from "./components/MatrixProgressNav";

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
  return <MatrixBaseOverlay steps={defaultSteps} activeIndex={activeIndex} progress={progress} />;
};
