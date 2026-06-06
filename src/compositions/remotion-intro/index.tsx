import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// ============================================================
// 工具
// ============================================================

// ============================================================
// 扫描线
// ============================================================

const ScanLines = ({ opacity }: { opacity: number }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", opacity: opacity * 0.05 }}>
    <defs>
      <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="1.5" fill="rgba(255,255,255,0.3)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#scan)" />
  </svg>
);

// ============================================================
// 神经网络节点 + 连线
// ============================================================

const NODES = [
  { x: 15, y: 25 }, { x: 30, y: 70 }, { x: 85, y: 20 }, { x: 75, y: 80 },
  { x: 20, y: 50 }, { x: 80, y: 50 }, { x: 10, y: 75 }, { x: 90, y: 35 },
  { x: 45, y: 15 }, { x: 55, y: 88 }, { x: 35, y: 45 }, { x: 65, y: 60 },
];

const EDGES: [number, number][] = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const dx = NODES[i].x - NODES[j].x;
    const dy = NODES[i].y - NODES[j].y;
    if (Math.sqrt(dx * dx + dy * dy) < 38) EDGES.push([i, j]);
  }
}

const NeuralNetwork = ({ progress, opacity }: { progress: number; opacity: number }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", opacity }}>
    <defs>
      <filter id="nnGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {EDGES.map(([a, b], i) => {
      const p = Math.max(0, Math.min(1, (progress - i * 0.03) / 0.4));
      return (
        <g key={`e-${i}`} filter="url(#nnGlow)">
          <line x1={`${NODES[a].x}%`} y1={`${NODES[a].y}%`} x2={`${NODES[b].x}%`} y2={`${NODES[b].y}%`}
            stroke="rgba(59,130,246,0.25)" strokeWidth={0.5} opacity={p * 0.7} />
          {p > 0.3 && (
            <circle cx={`${NODES[a].x + (NODES[b].x - NODES[a].x) * ((p - 0.3) / 0.7)}%`}
              cy={`${NODES[a].y + (NODES[b].y - NODES[a].y) * ((p - 0.3) / 0.7)}%`}
              r={1.5} fill="#60a5fa" opacity={0.8} />
          )}
        </g>
      );
    })}
    {NODES.map((n, i) => {
      const np = Math.max(0, Math.min(1, (progress - i * 0.02) / 0.3));
      const pulse = Math.sin(i * 2.5 + progress * 5) * 0.3 + 0.7;
      return (
        <g key={`n-${i}`} filter="url(#nnGlow)">
          <circle cx={`${n.x}%`} cy={`${n.y}%`} r={2 * pulse}
            fill={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#818cf8" : "#06b6d4"} opacity={np} />
          <circle cx={`${n.x}%`} cy={`${n.y}%`} r={5 * pulse} fill="none"
            stroke={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"}
            strokeWidth={0.3} opacity={np * 0.35} />
        </g>
      );
    })}
  </svg>
);

// ============================================================
// 脉冲环
// ============================================================

const PulseRings = ({ count, progress }: { count: number; progress: number }) => (
  <svg width="100%" height="100%" style={{ position: "absolute" }}>
    <defs>
      <filter id="pulseGlow">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {[...Array(count)].map((_, i) => {
      const rp = (progress * 1.5 + i / count) % 1;
      return (
        <circle key={i} cx="50%" cy="50%" r={rp * 140} fill="none"
          stroke="#60a5fa" strokeWidth={0.5} opacity={(1 - rp) * 0.25} filter="url(#pulseGlow)" />
      );
    })}
  </svg>
);

// ============================================================
// 粒子（方向流动）
// ============================================================

const DataParticles = ({ count, progress }: { count: number; progress: number }) => {
  const seed = (s: number) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const sx = seed(i * 173.21) * 100;
        const sy = seed(i * 173.21 + 1) * 100;
        const angle = seed(i * 173.21 + 2) * Math.PI * 2;
        const speed = 0.3 + seed(i * 173.21 + 3) * 0.7;
        const d = progress * speed * 100;
        const delay = i * 0.04;
        const p = Math.max(0, Math.min(1, progress - delay));
        return (
          <circle key={i} cx={`${sx + Math.cos(angle) * d}%`} cy={`${sy + Math.sin(angle) * d}%`}
            r={0.7 + (i % 3) * 0.6}
            fill={i % 4 === 0 ? "#60a5fa" : i % 4 === 1 ? "#a78bfa" : i % 4 === 2 ? "#06b6d4" : "#f472b6"}
            opacity={p * 0.45} style={{ filter: "blur(0.4px)" }} />
        );
      })}
    </>
  );
};

