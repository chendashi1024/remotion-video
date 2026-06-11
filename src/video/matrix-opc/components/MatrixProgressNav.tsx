import { interpolate } from "remotion";
import { matrixOpcTheme } from "../theme";

export type MatrixProgressStep = {
  title: string;
  start?: number;
  end?: number;
};

type MatrixProgressNavProps = {
  frame: number;
  steps: MatrixProgressStep[];
  activeIndex: number;
  progress?: number;
};

export const MatrixProgressNav: React.FC<MatrixProgressNavProps> = ({
  frame,
  steps,
  activeIndex,
  progress,
}) => {
  const y = interpolate(frame, [0, 18], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const normalizedProgress =
    progress ?? (steps.length <= 1 ? 1 : Math.min(Math.max(activeIndex / (steps.length - 1), 0), 1));

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 34,
        right: 34,
        height: 68,
        transform: `translateY(${y}px)`,
        fontFamily: matrixOpcTheme.fontFamily,
        color: matrixOpcTheme.colors.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 34,
          height: 1,
          background: "rgba(108,143,130,0.26)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: `${normalizedProgress * 100}%`,
          top: 34,
          height: 2,
          background: `linear-gradient(90deg, rgba(40,245,154,0.95), rgba(76,255,178,0.92))`,
          boxShadow: "0 0 7px rgba(40,245,154,0.24)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${normalizedProgress * 100}%`,
          top: 27,
          width: 14,
          height: 14,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          border: `1px solid ${matrixOpcTheme.colors.green}`,
          background: "rgba(40,245,154,0.2)",
          boxShadow: "0 0 8px rgba(40,245,154,0.28)",
        }}
      />
      {steps.slice(1).map((step, index) => {
        const boundaryProgress = (index + 1) / steps.length;
        const passed = boundaryProgress <= normalizedProgress + 0.002;
        return (
          <div
            key={`boundary-${step.title}-${index}`}
            style={{
              position: "absolute",
              left: `${boundaryProgress * 100}%`,
              top: 28,
              width: 10,
              height: 10,
              transform: "translateX(-50%)",
              borderRadius: "50%",
              border: `1px solid ${passed ? "rgba(40,245,154,0.82)" : matrixOpcTheme.colors.mutedDeep}`,
              background: passed ? "rgba(40,245,154,0.1)" : "rgba(0,0,0,0.2)",
              boxShadow: passed ? "0 0 5px rgba(40,245,154,0.14)" : "none",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 4,
          height: 48,
        }}
      >
        {steps.map((step, index) => {
          const active = index === activeIndex;
          const segmentStart = index / steps.length;
          const segmentEnd = (index + 1) / steps.length;
          const labelProgress = (segmentStart + segmentEnd) / 2;
          const passed = segmentStart <= normalizedProgress + 0.002;
          return (
            <div
              key={`${step.title}-${index}`}
              style={{
                position: "absolute",
                left: `${labelProgress * 100}%`,
                top: 0,
                width: 190,
                height: 48,
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  color: active ? matrixOpcTheme.colors.green : passed ? "rgba(232,255,245,0.56)" : "rgba(232,255,245,0.32)",
                  fontSize: 14,
                  fontWeight: active ? 900 : 650,
                  letterSpacing: 0.4,
                }}
              >
                {String(index + 1).padStart(2, "0")}. {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
