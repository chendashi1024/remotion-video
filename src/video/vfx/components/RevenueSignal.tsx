import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { enterProgress, exitOpacity, numberFrom, opcHud } from "../design-language";
import { ScanSweep, SystemHeader, SystemPanel } from "./analysis/FramePrimitives";

const formatNumber = (value: number) => value.toLocaleString("zh-CN", { maximumFractionDigits: 0 });

export const RevenueSignal: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const accent = opcHud.colors.green;
  const y = interpolate(enterProgress(frame, 0, 32), [0, 1], [34, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const target = numberFrom(effect.value || effect.mainNumber, 70);
  const progress = enterProgress(frame, 8, Math.min(78, durationInFrames - 14));
  const value = target * progress;

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel
        accent={accent}
        style={{
          position: "absolute",
          top: opcHud.layout.panelY,
          left: opcHud.layout.panelX,
          width: opcHud.layout.panelWidth,
          minHeight: 560,
          padding: "30px 34px",
          transform: `translateY(${y}px)`,
        }}
      >
        <ScanSweep frame={frame} accent={accent} />
        <SystemHeader eyebrow={effect.eyebrow || "REUSE SIGNAL"} title={effect.name || "复用收益"} accent={accent} />
        <div style={{ marginTop: 44, color: accent, fontSize: 112, lineHeight: 0.95, fontWeight: 1000, textShadow: `0 0 28px ${accent}44` }}>
          {formatNumber(value)}{effect.suffix ?? "%"}
        </div>
        <div style={{ marginTop: 24, height: 16, border: `1px solid ${accent}55`, background: "rgba(0,0,0,0.3)" }}>
          <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: `linear-gradient(90deg, ${accent}, ${opcHud.colors.greenHot})`, boxShadow: `0 0 18px ${accent}55` }} />
        </div>
        <div style={{ marginTop: 30, fontSize: 42, fontWeight: 1000 }}>{effect.title || effect.mainTitle || effect.name}</div>
        {effect.subtitle ? <div style={{ marginTop: 12, fontSize: 28, color: opcHud.colors.muted, fontWeight: 850, lineHeight: 1.18 }}>{effect.subtitle}</div> : null}
      </SystemPanel>
    </AbsoluteFill>
  );
};