// ============================================================
// 故障文字
// ============================================================

const GlitchLabel = ({ text, x, y, fontSize, opacity, color, glowColor, frame }: {
  text: string; x: string; y: string; fontSize: number;
  opacity: number; color: string; glowColor: string; frame: number;
}) => {
  const s = (i: number) => { const v = Math.sin(frame * 0.7 + i) * 10000; return v - Math.floor(v); };
  const glitch = s(7) > 0.78;
  const rx = glitch ? (s(13) - 0.5) * 5 : 0;
  const ry = glitch ? (s(17) - 0.5) * 1.5 : 0;
  const bs: React.CSSProperties = {
    position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity,
    fontSize: `${fontSize}px`, fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
    fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap",
    textShadow: `0 0 20px ${glowColor}, 0 0 60px ${glowColor}`,
  };
  return (
    <>
      <div style={{ ...bs, color: "#ff3b5f", transform: `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`, mixBlendMode: "screen", opacity: opacity * 0.4 }}>{text}</div>
      <div style={{ ...bs, color: "#3bd0ff", transform: `translate(calc(-50% - ${rx}px), calc(-50% - ${ry}px))`, mixBlendMode: "screen", opacity: opacity * 0.4 }}>{text}</div>
      <div style={{ ...bs, color }}>{text}</div>
    </>
  );
};

// ============================================================
// ============================================================
// 主组件
// ============================================================

