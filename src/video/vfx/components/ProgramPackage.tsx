import type { VfxComponentProps } from "../types";
import { BreakingLabel } from "./BreakingLabel";
import { HeroTopicTitle } from "./HeroTopicTitle";
import { DataPulse } from "./DataPulse";
import { GlowSweep } from "./GlowSweep";

export const ProgramPackage: React.FC<VfxComponentProps> = (props) => {
  return (
    <>
      <BreakingLabel {...props} />
      <HeroTopicTitle {...props} effect={{ ...props.effect, eyebrow: props.effect.eyebrow || "MOQI · OPC" }} />
      <DataPulse {...props} effect={{ ...props.effect, color: props.effect.color ?? "blue" }} />
      <GlowSweep {...props} />
    </>
  );
};
