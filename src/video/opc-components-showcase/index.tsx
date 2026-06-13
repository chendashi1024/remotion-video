import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { VfxClip } from "../vfx";
import { BottomSystemBar, SceneLabel, SubtitleLayer, TopHudNav, useCompositionProgress, VideoShell } from "../vfx/components/analysis/SystemShell";
import { showcaseScenes } from "./showcaseEffects";

const sceneDuration = 120;
const sections = ["P2 SHELL", "P0 EVIDENCE", "P0 COMPARE", "P0 METRIC", "P0 FLOW", "P1 CHARTS", "P2 NETWORK", "LEGACY"];

export const opcShowcaseDuration = showcaseScenes.length * sceneDuration;

export const OpcComponentsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const activeIndex = Math.min(showcaseScenes.length - 1, Math.floor(frame / sceneDuration));
  const active = showcaseScenes[activeIndex];
  const activeSection = active.section.startsWith("P1") && ["P1 BAR", "P1 LINE", "P1 DONUT", "P1 GAUGE"].includes(active.section) ? "P1 CHARTS" : active.section;
  const progress = useCompositionProgress();

  return (
    <VideoShell>
      <TopHudNav active={activeSection} sections={sections} />
      <BottomSystemBar progress={progress} label={`${String(activeIndex + 1).padStart(2, "0")} / ${showcaseScenes.length}`} />
      <SceneLabel id={active.effect.id} title={active.effect.name} />
      <SubtitleLayer text={active.subtitle} />
      <AbsoluteFill style={{ top: 0 }}>
        {showcaseScenes.map((scene, index) => (
          <Sequence key={scene.effect.id} from={index * sceneDuration} durationInFrames={sceneDuration}>
            <VfxClip effect={scene.effect} durationInFrames={sceneDuration} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </VideoShell>
  );
};
