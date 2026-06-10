import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isKnownVfxType, vfxRegistry } from "./registry";
import type { VfxClipProps } from "./types";
import { vfxTheme } from "./theme";

export const VfxClip: React.FC<VfxClipProps> = ({ effect, durationInFrames }) => {
  const frame = useCurrentFrame();
  const config = useVideoConfig();
  const resolvedDuration = durationInFrames ?? config.durationInFrames;
  const Component = isKnownVfxType(effect.type) ? vfxRegistry[effect.type] : vfxRegistry.ProgramPackage;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", fontFamily: vfxTheme.fontFamily }}>
      <Component effect={effect} frame={frame} durationInFrames={resolvedDuration} />
    </AbsoluteFill>
  );
};

export const defaultVfxEffect = {
  mode: "自动",
  id: "VFX-001",
  type: "ProgramPackage",
  anchor: "",
  name: "示例动效",
  text: "",
  motion: "逐字弹出",
  duration: "3秒",
  sound: "digital hit",
  outputName: "VFX-001-ProgramPackage-示例动效.mov",
  requiredAction: "",
  capcutAction: "",
};
