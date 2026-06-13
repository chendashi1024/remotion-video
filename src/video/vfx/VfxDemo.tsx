import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MatrixBaseOverlay } from "../matrix-opc";
import { MatrixBackdrop } from "../matrix-opc/components/MatrixBackdrop";
import { matrixOpcTheme } from "../matrix-opc/theme";
import { vfxRegistry } from "./registry";
import type { VfxBriefItem, VfxComponentProps } from "./types";

type VfxDemoProps = {
  effects: VfxBriefItem[];
};

const stepTitles = [
  "内容垃圾警报",
  "产出沉淀反差",
  "内容散落路径",
  "资产四条件",
  "手艺系统反转",
  "三步资产化",
  "内容资产系统",
  "下期资产库",
];

const VfxSlot: React.FC<VfxComponentProps & { index: number; total: number }> = ({
  effect,
  frame,
  durationInFrames,
  index,
  total,
}) => {
  const Component = vfxRegistry[effect.type as keyof typeof vfxRegistry] ?? vfxRegistry.ProgramPackage;
  const slotStart = index * (durationInFrames / total);
  const localFrame = frame - slotStart;
  const slotOpacity = interpolate(
    frame,
    [slotStart, slotStart + 6, slotStart + durationInFrames / total - 8, slotStart + durationInFrames / total],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (localFrame < 0 || slotOpacity <= 0) return null;

  return (
    <AbsoluteFill style={{ opacity: slotOpacity }}>
      <Component effect={effect} frame={Math.max(0, localFrame)} durationInFrames={Math.ceil(durationInFrames / total)} />
    </AbsoluteFill>
  );
};

export const VfxDemo: React.FC<VfxDemoProps> = ({ effects }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const activeEffects = effects.length > 0 ? effects : [];
  const progress = frame / Math.max(durationInFrames - 1, 1);
  const activeIndex = Math.min(stepTitles.length - 1, Math.floor(progress * stepTitles.length));

  return (
    <AbsoluteFill style={{ backgroundColor: matrixOpcTheme.colors.bg, overflow: "hidden" }}>
      <MatrixBackdrop frame={frame} density="low" transparent={false} />
      {activeEffects.map((effect, index) => (
        <VfxSlot
          key={effect.id}
          effect={effect}
          frame={frame}
          durationInFrames={durationInFrames}
          index={index}
          total={activeEffects.length}
        />
      ))}
      <MatrixBaseOverlay steps={stepTitles.map((title) => ({ title }))} activeIndex={activeIndex} progress={progress} />
    </AbsoluteFill>
  );
};
