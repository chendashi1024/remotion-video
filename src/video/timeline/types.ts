export type TimelineChapter = {
  title: string;
  start: number;
  end: number;
};

export type VideoTimeline = {
  videoTitle: string;
  duration: number;
  chapters: TimelineChapter[];
};

export type ChapterTimelineProps = {
  timeline: VideoTimeline;
};
