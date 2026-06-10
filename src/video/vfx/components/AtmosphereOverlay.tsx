import { AbsoluteFill } from "remotion";
import type { VfxComponentProps } from "../types";
import { DataPulse } from "./DataPulse";
import { GlowSweep } from "./GlowSweep";
import { GridOverlay } from "./GridOverlay";

export const AtmosphereOverlay: React.FC<VfxComponentProps> = (props) => {
  if (props.effect.overlayType === "grid" || props.effect.overlayType === "scanline") {
    return <GridOverlay {...props} />;
  }
  if (props.effect.overlayType === "noise") {
    return <DataPulse {...props} />;
  }
  if (props.effect.overlayType === "vignette") {
    return <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.42)", opacity: 0.8 }} />;
  }
  return <GlowSweep {...props} />;
};
