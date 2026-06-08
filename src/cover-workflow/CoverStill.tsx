import { AbsoluteFill, Img, staticFile } from "remotion";
import { getHighlightedParts, splitTitle } from "./text";
import type { CoverData, CoverVariant } from "./types";
import { variantLabels, variantStyles } from "./variants";

type CoverStillProps = {
  data: CoverData;
  variant: CoverVariant;
};

const colorByRimLight = {
  "cyan-blue": "#22d3ee",
  "purple-blue": "#8b5cf6",
  "gold-cyan": "#fbbf24",
  "white-blue": "#dbeafe",
};

const baseFont =
  "'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, sans-serif";

const CoverBackground = ({ data, variant }: CoverStillProps) => {
  const style = variantStyles[variant];

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(data.background)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2, 6, 23, 0.24) 0%, rgba(2, 6, 23, 0.04) 38%, rgba(2, 6, 23, 0.54) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 31%, ${style.glow} 0%, rgba(15, 23, 42, 0) 32%), radial-gradient(circle at 50% 86%, rgba(15, 23, 42, 0.1) 0%, rgba(2, 6, 23, 0.84) 58%)`,
          mixBlendMode: "screen",
          opacity: 0.72,
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 190px rgba(0, 0, 0, 0.72)",
        }}
      />
    </AbsoluteFill>
  );
};

const PersonLayer = ({ data, variant }: CoverStillProps) => {
  const style = variantStyles[variant];
  const rimColor = colorByRimLight[data.personStyle.rimLight];
  const shadowOpacity = data.personStyle.shadow === "strong" ? 0.62 : 0.4;
  const scale = data.personStyle.scale || 1;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: style.personX - (style.personWidth * scale) / 2,
          bottom: style.personBottom + 24,
          width: style.personWidth * scale,
          height: 290,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.58)",
          filter: "blur(38px)",
          opacity: shadowOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: style.personX - (style.personWidth * scale) / 2,
          bottom: style.personBottom + 32,
          width: style.personWidth * scale,
          height: style.personWidth * scale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rimColor} 0%, rgba(34, 211, 238, 0.22) 26%, rgba(0, 0, 0, 0) 68%)`,
          filter: "blur(24px)",
          opacity: 0.68,
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile(data.person)}
        style={{
          position: "absolute",
          left: style.personX - (style.personWidth * scale) / 2,
          bottom: style.personBottom,
          width: style.personWidth * scale,
          objectFit: "contain",
          filter: `drop-shadow(0 0 24px ${rimColor}) drop-shadow(0 34px 42px rgba(0, 0, 0, ${shadowOpacity})) saturate(1.08) contrast(1.04)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: style.personX - (style.personWidth * scale) / 2,
          bottom: style.personBottom,
          width: style.personWidth * scale,
          height: style.personWidth * 1.18 * scale,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${data.personStyle.ambientColor} 78%, rgba(0,0,0,0) 100%)`,
          opacity: 0.18,
          mixBlendMode: "color",
          WebkitMaskImage: `url(${staticFile(data.person)})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "bottom center",
        }}
      />
      {data.personStyle.lowerFade ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 360,
            background:
              "linear-gradient(180deg, rgba(2, 6, 23, 0) 0%, rgba(2, 6, 23, 0.58) 72%, rgba(2, 6, 23, 0.82) 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const TitleLayer = ({ data, variant }: CoverStillProps) => {
  const style = variantStyles[variant];
  const lines = splitTitle(data.title);
  const words = data.textStyle.highlightWords;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: style.titleLeft,
          top: style.titleTop - 42,
          width: style.titleWidth,
          height: 360,
          borderRadius: 30,
          background:
            "linear-gradient(180deg, rgba(2, 6, 23, 0.62), rgba(15, 23, 42, 0.12))",
          filter: "blur(0.2px)",
          opacity: style.panelOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: style.titleLeft,
          top: style.titleTop,
          width: style.titleWidth,
          fontFamily: baseFont,
          fontWeight: 1000,
          fontSize: style.titleSize,
          lineHeight: style.titleLineHeight,
          letterSpacing: 0,
          textAlign: style.titleAlign,
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} style={{ whiteSpace: "nowrap" }}>
            {getHighlightedParts(line, words).map((part, partIndex) => (
              <span
                key={`${part.text}-${partIndex}`}
                style={{
                  color: part.highlighted ? style.accent : "#ffffff",
                  WebkitTextStroke: `${style.strokeWidth}px rgba(2, 6, 23, 0.88)`,
                  paintOrder: "stroke fill",
                  textShadow: part.highlighted
                    ? `0 0 18px ${style.glow}, 0 10px 28px rgba(0, 0, 0, 0.72)`
                    : "0 10px 28px rgba(0, 0, 0, 0.76)",
                }}
              >
                {part.text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: style.titleLeft + (style.titleAlign === "center" ? 0 : 8),
          top: style.subtitleTop,
          width: style.titleWidth,
          display: "flex",
          justifyContent: style.titleAlign === "center" ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            padding: "14px 28px",
            borderRadius: 999,
            background: "rgba(2, 6, 23, 0.72)",
            border: `2px solid ${style.accent}`,
            color: style.secondary,
            fontFamily: baseFont,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 0,
            boxShadow: `0 0 28px ${style.glow}, 0 16px 32px rgba(0, 0, 0, 0.38)`,
          }}
        >
          {data.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ForegroundEffects = ({ data, variant }: CoverStillProps) => {
  const style = variantStyles[variant];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -70,
          right: -70,
          bottom: -120,
          height: 520,
          background: `radial-gradient(ellipse at 50% 45%, ${style.glow} 0%, rgba(2, 6, 23, 0) 48%)`,
          filter: "blur(18px)",
          opacity: 0.46,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 52,
          top: 76,
          padding: "10px 18px",
          borderRadius: 999,
          border: `1px solid ${style.accent}`,
          color: "#e0f2fe",
          fontFamily: baseFont,
          fontSize: 24,
          fontWeight: 800,
          background: "rgba(2, 6, 23, 0.5)",
          boxShadow: `0 0 24px ${style.glow}`,
        }}
      >
        {variantLabels[variant]} · {data.id}
      </div>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.12) 100%)",
          mixBlendMode: "screen",
          opacity: variant === "clean" ? 0.18 : 0.28,
        }}
      />
    </AbsoluteFill>
  );
};

export const CoverStill: React.FC<CoverStillProps> = ({ data, variant }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      <CoverBackground data={data} variant={variant} />
      <PersonLayer data={data} variant={variant} />
      <ForegroundEffects data={data} variant={variant} />
      <TitleLayer data={data} variant={variant} />
    </AbsoluteFill>
  );
};
