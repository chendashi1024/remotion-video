import { AbsoluteFill, interpolate } from "remotion";
import { matrixOpcTheme } from "../theme";

type BrandSignatureProps = {
  frame: number;
  variant?: "compact" | "full";
};

export const BrandSignature: React.FC<BrandSignatureProps> = ({ frame, variant = "full" }) => {
  const pulse = interpolate(frame % 150, [0, 24, 150], [0.62, 1, 0.62], {
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
          opacity: pulse * 0.92,
          textShadow: "0 0 10px rgba(40,245,154,0.28)",
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            border: `1px solid ${matrixOpcTheme.colors.green}`,
            boxShadow: "0 0 8px rgba(40,245,154,0.28)",
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
