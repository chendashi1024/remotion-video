import type { CSSProperties } from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { matrixOpcTheme } from "../matrix-opc";
import { BrandSignature } from "../matrix-opc/components/BrandSignature";
import { MatrixProgressNav } from "../matrix-opc/components/MatrixProgressNav";
import { VideoShell } from "../vfx/components/analysis/SystemShell";
import { personIntegrationDuration, personIntegrationScenes, type FocusArea, type PersonIntegrationScene } from "./scenes";

const green = matrixOpcTheme.colors.green;
const hot = matrixOpcTheme.colors.greenHot;
const muted = matrixOpcTheme.colors.muted;
const text = matrixOpcTheme.colors.text;
const bg = matrixOpcTheme.colors.bg;
const mono = matrixOpcTheme.monoFont;
const font = matrixOpcTheme.fontFamily;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

export { personIntegrationDuration };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const enter = (frame: number, delay = 0, duration = 16) =>
  interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const sceneOpacity = (frame: number, duration: number) =>
  Math.min(
    interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
    interpolate(frame, [duration - 8, duration], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })
  );

const Panel: React.FC<{ children: React.ReactNode; style?: CSSProperties; accent?: string; opacity?: number }> = ({
  children,
  style,
  accent = green,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      overflow: "hidden",
      border: `1px solid ${accent}88`,
      background: "linear-gradient(135deg, rgba(2, 3, 3, 0.94), rgba(0, 0, 0, 0.96))",
      boxShadow: `0 24px 70px rgba(0,0,0,0.58), 0 0 18px ${accent}12`,
      color: text,
      fontFamily: font,
      opacity,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.035,
        backgroundImage:
          "linear-gradient(rgba(232,255,245,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,245,0.12) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
      }}
    />
    <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    {[
      ["top", "left"],
      ["top", "right"],
      ["bottom", "left"],
      ["bottom", "right"],
    ].map(([v, h]) => (
      <div
        key={`${v}-${h}`}
        style={{
          position: "absolute",
          width: 28,
          height: 28,
          [v]: 9,
          [h]: 9,
          borderTop: v === "top" ? `2px solid ${accent}` : undefined,
          borderBottom: v === "bottom" ? `2px solid ${accent}` : undefined,
          borderLeft: h === "left" ? `2px solid ${accent}` : undefined,
          borderRight: h === "right" ? `2px solid ${accent}` : undefined,
        }}
      />
    ))}
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const Header: React.FC<{ eyebrow: string; title?: string; meta?: string; accent?: string }> = ({ eyebrow, title, meta, accent = green }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
    <div style={{ color: accent, fontFamily: mono, fontSize: 24, fontWeight: 950, letterSpacing: 3, textShadow: `0 0 16px ${accent}55`, whiteSpace: "nowrap" }}>
      {eyebrow}
    </div>
    {title ? <div style={{ color: muted, fontFamily: mono, fontSize: 14, letterSpacing: 1.4, whiteSpace: "nowrap" }}>/ {title}</div> : null}
    {meta ? <div style={{ marginLeft: "auto", color: muted, fontFamily: mono, fontSize: 13, letterSpacing: 1.4 }}>{meta}</div> : null}
  </div>
);

const DataPill: React.FC<{ label: string; accent?: string }> = ({ label, accent = green }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      width: "fit-content",
      border: `1px solid ${accent}88`,
      background: `${accent}18`,
      padding: "8px 12px",
      color: text,
      fontFamily: mono,
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: 1.25,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ width: 7, height: 7, background: accent, boxShadow: `0 0 12px ${accent}` }} />
    {label}
  </div>
);

const BackgroundVideoFrame: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <Img
        src={staticFile("person.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />
    </AbsoluteFill>
  );
};

