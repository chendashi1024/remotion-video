import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ArticleVideoData } from "../../articles";

type ArticleDebugVideoProps = {
  data: ArticleVideoData;
};

const baseFont =
  "'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, sans-serif";

export const ArticleDebugVideo: React.FC<ArticleDebugVideoProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const line = interpolate(frame, [18, 72], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: baseFont,
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: 1180,
            padding: "58px 66px",
            border: "2px solid rgba(96, 165, 250, 0.72)",
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.76), rgba(2, 6, 23, 0.48))",
            boxShadow:
              "0 0 44px rgba(59, 130, 246, 0.32), inset 0 0 48px rgba(34, 211, 238, 0.08)",
            transform: `translateY(${(1 - enter) * 34}px) scale(${0.96 + enter * 0.04})`,
            opacity: enter,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#67e8f9",
              marginBottom: 22,
            }}
          >
            ARTICLE / COVER / VIDEO
          </div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 1000,
              lineHeight: 1.08,
              letterSpacing: 0,
              textShadow: "0 12px 30px rgba(0, 0, 0, 0.54)",
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              marginTop: 30,
              width: `${line * 100}%`,
              height: 4,
              background: "linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa)",
              boxShadow: "0 0 22px rgba(34, 211, 238, 0.76)",
            }}
          />
          <div
            style={{
              marginTop: 34,
              fontSize: 38,
              lineHeight: 1.45,
              fontWeight: 650,
              color: "#dbeafe",
            }}
          >
            {data.scriptSummary}
          </div>
          <div
            style={{
              marginTop: 30,
              display: "inline-flex",
              padding: "12px 22px",
              border: "1px solid rgba(34, 211, 238, 0.72)",
              color: "#bae6fd",
              fontSize: 28,
              fontWeight: 800,
              background: "rgba(2, 6, 23, 0.62)",
            }}
          >
            {data.style}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
