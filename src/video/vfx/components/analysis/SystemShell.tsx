import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { opcHud, systemEase } from "../../design-language";

export const VideoShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame % 180, [0, 180], [-120, 1120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: systemEase,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: opcHud.colors.bg, fontFamily: opcHud.fontFamily, color: opcHud.colors.text, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(40,245,154,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(40,245,154,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.42,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 76% 42%, rgba(40,245,154,0.16), transparent 34%), radial-gradient(circle at 20% 20%, rgba(28,183,255,0.1), transparent 30%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 90,
          opacity: 0.18,
          background: `linear-gradient(180deg, transparent, ${opcHud.colors.green}, transparent)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const TopHudNav: React.FC<{ active: string; sections: string[] }> = ({ active, sections }) => (
  <div
    style={{
      position: "absolute",
      top: 34,
      left: 64,
      right: 64,
      height: 46,
      display: "grid",
      gridTemplateColumns: "260px 1fr 220px",
      alignItems: "center",
      gap: 22,
      fontFamily: opcHud.monoFont,
      zIndex: 20,
    }}
  >
    <div style={{ color: opcHud.colors.green, fontSize: 18, fontWeight: 1000, letterSpacing: 2.6 }}>OPC VISUAL OS</div>
    <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
      {sections.map((section) => (
        <div
          key={section}
          style={{
            border: `1px solid ${section === active ? opcHud.colors.green : opcHud.colors.hairline}`,
            background: section === active ? `${opcHud.colors.green}22` : "rgba(0,0,0,0.18)",
            color: section === active ? opcHud.colors.text : opcHud.colors.muted,
            padding: "7px 11px",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {section}
        </div>
      ))}
    </div>
    <div style={{ color: opcHud.colors.muted, fontSize: 12, textAlign: "right", letterSpacing: 1.6 }}>LIVE PREVIEW / 1920x1080</div>
  </div>
);

export const BottomSystemBar: React.FC<{ progress: number; label: string }> = ({ progress, label }) => {
  const width = Math.max(0, Math.min(100, progress * 100));
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 34,
        height: 42,
        display: "grid",
        gridTemplateColumns: "250px 1fr 210px",
        alignItems: "center",
        gap: 18,
        fontFamily: opcHud.monoFont,
        zIndex: 20,
      }}
    >
      <div style={{ color: opcHud.colors.green, fontSize: 13, fontWeight: 900, letterSpacing: 1.4 }}>C哥OPC / CONTENT ASSET</div>
      <div style={{ height: 8, border: `1px solid ${opcHud.colors.hairline}`, background: "rgba(0,0,0,0.28)" }}>
        <div style={{ width: `${width}%`, height: "100%", background: `linear-gradient(90deg, ${opcHud.colors.greenDim}, ${opcHud.colors.greenHot})` }} />
      </div>
      <div style={{ color: opcHud.colors.muted, fontSize: 12, textAlign: "right", letterSpacing: 1.2 }}>{label}</div>
    </div>
  );
};

export const SceneLabel: React.FC<{ id: string; title: string }> = ({ id, title }) => (
  <div
    style={{
      position: "absolute",
      left: 72,
      bottom: 96,
      display: "flex",
      gap: 12,
      alignItems: "center",
      fontFamily: opcHud.monoFont,
      zIndex: 20,
    }}
  >
    <div style={{ color: opcHud.colors.green, border: `1px solid ${opcHud.colors.green}`, padding: "6px 9px", fontSize: 13, fontWeight: 1000 }}>{id}</div>
    <div style={{ color: opcHud.colors.muted, fontSize: 13, fontWeight: 900, letterSpacing: 1.1 }}>{title}</div>
  </div>
);

export const SubtitleLayer: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: 360,
      right: 360,
      bottom: 104,
      minHeight: 64,
      display: "grid",
      placeItems: "center",
      padding: "14px 22px",
      background: "rgba(0,0,0,0.46)",
      borderTop: `1px solid ${opcHud.colors.hairline}`,
      color: opcHud.colors.text,
      fontSize: 30,
      lineHeight: 1.22,
      fontWeight: 900,
      textAlign: "center",
      zIndex: 20,
    }}
  >
    {text}
  </div>
);

export const useCompositionProgress = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return durationInFrames <= 0 ? 0 : frame / durationInFrames;
};
