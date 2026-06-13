import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { enterProgress, exitOpacity, opcHud, toTextList } from "../design-language";
import { DataPill, ScanSweep, SystemHeader, SystemPanel } from "./analysis/FramePrimitives";

export const RiskPackage: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const items = (effect.riskItems?.length ? effect.riskItems : toTextList(effect.proofText || "")).slice(0, 4);
  const accent = opcHud.colors.green;
  const y = interpolate(enterProgress(frame, 0, 30), [0, 1], [34, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel
        accent={accent}
        style={{
          position: "absolute",
          top: opcHud.layout.panelY,
          left: opcHud.layout.panelX,
          width: opcHud.layout.panelWidth,
          minHeight: 610,
          padding: "30px 34px",
          transform: `translateY(${y}px)`,
        }}
      >
        <ScanSweep frame={frame} accent={accent} />
        <SystemHeader eyebrow={effect.eyebrow || "VALIDATION RISK"} title={effect.subLabel || "素材质检"} accent={accent} />
        <div style={{ marginTop: 34, color: opcHud.colors.text, fontSize: 54, lineHeight: 1.04, fontWeight: 1000 }}>
          {effect.mainTitle || effect.name}
        </div>
        {effect.subtitle ? <div style={{ marginTop: 10, color: opcHud.colors.greenHot, fontSize: 34, fontWeight: 950 }}>{effect.subtitle}</div> : null}
        {items.length ? (
          <div style={{ marginTop: 34, display: "grid", gap: 13 }}>
            {items.map((item, index) => {
              const p = enterProgress(frame, 12 + index * 8, 22);
              return (
                <div key={`${item}-${index}`} style={{ opacity: p, display: "grid", gridTemplateColumns: "42px 1fr", gap: 16, alignItems: "center" }}>
                  <DataPill label={String(index + 1).padStart(2, "0")} accent={accent} tone={index === items.length - 1 ? "solid" : "ghost"} />
                  <div style={{ color: opcHud.colors.text, fontSize: 31, lineHeight: 1.14, fontWeight: 900 }}>{item}</div>
                </div>
              );
            })}
          </div>
        ) : null}
      </SystemPanel>
    </AbsoluteFill>
  );
};
