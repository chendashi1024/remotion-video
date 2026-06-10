import { AbsoluteFill, interpolate } from "remotion";
import type { VfxComponentProps } from "../types";
import { splitVisualText, vfxTheme } from "../theme";
import { BigNumber } from "../primitives";
import { getAccentColor } from "../themes";
import { appear } from "../utils";

export const MilestoneNumber: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = appear(frame, durationInFrames);
  const parts = splitVisualText(effect.text || "");
  const accent = getAccentColor(effect.color ?? "blue");
  const y = interpolate(frame, [0, 16], [42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainNumber = effect.mainNumber || effect.value || parts[0] || "10";

  return (
    <AbsoluteFill style={{ fontFamily: vfxTheme.fontFamily, color: vfxTheme.colors.text, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 230,
          left: vfxTheme.layout.leftX,
          width: 650,
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ color: accent, fontSize: 22, fontWeight: 1000, letterSpacing: 8, textTransform: "uppercase" }}>
          {effect.eyebrow || "MILESTONE"}
          {effect.indexText ? ` · ${effect.indexText}` : ""}
        </div>
        <div style={{ marginTop: 12 }}>
          <BigNumber value={mainNumber} color={effect.color ?? "blue"} suffix={effect.suffix ?? "+"} />
        </div>
        <div style={{ marginTop: 14, color: accent, fontSize: 25, fontWeight: 1000, letterSpacing: 7, textTransform: "uppercase" }}>
          {effect.mainLabelEn || "CONTENT ASSET · SCALE"}
        </div>
        <div style={{ marginTop: 6, color: vfxTheme.colors.text, fontSize: 30, fontWeight: 900 }}>
          {effect.mainLabelZh || effect.name}
        </div>
        {effect.secondaryNumber || effect.secondaryLabelZh ? (
          <div style={{ marginTop: 76 }}>
            <div style={{ color: vfxTheme.colors.green, fontSize: 18, fontWeight: 1000, letterSpacing: 7, textTransform: "uppercase" }}>
              ALL SYSTEMS
            </div>
            <div style={{ marginTop: 8, color: vfxTheme.colors.text, fontSize: 56, fontWeight: 1000, lineHeight: 1 }}>
              {effect.secondaryNumber || "100"}
              <span style={{ color: vfxTheme.colors.green, fontSize: 34 }}>+</span>
              <span style={{ marginLeft: 12, color: vfxTheme.colors.text, fontSize: 25, fontWeight: 850 }}>
                {effect.secondaryLabelZh || "可复用资产"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
