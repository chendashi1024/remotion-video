import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { vfxTheme } from "../vfx/theme";
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
  const entrance = interpolate(frame, [0, 18], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text }}>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          width: 680,
          transform: `translateY(${entrance}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            height: 58,
            borderRadius: 6,
            border: "1px solid rgba(125, 211, 252, 0.3)",
            background: "linear-gradient(90deg, rgba(2,6,23,0.56), rgba(15,23,42,0.34))",
            boxShadow: "0 18px 42px rgba(0,0,0,0.24)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, rgba(34,211,238,0.34), rgba(251,191,36,0.32))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 3,
              background: "rgba(148,163,184,0.26)",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: vfxTheme.colors.gold,
                boxShadow: vfxTheme.shadow.gold,
              }}
            />
          </div>
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: chapters.map((chapter) => `${Math.max(chapter.end - chapter.start, 0.1)}fr`).join(" "),
              height: "100%",
            }}
          >
            {chapters.map((chapter, index) => {
              const isActive = index === normalizedActiveIndex;
              return (
                <div
                  key={`${chapter.title}-${chapter.start}`}
                  style={{
                    position: "relative",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 10px",
                    borderLeft: index === 0 ? "none" : "1px solid rgba(248,250,252,0.24)",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: isActive ? 21 : 18,
                      fontWeight: isActive ? 1000 : 820,
                      color: isActive ? vfxTheme.colors.text : "rgba(248,250,252,0.68)",
                      textShadow: isActive ? "0 0 18px rgba(255,255,255,0.36)" : "none",
                    }}
                  >
                    {chapter.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
