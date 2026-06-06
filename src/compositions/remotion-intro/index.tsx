import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// 缓出函数，让动画更有冲击力
const easeOut = (t: number) => 1 - (1 - t) ** 3;

// 网格背景
const GridBackground = ({ opacity }: { opacity: number }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", opacity }}>
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M 60 0 L 0 0 0 60"
          fill="none"
          stroke="rgba(59, 130, 246, 0.08)"
          strokeWidth="0.5"
        />
      </pattern>
      <pattern id="grid-lg" width="120" height="120" patternUnits="userSpaceOnUse">
        <path
          d="M 120 0 L 0 0 0 120"
          fill="none"
          stroke="rgba(59, 130, 246, 0.12)"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <rect width="100%" height="100%" fill="url(#grid-lg)" />
  </svg>
);

// 粒子
const Particles = ({ count, progress }: { count: number; progress: number }) => (
  <>
    {[...Array(count)].map((_, i) => {
      const seed = i * 137.5;
      const angle = (seed % Math.PI * 2);
      const radius = 200 + (seed % 400);
      const x = 50 + Math.cos(angle) * radius * progress / 100;
      const y = 50 + Math.sin(angle) * radius * progress / 100;
      const size = 1 + (i % 3);
      const delay = (i % 10) * 0.1;
      const p = Math.max(0, Math.min(1, progress / 100 - delay));
      return (
        <circle
          key={i}
          cx={`${x}%`}
          cy={`${y}%`}
          r={size}
          fill={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#818cf8" : "#06b6d4"}
          opacity={p * 0.6}
          style={{ filter: "blur(1px)" }}
        />
      );
    })}
  </>
);

// 发光关键词
const GlowText = ({
  text,
  x,
  y,
  fontSize,
  opacity,
  color = "#60a5fa",
  glowColor,
}: {
  text: string;
  x: string;
  y: string;
  fontSize: number;
  opacity: number;
  color?: string;
  glowColor?: string;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      opacity,
      fontSize: `${fontSize}px`,
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      fontWeight: "700",
      color,
      textShadow: `0 0 20px ${glowColor || color}, 0 0 60px ${glowColor || color}, 0 0 100px ${glowColor || color}44`,
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const RemotionIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === 阶段进度 ===
  const phase0End = 0.5 * fps;   // 暗场
  const phase1End = 2 * fps;     // 关键词逐个出现
  const phase2End = 4.5 * fps;   // 中央图形+标题
  const phase3End = 6.5 * fps;   // 副标题
  const phase4End = 7.5 * fps;   // 峰值
  const phase5End = 9 * fps;     // 淡出

  // === 网格背景 ===
  const gridOpacity = interpolate(frame, [0, 15], [0, 0.8], { extrapolateRight: "clamp" });

  // === 阶段1: 三个关键词 ===
  const keywords = [
    { text: "React", delay: 0 },
    { text: "组件", delay: 15 },
    { text: "渲染", delay: 30 },
  ];

  // === 阶段2: 中央图形旋转 ===
  const ringProgress = interpolate(
    frame,
    [phase1End, phase2End],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const ringRotation = interpolate(frame, [phase1End, phase4End], [0, 360]);

  // === 阶段3: 主标题 ===
  const mainTitleScale = interpolate(
    frame,
    [phase2End, phase2End + 20],
    [0.3, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const mainTitleOpacity = interpolate(
    frame,
    [phase2End, phase2End + 15],
    [0, 1],
    { extrapolateLeft: "clamp" }
  );

  // === 阶段4: 副标题 ===
  const subOpacity = interpolate(
    frame,
    [phase3End, phase3End + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === 粒子扩散 ===
  const particleProgress = interpolate(
    frame,
    [phase2End, phase5End],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  // === 最终淡出 ===
  const finalFadeOut = interpolate(
    frame,
    [phase4End + 15, phase5End],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  // === 中心脉冲 ===
  const centerPulse = interpolate(
    frame,
    [phase1End, phase2End],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#030712" }}>
      {/* 暗场叠加层 */}
      <AbsoluteFill
        style={{
          backgroundColor: "#030712",
          opacity: interpolate(frame, [0, 10], [1, 0], { extrapolateRight: "clamp" }),
        }}
      />

      {/* 网格背景 */}
      <GridBackground opacity={gridOpacity} />

      {/* 粒子 */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", opacity: finalFadeOut }}
      >
        <Particles count={30} progress={particleProgress} />
      </svg>

      {/* 阶段1: 三个关键词 - 从不同方向飞入 */}
      {keywords.map((kw, idx) => {
        const startFrame = phase0End + kw.delay;
        const endFrame = startFrame + 25;
        const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // 三个词分别从不同方向飞入
        const positions = [
          { fromX: -20, fromY: 45, toX: 22, toY: 35 },   // React - 左边飞来
          { fromX: 110, fromY: 60, toX: 50, toY: 65 },    // 组件 - 右边飞来
          { fromX: 120, fromY: 20, toX: 78, toY: 35 },    // 渲染 - 右上方飞来
        ];

        const pos = positions[idx];
        const easedProgress = easeOut(progress);
        const x = pos.fromX + (pos.toX - pos.fromX) * easedProgress;
        const y = pos.fromY + (pos.toY - pos.fromY) * easedProgress;
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 1]);

        return (
          <GlowText
            key={idx}
            text={kw.text}
            x={`${x}%`}
            y={`${y}%`}
            fontSize={48}
            opacity={opacity * finalFadeOut}
            color={idx === 0 ? "#3b82f6" : idx === 1 ? "#818cf8" : "#06b6d4"}
            glowColor={idx === 0 ? "#3b82f6" : idx === 1 ? "#a78bfa" : "#22d3ee"}
          />
        );
      })}

      {/* 阶段2: 中央几何图形 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${ringProgress})`,
          opacity: ringProgress * finalFadeOut,
        }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300">
          <defs>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* 外圈旋转 */}
          <g filter="url(#neonGlow)" transform={`rotate(${ringRotation} 150 150)`}>
            <circle
              cx="150" cy="150" r="110"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1.5"
              strokeDasharray={`${ringProgress * 691}`}
              strokeLinecap="round"
            />
          </g>

          {/* 内圈反向旋转 */}
          <g filter="url(#neonGlow)" transform={`rotate(${-ringRotation * 0.7} 150 150)`}>
            <circle
              cx="150" cy="150" r="80"
              fill="none"
              stroke="url(#ringGrad2)"
              strokeWidth="1"
              strokeDasharray={`${ringProgress * 502}`}
              strokeLinecap="round"
            />
          </g>

          {/* 中心六边形 */}
          <g filter="url(#neonGlow)" opacity={centerPulse}>
            <polygon
              points="150,110 185,130 185,170 150,190 115,170 115,130"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2"
              transform={`scale(${0.5 + centerPulse * 0.5})`}
              style={{ transformOrigin: "150px 150px" }}
            />
            <polygon
              points="150,120 180,137 180,163 150,180 120,163 120,137"
              fill="rgba(59, 130, 246, 0.15)"
              stroke="url(#ringGrad2)"
              strokeWidth="1"
              transform={`scale(${0.5 + centerPulse * 0.5})`}
              style={{ transformOrigin: "150px 150px" }}
            />
          </g>

          {/* 中心点 */}
          <g filter="url(#neonGlow)">
            <circle cx="150" cy="150" r="4" fill="#60a5fa" opacity={centerPulse} />
          </g>
        </svg>
      </div>

      {/* 阶段3: 主标题 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${mainTitleScale})`,
          opacity: mainTitleOpacity * finalFadeOut,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "96px",
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            fontWeight: "800",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.3))",
            letterSpacing: "0.03em",
          }}
        >
          Remotion
        </div>
      </div>

      {/* 阶段4: 副标题 */}
      <div
        style={{
          position: "absolute",
          top: "63%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: subOpacity * finalFadeOut,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: "500",
            color: "#94a3b8",
            letterSpacing: "0.3em",
            textShadow: "0 0 20px rgba(148, 163, 184, 0.3)",
          }}
        >
          用 React 创作视频
        </div>
      </div>

      {/* 底部闪烁的代码行 */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [phase2End + 10, phase2End + 30], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * finalFadeOut,
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            color: "#475569",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderRadius: "8px",
            padding: "12px 24px",
            letterSpacing: "0.05em",
          }}
        >
          <span style={{ color: "#818cf8" }}>import</span>
          <span style={{ color: "#94a3b8" }}> {"{ "}</span>
          <span style={{ color: "#60a5fa" }}>useCurrentFrame</span>
          <span style={{ color: "#94a3b8" }}> {" }"}</span>
          <span style={{ color: "#818cf8" }}> from</span>
          <span style={{ color: "#22d3ee" }}> "remotion"</span>
          <span style={{ color: "#475569" }}>;</span>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "18px",
              backgroundColor: "#60a5fa",
              marginLeft: "4px",
              verticalAlign: "text-bottom",
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
              boxShadow: "0 0 8px #60a5fa",
            }}
          />
        </div>
      </div>

      {/* 最终闪光 */}
      <AbsoluteFill
        style={{
          backgroundColor: "#60a5fa",
          opacity: interpolate(
            frame,
            [phase4End + 10, phase4End + 15, phase4End + 25],
            [0, 0.08, 0],
            { extrapolateLeft: "clamp" }
          ),
        }}
      />
    </AbsoluteFill>
  );
};
