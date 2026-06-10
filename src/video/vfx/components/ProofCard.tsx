import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { appear } from "../utils";

export const ProofCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const lines = splitVisualText(effect.proofText || effect.title || effect.text || effect.name).slice(0, 4);
  const isLeft = effect.position === "left";
  const x = interpolate(frame, [0, 18], [isLeft ? -72 : 72, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 420,
          right: isLeft ? undefined : 36,
          left: isLeft ? 36 : undefined,
          width: 405,
          minHeight: 270,
          padding: "22px 24px",
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(248,250,252,0.96), rgba(226,232,240,0.9))",
          color: "#0f172a",
          boxShadow: "0 18px 40px rgba(0,0,0,0.34), 0 0 0 1px rgba(96,165,250,0.72)",
          transform: `translateX(${x}px) rotateY(${isLeft ? 6 : -6}deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ color: "#2563eb", fontSize: 18, fontWeight: 1000, letterSpacing: 2, textTransform: "uppercase" }}>
            {effect.proofLabel || effect.eyebrow || effect.title || "PROOF CARD"}
          </div>
          <div style={{ borderRadius: 999, padding: "5px 10px", background: "#dbeafe", color: "#1d4ed8", fontSize: 15, fontWeight: 1000 }}>
            {effect.badge || "DATA"}
          </div>
        </div>
        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
          {lines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: index === 0 ? "rgba(37,99,235,0.12)" : "rgba(15,23,42,0.06)",
                fontSize: index === 0 ? 24 : 18,
                fontWeight: index === 0 ? 1000 : 820,
                lineHeight: 1.22,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: "8px 14px",
            background: "#22c55e",
            color: "#052e16",
            fontSize: 15,
            fontWeight: 1000,
            letterSpacing: 2,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#052e16" }} />
          {effect.verified || "REAL · VERIFIED"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