export const RemotionIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- 阶段 ----
  const pHookEnd    = 1.5 * fps;  // Hook: "React 只能做网页？"
  const pDemo1End   = 3.0 * fps;  // 教学1: <Composition>
  const pDemo2End   = 4.5 * fps;  // 教学2: useCurrentFrame
  const pDemo3End   = 6.0 * fps;  // 教学3: interpolate
  const pResultEnd  = 7.5 * fps;  // 结论
  const pOutroEnd   = 9.0 * fps;  // 淡出

  // ---- 通用 ----
  const scanOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" });
  const finalFade = interpolate(frame, [pResultEnd + 15, pOutroEnd], [1, 0], { extrapolateLeft: "clamp" });

  // ---- Hook 动画 ----
  const hookEnter = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const hookScale = interpolate(frame, [0, 20], [1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hookFadeOut = interpolate(frame, [pHookEnd - 15, pHookEnd], [1, 0], { extrapolateLeft: "clamp" });

  // ---- 教学阶段通用 ----
  const teachingActive = interpolate(frame, [pHookEnd, pHookEnd + 10], [0, 1], { extrapolateRight: "clamp" });

  // ---- Demo1: <Composition /> (45–90帧) ----
  const d1Progress = interpolate(frame, [pHookEnd + 5, pDemo1End - 5], [0, 1], { extrapolateRight: "clamp" });
  const d1CodeOpacity = interpolate(frame, [pHookEnd + 5, pHookEnd + 15], [0, 1], { extrapolateRight: "clamp" });
  // 视频画幅框
  const frameBoxScale = interpolate(d1Progress, [0.3, 1], [0, 1], { extrapolateRight: "clamp" });
  const frameBoxOpacity = interpolate(d1Progress, [0.2, 0.6], [0, 1], { extrapolateRight: "clamp" });

  // ---- Demo2: useCurrentFrame (90–135帧) ----
  const d2Progress = interpolate(frame, [pDemo1End + 5, pDemo2End - 5], [0, 1], { extrapolateRight: "clamp" });
  const d2CodeOpacity = interpolate(frame, [pDemo1End + 5, pDemo1End + 15], [0, 1], { extrapolateRight: "clamp" });
  const ringRotation = interpolate(frame, [pDemo1End + 10, pResultEnd], [0, 360]);
  const ringProgress = interpolate(d2Progress, [0.2, 1], [0, 1], { extrapolateRight: "clamp" });
  const centerPulse = interpolate(d2Progress, [0.3, 1], [0, 1], { extrapolateRight: "clamp" });

  // ---- Demo3: interpolate (135–180帧) ----
  const d3Progress = interpolate(frame, [pDemo2End + 5, pDemo3End - 5], [0, 1], { extrapolateRight: "clamp" });
  const d3CodeOpacity = interpolate(frame, [pDemo2End + 5, pDemo2End + 15], [0, 1], { extrapolateRight: "clamp" });
  // 粒子汇聚
  const particleConverge = interpolate(d3Progress, [0, 1], [1, 0], { extrapolateRight: "clamp" });

  // ---- 结论 (180–225帧) ----
  const resultTitleScale = interpolate(frame, [pDemo3End + 5, pDemo3End + 25], [0.4, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const resultTitleOpacity = interpolate(frame, [pDemo3End + 5, pDemo3End + 18], [0, 1], { extrapolateLeft: "clamp" });
  const hueShift = interpolate(frame, [pDemo3End, pOutroEnd], [0, 360], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [pDemo3End + 25, pDemo3End + 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ---- 神经网络进度 ----
  const nnProgress = interpolate(frame, [pHookEnd, pDemo3End], [0, 1.2], { extrapolateRight: "clamp" });
  const pulseProgress = interpolate(frame, [pHookEnd, pOutroEnd], [0, 1], { extrapolateRight: "clamp" });
  const particleProgress = interpolate(frame, [pHookEnd, pResultEnd], [0, 1], { extrapolateRight: "clamp" });

  // ---- 阶段判定 ----
  const isTeachingPhase = frame >= pHookEnd && frame < pDemo3End + 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <ScanLines opacity={scanOpacity * finalFade} />

      {/* 神经网络底层 */}
      <NeuralNetwork progress={nnProgress} opacity={finalFade} />

      {/* 脉冲环 */}
      <PulseRings count={3} progress={pulseProgress} />

      {/* 粒子 */}
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: finalFade }}>
        <DataParticles count={25} progress={particleProgress} />
      </svg>

      {/* ================================================ */}
      {/* Hook: "React 只能做网页？"                       */}
      {/* ================================================ */}
      <div style={{
        position: "absolute", top: "42%", left: "50%",
        transform: `translate(-50%, -50%) scale(${hookScale})`,
        opacity: hookEnter * hookFadeOut * finalFade,
        display: "flex", alignItems: "center", gap: "20px",
      }}>
        {/* 问号 */}
        <div style={{
          fontSize: "120px", fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
          fontWeight: 900, color: "#3b82f6",
          textShadow: "0 0 40px #3b82f6, 0 0 80px #8b5cf6, 0 0 120px #3b82f644",
          lineHeight: 1,
        }}>?</div>
        <div>
          <GlitchLabel text="React" x="0" y="0" fontSize={56} opacity={1}
            color="#ffffff" glowColor="#3b82f6" frame={frame} />
          <div style={{ fontSize: "28px", color: "#94a3b8", marginTop: "8px",
            fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
            fontWeight: 500, letterSpacing: "0.1em", textShadow: "0 0 15px rgba(148,163,184,0.3)" }}>
            只能做网页？
          </div>
        </div>
      </div>

      {/* ================================================ */}
      {/* 教学阶段：3段代码演示                          */}
      {/* ================================================ */}

      {/* 左侧：代码区 */}
      <div style={{ opacity: teachingActive * finalFade }}>
        {/* 代码1: <Composition /> */}
        <div style={{
          position: "absolute", left: "8%", top: "30%",
          opacity: isTeachingPhase ? (frame < pDemo1End ? d1CodeOpacity : (frame < pDemo2End ? d2CodeOpacity : d3CodeOpacity)) : 0,
        }}>
          <div style={{
            fontSize: "15px", fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px",
            padding: "14px 20px",
          }}>
            {frame < pDemo1End ? (
              // 教学1
              <>
                <div><span style={{ color: "#818cf8" }}>{"<Composition"}</span></div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#94a3b8" }}>id</span><span style={{ color: "#64748b" }}>=</span><span style={{ color: "#22d3ee" }}>"my-video"</span>
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#94a3b8" }}>fps</span><span style={{ color: "#64748b" }}>=</span><span style={{ color: "#f59e0b" }}>{30}</span>
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#94a3b8" }}>width</span><span style={{ color: "#64748b" }}>=</span><span style={{ color: "#f59e0b" }}>{1920}</span>
                </div>
                <div><span style={{ color: "#818cf8" }}>{"/>"}</span></div>
                <div style={{ marginTop: "8px", color: "#475569", fontSize: "12px" }}>
                  ← 定义视频参数
                </div>
              </>
            ) : frame < pDemo2End ? (
              // 教学2
              <>
                <div><span style={{ color: "#818cf8" }}>const</span> <span style={{ color: "#60a5fa" }}>frame</span> <span style={{ color: "#64748b" }}>=</span></div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#c084fc" }}>useCurrentFrame</span><span style={{ color: "#94a3b8" }}>()</span><span style={{ color: "#64748b" }}>;</span>
                </div>
                <div style={{ marginTop: "8px", color: "#475569", fontSize: "12px" }}>
                  ← 获取当前帧号
                </div>
              </>
            ) : (
              // 教学3
              <>
                <div><span style={{ color: "#818cf8" }}>const</span> <span style={{ color: "#60a5fa" }}>opacity</span> <span style={{ color: "#64748b" }}>=</span></div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#c084fc" }}>interpolate</span><span style={{ color: "#94a3b8" }}>(</span>
                </div>
                <div style={{ paddingLeft: "32px" }}>
                  <span style={{ color: "#60a5fa" }}>frame</span><span style={{ color: "#94a3b8" }}>,</span>
                  <span style={{ color: "#94a3b8" }}> [</span><span style={{ color: "#f59e0b" }}>0</span><span style={{ color: "#94a3b8" }}>,</span>
                  <span style={{ color: "#f59e0b" }}>30</span><span style={{ color: "#94a3b8" }}>],</span>
                </div>
                <div style={{ paddingLeft: "32px" }}>
                  <span style={{ color: "#94a3b8" }}> [</span><span style={{ color: "#f59e0b" }}>0</span><span style={{ color: "#94a3b8" }}>,</span>
                  <span style={{ color: "#f59e0b" }}>1</span><span style={{ color: "#94a3b8" }}>]</span>
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#94a3b8" }}>)</span><span style={{ color: "#64748b" }}>;</span>
                </div>
                <div style={{ marginTop: "8px", color: "#475569", fontSize: "12px" }}>
                  ← 数值映射 = 动画
                </div>
              </>
            )}
            {/* 闪烁光标 */}
            <span style={{ display: "inline-block", width: "6px", height: "13px",
              backgroundColor: "#60a5fa", marginTop: "6px",
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
              boxShadow: "0 0 5px #60a5fa" }} />
          </div>
        </div>
      </div>

      {/* 右侧：视觉效果区（对应代码教学） */}
      <div style={{ opacity: teachingActive * finalFade }}>
        {/* Demo1 视觉：视频画幅框 */}
        {frame < pDemo2End - 5 && (
          <div style={{
            position: "absolute", left: "62%", top: "50%",
            transform: `translate(-50%, -50%) scale(${frameBoxScale})`,
            opacity: frameBoxOpacity,
          }}>
            <svg width="280" height="170" viewBox="0 0 280 170">
              <defs>
                <filter id="frameGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect x="4" y="4" width="272" height="162" rx="8" fill="none"
                stroke="#3b82f6" strokeWidth="1.5" filter="url(#frameGlow)"
                strokeDasharray={`${d1Progress * 868}`} />
              <rect x="4" y="4" width="272" height="162" rx="8" fill="rgba(59,130,246,0.05)" />
              {/* 网格 */}
              {[...Array(5)].map((_, i) => (
                <line key={`gx-${i}`} x1={60 + i * 55} y1="4" x2={60 + i * 55} y2="166"
                  stroke="rgba(59,130,246,0.1)" strokeWidth="0.5" />
              ))}
              {[...Array(3)].map((_, i) => (
                <line key={`gy-${i}`} x1="4" y1={45 + i * 55} x2="276" y2={45 + i * 55}
                  stroke="rgba(59,130,246,0.1)" strokeWidth="0.5" />
              ))}
              {/* 标签 */}
              <text x="140" y="95" textAnchor="middle" fill="#475569"
                fontSize="13" fontFamily="'JetBrains Mono',monospace">
                1920 × 1080 @ 30fps
              </text>
            </svg>
          </div>
        )}

        {/* Demo2 视觉：中央旋转几何 + 六边形 */}
        {frame >= pDemo1End && frame < pDemo3End - 5 && (
          <div style={{
            position: "absolute", left: "62%", top: "50%",
            transform: `translate(-50%, -50%) scale(${ringProgress})`,
            opacity: ringProgress,
          }}>
            <svg width="260" height="260" viewBox="0 0 260 260">
              <defs>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <g filter="url(#neonGlow)" transform={`rotate(${ringRotation} 130 130)`}>
                <circle cx="130" cy="130" r="100" fill="none" stroke="url(#g1)"
                  strokeWidth="1.2" strokeDasharray={`${ringProgress * 628}`} strokeLinecap="round" />
                <circle cx="130" cy="130" r="70" fill="none" stroke="url(#g2)"
                  strokeWidth="0.8" strokeDasharray={`${ringProgress * 440}`} strokeLinecap="round"
                  transform={`rotate(${-ringRotation * 0.6} 130 130)`} />
              </g>
              <g filter="url(#neonGlow)" opacity={centerPulse}>
                <polygon points="130,100 157,115 157,145 130,160 103,145 103,115"
                  fill="none" stroke="url(#g1)" strokeWidth="1.5" />
                <polygon points="130,108 151,120 151,140 130,152 109,140 109,120"
                  fill="rgba(59,130,246,0.12)" stroke="url(#g2)" strokeWidth="0.8" />
              </g>
              <circle cx="130" cy="130" r="3" fill="#60a5fa" opacity={centerPulse} filter="url(#neonGlow)" />
              {/* 帧号指示器 */}
              <g filter="url(#neonGlow)" opacity={centerPulse}>
                <text x="130" y="200" textAnchor="middle" fill="#60a5fa"
                  fontSize="11" fontFamily="'JetBrains Mono',monospace">
                  frame = {Math.floor(interpolate(d2Progress, [0, 1], [0, 270]))}
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* Demo3 视觉：粒子汇聚到中心 */}
        {frame >= pDemo2End && (
          <svg width="100%" height="100%" style={{ position: "absolute", opacity: d3Progress }}>
            {NODES.map((n, i) => {
              const cx = 62 + (n.x - 62) * (1 - particleConverge);
              const cy = 50 + (n.y - 50) * (1 - particleConverge);
              return (
                <g key={`dp-${i}`} filter="url(#nnGlow)">
                  <line x1={`${cx}%`} y1={`${cy}%`} x2="62%" y2="50%"
                    stroke={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"}
                    strokeWidth={0.6} opacity={d3Progress * 0.5} />
                  <circle cx={`${cx}%`} cy={`${cy}%`} r={2}
                    fill={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#a78bfa" : "#22d3ee"} opacity={d3Progress} />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* 教学步骤指示器 */}
      <div style={{
        position: "absolute", bottom: "22%", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "40px",
        opacity: teachingActive * finalFade,
      }}>
        {[
          { label: "定义视频", active: frame >= pHookEnd && frame < pDemo1End },
          { label: "获取帧号", active: frame >= pDemo1End && frame < pDemo2End },
          { label: "驱动动画", active: frame >= pDemo2End && frame < pDemo3End },
        ].map((step, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%", margin: "0 auto 6px",
              backgroundColor: step.active ? "#60a5fa" : "#334155",
              boxShadow: step.active ? "0 0 10px #60a5fa" : "none",
              transition: "all 0.3s",
            }} />
            <div style={{
              fontSize: "11px", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
              color: step.active ? "#93c5fd" : "#475569", letterSpacing: "0.05em",
            }}>{step.label}</div>
          </div>
        ))}
      </div>

      {/* ================================================ */}
      {/* 结论: "Remotion：程序员的视频引擎"               */}
      {/* ================================================ */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${resultTitleScale})`,
        opacity: resultTitleOpacity * finalFade,
        textAlign: "center",
      }}>
        {/* 主标题：全息渐变 */}
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: 3, top: 0, color: "#ff3b5f",
            mixBlendMode: "screen" as const, opacity: 0.3,
            fontSize: "80px", fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
            fontWeight: 800, letterSpacing: "0.03em",
          }}>Remotion</span>
          <span style={{
            position: "absolute", left: -3, top: 0, color: "#3bd0ff",
            mixBlendMode: "screen" as const, opacity: 0.3,
            fontSize: "80px", fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
            fontWeight: 800, letterSpacing: "0.03em",
          }}>Remotion</span>
          <span style={{
            fontSize: "80px", fontFamily: "'JetBrains Mono','SF Mono','Fira Code',monospace",
            fontWeight: 800, letterSpacing: "0.03em",
            background: `linear-gradient(135deg, hsl(${hueShift + 210},100%,65%) 0%, hsl(${hueShift + 260},100%,65%) 50%, hsl(${hueShift + 180},100%,60%) 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(59,130,246,0.6)) drop-shadow(0 0 80px rgba(139,92,246,0.3))",
          }}>Remotion</span>
        </div>
      </div>

      {/* 副标题 */}
      <div style={{
        position: "absolute", top: "62%", left: "50%", transform: "translate(-50%, -50%)",
        opacity: subOpacity * finalFade, textAlign: "center",
      }}>
        <div style={{
          fontSize: "26px", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          fontWeight: 500, color: "#94a3b8", letterSpacing: "0.3em",
          textShadow: "0 0 20px rgba(148,163,184,0.3)",
        }}>
          程序员的视频引擎
        </div>
      </div>
    </AbsoluteFill>
  );
};
