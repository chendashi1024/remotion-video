import { AbsoluteFill } from "remotion";
import { ChapterProgressBar } from "./ChapterProgressBar";
import type { ChapterTimelineProps } from "./types";

export const fallbackTimeline = {
  videoTitle: "章节时间轴",
  duration: 60,
  chapters: [
    { title: "开场", start: 0, end: 15 },
    { title: "展开", start: 15, end: 40 },
    { title: "收束", start: 40, end: 60 },
  ],
};

export const ChapterTimeline: React.FC<ChapterTimelineProps> = ({ timeline }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <ChapterProgressBar timeline={timeline} />
    </AbsoluteFill>
  );
};
