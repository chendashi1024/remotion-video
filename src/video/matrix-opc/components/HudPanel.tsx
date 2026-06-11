import type { CSSProperties, PropsWithChildren } from "react";
import { matrixOpcTheme, getMatrixAccent, type MatrixAccent } from "../theme";

type HudPanelProps = PropsWithChildren<{
  title?: string;
  label?: string;
  accent?: MatrixAccent;
  style?: CSSProperties;
}>;

export const HudPanel: React.FC<HudPanelProps> = ({ children, title, label, accent = "green", style }) => {
  const color = getMatrixAccent(accent);

  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(135deg, ${matrixOpcTheme.colors.panel}, rgba(0, 8, 6, 0.54))`,
        border: `1px solid ${color}66`,
        boxShadow: `${matrixOpcTheme.shadow.panel}, 0 0 28px ${color}22`,
        clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.8,
        }}
      />
      {title ? (
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "18px 22px 0" }}>
          <div style={{ color, fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>{title}</div>
          {label ? (
            <div
              style={{
                color: matrixOpcTheme.colors.muted,
                fontFamily: matrixOpcTheme.monoFont,
                fontSize: 13,
                letterSpacing: 1.2,
              }}
            >
              / {label}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};

