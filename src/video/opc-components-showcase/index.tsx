import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandSignature } from "../matrix-opc/components/BrandSignature";
import { MatrixProgressNav } from "../matrix-opc/components/MatrixProgressNav";
import { VfxClip } from "../vfx";
import { SceneLabel, SubtitleLayer, VideoShell } from "../vfx/components/analysis/SystemShell";
import { showcaseScenes } from "./showcaseEffects";

const sceneDuration = 120;
const sections = ["P2 SHELL", "P0 EVIDENCE", "P0 COMPARE", "P0 METRIC", "P0 FLOW", "P1 CHARTS", "P2 NETWORK", "LEGACY"];

export const opcShowcaseDuration = showcaseScenes.length * sceneDuration;

export const OpcComponentsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const activeIndex = Math.min(showcaseScenes.length - 1, Math.floor(frame / sceneDuration));
  const active = showcaseScenes[activeIndex];
  const activeSection = active.section.startsWith("P1") && ["P1 BAR", "P1 LINE", "P1 DONUT", "P1 GAUGE"].includes(active.section) ? "P1 CHARTS" : active.section;
  const progress = frame / Math.max(durationInFrames - 1, 1);
  const activeSectionIndex = Math.max(0, sections.findIndex((section) => section === activeSection));

  return (
    <VideoShell>
      <MatrixProgressNav
        frame={frame}
        steps={sections.map((title) => ({ title }))}
        activeIndex={activeSectionIndex}
        progress={progress}
      />
      <SceneLabel id={active.effect.id} title={active.effect.name} />
      <SubtitleLayer text={active.subtitle} />
      <AbsoluteFill style={{ top: 0 }}>
        {showcaseScenes.map((scene, index) => (
          <Sequence key={scene.effect.id} from={index * sceneDuration} durationInFrames={sceneDuration}>
            <VfxClip effect={scene.effect} durationInFrames={sceneDuration} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <BrandSignature frame={frame} />
    </VideoShell>
  );
};
