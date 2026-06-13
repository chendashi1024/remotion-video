import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
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
