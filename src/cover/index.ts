import { getCompositionId } from "./text";
import { coverVariants } from "./variants";
import { sampleCoverData } from "./sampleData";

export { CoverStill } from "./CoverStill";
export type { CoverData, CoverVariant } from "./types";
export { coverVariants, getCompositionId, sampleCoverData };

export const coverCompositions = coverVariants.map((variant) => ({
  id: getCompositionId(sampleCoverData, variant),
  data: sampleCoverData,
  variant,
}));
