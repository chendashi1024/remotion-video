import type { VfxComponentProps, VfxType } from "./types";
import { CTAEnd } from "./components/CTAEnd";
import { HeroTitle } from "./components/HeroTitle";
import { KeywordCards } from "./components/KeywordCards";
import { NumberCard } from "./components/NumberCard";
import { RiskCard } from "./components/RiskCard";
import { SectionTitle } from "./components/SectionTitle";
import { StepList } from "./components/StepList";

export const vfxRegistry: Record<VfxType, React.FC<VfxComponentProps>> = {
  HeroTitle,
  SectionTitle,
  StepList,
  NumberCard,
  KeywordCards,
  RiskCard,
  CTAEnd,
};

export const isKnownVfxType = (type: string): type is VfxType => type in vfxRegistry;
