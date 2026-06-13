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
import {
  AgentStatusPanel,
  BarChartPanel,
  CompareCard,
  CostCard,
  DonutChartPanel,
  EvidenceCard,
  FlowPipelineCard,
  LineChartPanel,
  MetricCounterCard,
  NetworkGraph,
  ProgressGauge,
  QuoteCard,
  TerminalLogCard,
} from "./components/analysis/AnalysisCards";

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
  EvidenceCard,
  CompareCard,
  MetricCounterCard,
  FlowPipelineCard,
  TerminalLogCard,
  QuoteCard,
  CostCard,
  BarChartPanel,
  LineChartPanel,
  DonutChartPanel,
  ProgressGauge,
  AgentStatusPanel,
  NetworkGraph,
};

export const isKnownVfxType = (type: string): type is VfxType => type in vfxRegistry;
