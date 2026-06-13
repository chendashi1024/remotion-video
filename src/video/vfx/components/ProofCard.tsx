import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { enterProgress, exitOpacity, opcHud, toTextList } from "../design-language";
import { DataPill, ScanSweep, SystemHeader, SystemPanel } from "./analysis/FramePrimitives";

export const ProofCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const lines = toTextList(effect.proofText || effect.title || effect.text || effect.name).slice(0, 4);
  const isLeft = effect.position === "left";
  const accent = opcHud.colors.green;
  const left = isLeft ? opcHud.layout.panelX : opcHud.layout.panelX + 170;
  const x = interpolate(enterProgress(frame, 0, 32), [0, 1], [isLeft ? -56 : 56, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel
        accent={accent}
        style={{
          position: "absolute",
          top: 190,
          left,
          width: 620,
          minHeight: 410,
          padding: "28px 30px",
          transform: `translateX(${x}px)`,
        }}
      >
        <ScanSweep frame={frame} accent={accent} />
        <SystemHeader eyebrow={effect.proofLabel || effect.eyebrow || "SOURCE MANIFEST"} title={effect.badge || "verified"} accent={accent} />
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {lines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                opacity: enterProgress(frame, 10 + index * 7, 22),
                padding: "13px 15px",
                border: `1px solid ${index === 0 ? accent : opcHud.colors.hairline}`,
                background: index === 0 ? `${accent}18` : "rgba(0,0,0,0.24)",
                color: opcHud.colors.text,
                fontSize: index === 0 ? 27 : 22,
                fontWeight: index === 0 ? 1000 : 850,
                lineHeight: 1.2,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <DataPill label={effect.verified || "TRACEABLE"} accent={accent} tone="solid" />
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};
