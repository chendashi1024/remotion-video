import { AbsoluteFill, useVideoConfig } from "remotion";
import type { VfxComponentProps } from "../types";
import { clampText, vfxTheme } from "../theme";
import { appear, softScale } from "../utils";

export const HeroTitle: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const opacity = appear(frame, durationInFrames);
  const scale = softScale(frame, fps);
  const text = clampText(effect.text, effect.name);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: `0 ${vfxTheme.safeX}px`,
        fontFamily: vfxTheme.fontFamily,
        color: vfxTheme.colors.text,
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 930,
          textAlign: "center",
          fontSize: text.length > 14 ? 104 : 132,
          lineHeight: 1.05,
          fontWeight: 1000,
          letterSpacing: 0,
          transform: `scale(${scale})`,
          textShadow: `0 0 18px rgba(255,255,255,0.5), ${vfxTheme.shadow.cyan}`,
          WebkitTextStroke: "1.5px rgba(255,255,255,0.22)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
