import { AbsoluteFill, interpolate } from "remotion";
import { matrixOpcTheme } from "../theme";

type BrandSignatureProps = {
  frame?: number;
  variant?: "compact" | "full";
};

export const BrandSignature: React.FC<BrandSignatureProps> = ({ frame = 0, variant = "full" }) => {
  const y = interpolate(frame, [0, 45], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: matrixOpcTheme.fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: matrixOpcTheme.layout.brandLeft,
          bottom: matrixOpcTheme.layout.brandBottom,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: matrixOpcTheme.colors.green,
          opacity: 0.85,
          transform: `translateY(${y}px)`,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            border: `1px solid ${matrixOpcTheme.colors.green}`,
            flex: "0 0 auto",
          }}
        />
        <div style={{ fontSize: 28, lineHeight: "30px", fontWeight: 900, letterSpacing: 1.5 }}>C哥OPC</div>
        {variant === "full" ? (
          <>
            <div style={{ width: 1, height: 18, background: matrixOpcTheme.colors.hairline }} />
            <div
              style={{
                fontFamily: matrixOpcTheme.monoFont,
                color: matrixOpcTheme.colors.muted,
                fontSize: 14,
                lineHeight: "16px",
                letterSpacing: 2,
                transform: "translateY(1px)",
              }}
            >
              SYSTEMS THINKING · CONTENT ENGINEERING
            </div>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
