import type { CSSProperties } from "react";
import { getAccentColor, programTheme, type AccentColor } from "../themes";

type ProgramTagProps = {
  label: string;
  subLabel?: string;
  indexText?: string;
  color?: AccentColor;
  style?: CSSProperties;
};

export const ProgramTag: React.FC<ProgramTagProps> = ({ label, subLabel, indexText, color = "yellow", style }) => {
  const accent = getAccentColor(color);

  return (
    <div style={{ fontFamily: programTheme.fontFamily, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: accent,
          fontSize: 19,
          fontWeight: 1000,
          letterSpacing: 4,
          textTransform: "uppercase",
          textShadow: programTheme.effects.textLift,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 8, height: 22, borderRadius: 999, background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <span>{label}</span>
        {indexText ? <span style={{ letterSpacing: 2 }}>· {indexText}</span> : null}
      </div>
      {subLabel ? (
        <div style={{ marginTop: 7, marginLeft: 20, fontSize: 21, fontWeight: 780, color: "rgba(248,250,252,0.78)" }}>
          {subLabel}
        </div>
      ) : null}
    </div>
  );
};
