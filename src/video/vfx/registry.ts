import type { VfxComponentProps, VfxType } from "./types";
import { BreakingLabel } from "./components/BreakingLabel";
import { CTAEnd } from "./components/CTAEnd";
import { HeroTitle } from "./components/HeroTitle";
import { HeroTopicTitle } from "./components/HeroTopicTitle";
import { KeywordCards } from "./components/KeywordCards";
import { LowerThird } from "./components/LowerThird";
import { MilestoneNumber } from "./components/MilestoneNumber";
import { NumberCard } from "./components/NumberCard";
import { ProgramHeader } from "./components/ProgramHeader";
import { ProgramPackage } from "./components/ProgramPackage";
import { ProofCard } from "./components/ProofCard";
import { RiskCard } from "./components/RiskCard";
import { SectionTitle } from "./components/SectionTitle";
import { StepList } from "./components/StepList";
import { StepSystem } from "./components/StepSystem";

export const vfxRegistry: Record<VfxType, React.FC<VfxComponentProps>> = {
  HeroTitle,
  ProgramHeader,
  BreakingLabel,
  HeroTopicTitle,
  MilestoneNumber,
  ProofCard,
  ProgramPackage,
  StepSystem,
  LowerThird,
  SectionTitle,
  StepList,
  NumberCard,
  KeywordCards,
  RiskCard,
  CTAEnd,
};

export const isKnownVfxType = (type: string): type is VfxType => type in vfxRegistry;
