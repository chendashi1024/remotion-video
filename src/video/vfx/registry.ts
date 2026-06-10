import type { VfxComponentProps, VfxType } from "./types";
import { AtmosphereOverlay } from "./components/AtmosphereOverlay";
import { ConceptContrast } from "./components/ConceptContrast";
import { InfraNetwork } from "./components/InfraNetwork";
import { MilestoneNumber } from "./components/MilestoneNumber";
import { NextEpisodePackage } from "./components/NextEpisodePackage";
import { ProgramPackage } from "./components/ProgramPackage";
import { ProofCard } from "./components/ProofCard";
import { RevenueSignal } from "./components/RevenueSignal";
import { RiskPackage } from "./components/RiskPackage";
import { StepSystem } from "./components/StepSystem";

export const vfxRegistry: Record<VfxType, React.FC<VfxComponentProps>> = {
  ProgramPackage,
  ConceptContrast,
  StepSystem,
  RiskPackage,
  InfraNetwork,
  MilestoneNumber,
  RevenueSignal,
  ProofCard,
  NextEpisodePackage,
  AtmosphereOverlay,
};

export const isKnownVfxType = (type: string): type is VfxType => type in vfxRegistry;
