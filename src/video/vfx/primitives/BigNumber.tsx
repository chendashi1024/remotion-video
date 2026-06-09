import { getAccentColor, programTheme, type AccentColor } from "../themes";

type BigNumberProps = {
  value: string;
  color?: AccentColor;
  suffix?: string;
};

export const BigNumber: React.FC<BigNumberProps> = ({ value, color = "blue", suffix = "+" }) => {
  const accent = getAccentColor(color);

  return (
    <div
      style={{
        color: programTheme.colors.text,
        fontSize: 128,
        lineHeight: 0.92,
        fontWeight: 1000,
        letterSpacing: 0,
        textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 0 24px rgba(255,255,255,0.22)",
      }}
    >
      {value}
      <span style={{ color: accent }}>{suffix}</span>
    </div>
  );
};
