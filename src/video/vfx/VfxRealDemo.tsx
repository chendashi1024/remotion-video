import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandSignature } from "../matrix-opc/components/BrandSignature";
import { MatrixProgressNav } from "../matrix-opc/components/MatrixProgressNav";
import { vfxRegistry } from "./registry";
import type { VfxBriefItem, VfxComponentProps } from "./types";

type VfxRealDemoProps = {
  effects: VfxBriefItem[];
  backgroundImage?: string;
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

export const VfxRealDemo: React.FC<VfxRealDemoProps> = ({
  effects,
  backgroundImage = "person.png",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const activeEffects = effects.length > 0 ? effects : [];
  const progress = frame / Math.max(durationInFrames - 1, 1);
  const activeIndex = Math.min(stepTitles.length - 1, Math.floor(progress * stepTitles.length));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* 真实拍摄底帧 */}
      <AbsoluteFill>
        <Img
          src={staticFile(backgroundImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* 底部暗色渐变，让 VFX 面板更突出 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(2,7,6,0.15) 0%, rgba(2,7,6,0.35) 60%, rgba(2,7,6,0.65) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* VFX 动效层 */}
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

      {/* 顶部时间轴 */}
      <MatrixProgressNav
        frame={frame}
        steps={stepTitles.map((title) => ({ title }))}
        activeIndex={activeIndex}
        progress={progress}
      />

      {/* 左下角品牌 */}
      <BrandSignature />
    </AbsoluteFill>
  );
};
