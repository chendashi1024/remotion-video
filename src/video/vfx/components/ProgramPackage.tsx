import type { VfxComponentProps } from "../types";
import { BreakingLabel } from "./BreakingLabel";
import { HeroTopicTitle } from "./HeroTopicTitle";
import { ProgramHeader } from "./ProgramHeader";

export const ProgramPackage: React.FC<VfxComponentProps> = (props) => {
  return (
    <>
      <ProgramHeader {...props} />
      <BreakingLabel {...props} />
      <HeroTopicTitle {...props} effect={{ ...props.effect, eyebrow: "AI · ASSET" }} />
    </>
  );
};
