import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MatrixProgressNav } from "../matrix-opc";
import type { VideoTimeline } from "./types";

type ChapterProgressBarProps = {
  timeline: VideoTimeline;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const ChapterProgressBar: React.FC<ChapterProgressBarProps> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  const duration = Math.max(timeline.duration, 0.1);
  const chapters = timeline.chapters.filter((chapter) => chapter.end > chapter.start);
  const activeIndex = chapters.findIndex((chapter) => currentTime >= chapter.start && currentTime < chapter.end);
  const normalizedActiveIndex = activeIndex === -1 ? Math.max(chapters.length - 1, 0) : activeIndex;
  const progress = clamp(currentTime / duration, 0, 1);
  const progressIndex = Math.floor(progress * chapters.length);
  const safeActiveIndex = Math.min(Math.max(normalizedActiveIndex, progressIndex, 0), Math.max(chapters.length - 1, 0));

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <MatrixProgressNav
        frame={frame}
        steps={chapters.map((chapter) => ({ title: chapter.title, start: chapter.start, end: chapter.end }))}
        activeIndex={safeActiveIndex}
        progress={progress}
      />
    </AbsoluteFill>
  );
};