const MetricScene: React.FC<{ scene: Extract<PersonIntegrationScene, { component: "MetricCounterCard" }> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sceneOpacity(frame, scene.duration);
  const cardIn = enter(frame, 3, 16);
  const raw = interpolate(frame, [8, 64, 82, 98], [scene.data.startValue, scene.data.endValue + 3, scene.data.endValue - 1, scene.data.endValue], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = Math.round(raw);
  const progress = clamp(raw / Math.max(scene.data.endValue, 1));
  const lockFlash = interpolate(frame, [82, 86, 94], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = spring({ frame: frame - 78, fps, from: 0, to: 1, config: { damping: 12, stiffness: 180, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Panel
        style={{
          left: 74,
          top: 154,
          width: 740,
          height: 610,
          padding: "34px 34px",
          transform: `translateX(${interpolate(cardIn, [0, 1], [-42, 0])}px)`,
        }}
      >
        <Header eyebrow="METRIC LOCK" title="production efficiency" meta="LIVE" />
        <div style={{ marginTop: 44, color: muted, fontSize: 28, fontWeight: 850 }}>{scene.data.label}</div>
        <div
          style={{
            marginTop: 10,
            color: text,
            fontFamily: mono,
            fontSize: 126 + lockFlash * 8 + pulse * 2,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: -1,
            textShadow: `0 0 ${22 + lockFlash * 24}px ${green}66`,
          }}
        >
          {scene.data.prefix}
          {value}
          {scene.data.suffix}
        </div>
        <div style={{ marginTop: 26, height: 16, border: `1px solid ${green}66`, background: "rgba(0,0,0,0.38)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${green}, ${hot})`, boxShadow: `0 0 18px ${green}66` }} />
        </div>
        <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
          <DataPill label={scene.data.status} />
          <DataPill label="TARGET VALUE CONFIRMED" />
        </div>
        <div style={{ marginTop: 40, borderLeft: `5px solid ${green}`, padding: "16px 20px", background: `${green}12`, fontSize: 30, lineHeight: 1.18, fontWeight: 920 }}>
          {scene.data.takeaway}
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: lockFlash * 0.28, background: green }} />
      </Panel>
    </AbsoluteFill>
  );
};

const EvidencePlaceholder: React.FC<{ frame: number; focusAreas: FocusArea[] }> = ({ frame, focusAreas }) => {
  const scan = ((frame * 4) % 350) - 70;
  return (
    <div style={{ position: "relative", height: 350, border: `1px solid ${green}66`, background: "rgba(0,0,0,0.36)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "linear-gradient(rgba(40,245,154,0.25) 1px, transparent 1px)", backgroundSize: "100% 28px" }} />
      <div style={{ position: "absolute", left: 34, top: 34, width: 510, height: 44, background: "rgba(232,255,245,0.08)", border: `1px solid ${green}28` }} />
      <div style={{ position: "absolute", left: 34, top: 104, width: 420, height: 30, background: "rgba(232,255,245,0.08)" }} />
      <div style={{ position: "absolute", left: 34, top: 154, width: 580, height: 92, background: "rgba(232,255,245,0.07)", border: `1px solid ${green}28` }} />
      <div style={{ position: "absolute", left: 34, top: 272, width: 310, height: 28, background: "rgba(232,255,245,0.08)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scan, height: 66, background: `linear-gradient(180deg, transparent, ${green}66, transparent)`, opacity: 0.48 }} />
      {focusAreas.map((area) => (
        <div
          key={area.label}
          style={{
            position: "absolute",
            left: `${area.x * 100}%`,
            top: `${area.y * 100}%`,
            width: `${area.width * 100}%`,
            height: `${area.height * 100}%`,
            border: `3px solid ${hot}`,
            boxShadow: `0 0 28px ${hot}77, inset 0 0 24px ${hot}22`,
          }}
        >
          <div style={{ position: "absolute", left: 8, top: -28, color: hot, fontFamily: mono, fontSize: 14, fontWeight: 950, letterSpacing: 1.4 }}>{area.label}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px", color: muted, fontFamily: mono, fontSize: 13, letterSpacing: 1.4 }}>
        EVIDENCE SLOT READY / replace with public/assets/evidence-01.png
      </div>
    </div>
  );
};

const EvidenceScene: React.FC<{ scene: Extract<PersonIntegrationScene, { component: "EvidenceCard" }> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, scene.duration);
  const p = enter(frame, 0, 16);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Panel style={{ left: 58, top: 136, width: 760, height: 700, padding: "30px 30px", transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px)` }}>
        <Header eyebrow={scene.data.sourceLabel} title={scene.data.sourceType} meta={scene.data.confidenceTag} />
        <div style={{ marginTop: 24, fontSize: 46, lineHeight: 1.08, fontWeight: 980 }}>{scene.data.headline}</div>
        <div style={{ marginTop: 24 }}>
          {scene.data.asset ? (
            <Img src={staticFile(scene.data.asset)} style={{ width: "100%", height: 350, objectFit: "cover", border: `1px solid ${green}66` }} />
          ) : (
            <EvidencePlaceholder frame={frame} focusAreas={scene.data.focusAreas} />
          )}
        </div>
        <div style={{ marginTop: 22, borderLeft: `5px solid ${green}`, padding: "17px 20px", background: `${green}12`, fontSize: 28, lineHeight: 1.18, fontWeight: 920 }}>
          {scene.data.takeaway}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

const CompareSide: React.FC<{ title: string; items: string[]; active: boolean; frame: number; side: "left" | "right" }> = ({ title, items, active, frame, side }) => (
  <div style={{ border: `1px solid ${active ? green : "rgba(126,160,143,0.32)"}`, background: active ? `${green}12` : "rgba(0,0,0,0.34)", padding: "20px 18px", minHeight: 370 }}>
    <div style={{ color: active ? green : muted, fontFamily: mono, fontSize: 19, fontWeight: 950, letterSpacing: 2 }}>{title}</div>
    <div style={{ marginTop: 22, display: "grid", gap: 15 }}>
      {items.map((item, index) => {
        const p = enter(frame, 14 + index * 15, 10);
        const x = interpolate(p, [0, 1], [side === "left" ? -18 : 18, 0], { easing: ease });
        return (
          <div
            key={item}
            style={{
              opacity: p,
              transform: `translateX(${x}px)`,
              display: "grid",
              gridTemplateColumns: "34px 1fr",
              gap: 12,
              alignItems: "center",
              minHeight: 74,
              padding: "12px 12px",
              border: `1px solid ${active ? green : "rgba(126,160,143,0.24)"}`,
              background: active ? "rgba(40,245,154,0.11)" : "rgba(0,0,0,0.28)",
            }}
          >
            <div style={{ color: active ? green : muted, fontFamily: mono, fontWeight: 950 }}>{String(index + 1).padStart(2, "0")}</div>
            <div style={{ color: active ? text : "rgba(232,255,245,0.68)", fontSize: 25, lineHeight: 1.12, fontWeight: 920 }}>{item}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const CompareScene: React.FC<{ scene: Extract<PersonIntegrationScene, { component: "CompareCard" }> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, scene.duration);
  const verdictP = enter(frame, 76, 14);
  const glitch = frame > 84 && frame < 90 ? (frame % 2 === 0 ? 5 : -4) : 0;
  return (
    <AbsoluteFill style={{ opacity }}>
      <Panel style={{ left: 54, top: 142, width: 800, height: 704, padding: "30px 26px" }}>
        <Header eyebrow="SYSTEM DIFF" title="A/B conflict analysis" meta="VS" />
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 68px 1fr", gap: 14, alignItems: "stretch" }}>
          <CompareSide title={scene.data.leftTitle} items={scene.data.leftItems} active={scene.data.highlight === "left"} frame={frame} side="left" />
          <div style={{ display: "grid", placeItems: "center", color: hot, fontFamily: mono, fontSize: 36, fontWeight: 1000, letterSpacing: 2 }}>VS</div>
          <CompareSide title={scene.data.rightTitle} items={scene.data.rightItems} active={scene.data.highlight === "right"} frame={frame} side="right" />
        </div>
        <div
          style={{
            marginTop: 26,
            opacity: verdictP,
            transform: `translateX(${glitch}px)`,
            borderLeft: `6px solid ${hot}`,
            background: `${green}18`,
            padding: "18px 22px",
            fontSize: 32,
            lineHeight: 1.18,
            fontWeight: 980,
            boxShadow: `0 0 26px ${green}22`,
          }}
        >
          {scene.data.verdict}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

const SystemClosureScene: React.FC<{ scene: Extract<PersonIntegrationScene, { component: "SystemClosure" }> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, scene.duration);
  const quoteP = enter(frame, 4, 18);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Panel style={{ left: 58, top: 170, width: 760, minHeight: 610, padding: "36px 36px" }}>
        <Header eyebrow="SYSTEM CONCLUSION" title="content operating system" meta="ONLINE" />
        <div style={{ marginTop: 42, opacity: quoteP, color: text, fontSize: 47, lineHeight: 1.14, fontWeight: 980 }}>{scene.data.quote}</div>
        <div style={{ marginTop: 36, display: "grid", gap: 12 }}>
          {scene.data.logs.map((log, index) => {
            const p = enter(frame, 38 + index * 14, 8);
            return (
              <div key={log} style={{ opacity: p, color: index === scene.data.logs.length - 1 ? hot : green, fontFamily: mono, fontSize: 22, fontWeight: 900, letterSpacing: 1.4 }}>
                &gt; {log}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 42, color: green, fontFamily: mono, fontSize: 24, fontWeight: 950, letterSpacing: 2.4 }}>{scene.data.ending}</div>
      </Panel>
    </AbsoluteFill>
  );
};

const SceneRenderer: React.FC<{ scene: PersonIntegrationScene }> = ({ scene }) => {
  if (scene.component === "MetricCounterCard") return <MetricScene scene={scene} />;
  if (scene.component === "EvidenceCard") return <EvidenceScene scene={scene} />;
  if (scene.component === "CompareCard") return <CompareScene scene={scene} />;
  return <SystemClosureScene scene={scene} />;
};

export const OpcPersonIntegrationTest: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = clamp(frame / Math.max(personIntegrationDuration - 1, 1));
  const activeIndex = Math.min(
    personIntegrationScenes.length - 1,
    Math.max(0, personIntegrationScenes.findIndex((scene) => frame >= scene.start && frame < scene.start + scene.duration))
  );
  const steps = [{ title: "P0 METRIC" }, { title: "P0 EVIDENCE" }, { title: "P0 COMPARE" }, { title: "P1 CLOSURE" }];

  return (
    <VideoShell>
      <BackgroundVideoFrame />
      {personIntegrationScenes.map((scene) => (
        <Sequence key={`${scene.component}-${scene.start}`} from={scene.start} durationInFrames={scene.duration}>
          <SceneRenderer scene={scene} />
        </Sequence>
      ))}
      <MatrixProgressNav frame={frame} steps={steps} activeIndex={activeIndex} progress={progress} />
      <BrandSignature frame={frame} />
    </VideoShell>
  );
};
