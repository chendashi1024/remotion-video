import { slideY } from "../utils";
import { delayedProgress } from "./motion";
import { getAccentColor, programTheme, type AccentColor } from "../themes";

type StepRowsProps = {
  items: string[];
  frame: number;
  color?: AccentColor;
  compact?: boolean;
};

export const StepRows: React.FC<StepRowsProps> = ({ items, frame, color = "blue", compact = false }) => {
  const accent = getAccentColor(color);

  return (
    <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
      {items.map((item, index) => {
        const progress = delayedProgress(frame, index, 6);
        const isLast = index === items.length - 1;
        return (
          <div
            key={`${item}-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: compact ? "40px 1fr" : "48px 1fr",
              alignItems: "center",
              gap: compact ? 14 : 18,
              opacity: progress,
              transform: `translateY(${slideY(frame - index * 6, 20)}px)`,
            }}
          >
            <div
              style={{
                width: compact ? 34 : 42,
                height: compact ? 34 : 42,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isLast ? programTheme.colors.gold : `${accent}2e`,
                color: isLast ? "#111827" : accent,
                fontSize: compact ? 17 : 20,
                fontWeight: 1000,
              }}
            >
              {index + 1}
            </div>
            <div style={{ fontSize: compact ? 29 : 34, fontWeight: 900, lineHeight: 1.2 }}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};
