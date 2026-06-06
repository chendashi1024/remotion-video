import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

/*
 * 组件名：TemplateComposition（请按视频内容重命名）
 * 对应脚本：script.md
 */
export const TemplateComposition = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 整体淡出
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 在这里实现 script.md 中定义的分镜 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeOut,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          [标题]
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
