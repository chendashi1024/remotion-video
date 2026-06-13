import React from "react";
import type { CSSProperties } from "react";
import { interpolate } from "remotion";
import { enterProgress, opcHud, systemEase } from "../../design-language";

export const CornerFrame: React.FC<{ accent?: string; opacity?: number }> = ({ accent = opcHud.colors.green, opacity = 1 }) => {
  const corner: CSSProperties = {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: accent,
    opacity,
  };
  return (
    <>
      <div style={{ ...corner, top: 8, left: 8, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
      <div style={{ ...corner, top: 8, right: 8, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
      <div style={{ ...corner, bottom: 8, left: 8, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
      <div style={{ ...corner, bottom: 8, right: 8, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` }} />
    </>
  );
};

export const HudGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.14 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      backgroundImage:
        "linear-gradient(rgba(40,245,154,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(40,245,154,0.18) 1px, transparent 1px)",
      backgroundSize: "34px 34px",
    }}
  />
);

export const ScanSweep: React.FC<{ frame: number; accent?: string; delay?: number }> = ({ frame, accent = opcHud.colors.green, delay = 0 }) => {
  const progress = enterProgress(frame, delay, 32);
  const x = interpolate(progress, [0, 1], [-120, 920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: systemEase,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: x,
        width: 120,
        opacity: 0.34,
        background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
        transform: "skewX(-12deg)",
      }}
    />
  );
};

export const SystemPanel: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: CSSProperties;
}> = ({ children, accent = opcHud.colors.green, style }) => (
  <div
    style={{
      position: "absolute",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${opcHud.colors.panel}, ${opcHud.colors.panelDeep})`,
      border: `1px solid ${accent}66`,
      boxShadow: opcHud.shadow.panel,
      color: opcHud.colors.text,
      ...style,
    }}
  >
    <HudGrid />
    <CornerFrame accent={accent} />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 22,
        right: 22,
        height: 1,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
      }}
    />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

export const SystemHeader: React.FC<{
  eyebrow: string;
  title?: string;
  accent?: string;
  meta?: string;
}> = ({ eyebrow, title, accent = opcHud.colors.green, meta }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
    <div
      style={{
        color: accent,
        fontFamily: opcHud.monoFont,
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: 2.4,
        textTransform: "uppercase",
        textShadow: `0 0 10px ${accent}44`,
        whiteSpace: "nowrap",
      }}
    >
      {eyebrow}
    </div>
    {title ? (
      <div style={{ color: opcHud.colors.muted, fontFamily: opcHud.monoFont, fontSize: 12, letterSpacing: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        / {title}
      </div>
    ) : null}
    {meta ? (
      <div style={{ marginLeft: "auto", color: opcHud.colors.muted, fontFamily: opcHud.monoFont, fontSize: 12, letterSpacing: 1.1 }}>
        {meta}
      </div>
    ) : null}
  </div>
);

export const DataPill: React.FC<{ label: string; accent?: string; tone?: "solid" | "ghost" }> = ({ label, accent = opcHud.colors.green, tone = "ghost" }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      border: `1px solid ${accent}77`,
      background: tone === "solid" ? `${accent}26` : "rgba(0,0,0,0.24)",
      color: tone === "solid" ? opcHud.colors.text : accent,
      padding: "7px 11px",
      fontFamily: opcHud.monoFont,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ width: 6, height: 6, background: accent, boxShadow: `0 0 10px ${accent}` }} />
    {label}
  </div>
);
