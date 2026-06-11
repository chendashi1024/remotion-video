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
          gap: 10,
          color: matrixOpcTheme.colors.green,
          opacity: pulse * 0.84,
          textShadow: "0 0 8px rgba(40,245,154,0.22)",
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            border: `1px solid ${matrixOpcTheme.colors.green}`,
            boxShadow: "0 0 6px rgba(40,245,154,0.2)",
            flex: "0 0 auto",
          }}
        />
        <div style={{ fontSize: 20, lineHeight: "22px", fontWeight: 900, letterSpacing: 1 }}>C哥OPC</div>
        {variant === "full" ? (
          <>
            <div style={{ width: 1, height: 14, background: matrixOpcTheme.colors.hairline }} />
            <div
              style={{
                fontFamily: matrixOpcTheme.monoFont,
                color: matrixOpcTheme.colors.muted,
                fontSize: 12,
                lineHeight: "14px",
                letterSpacing: 1.8,
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
