import { matrixOpcTheme, getMatrixAccent, type MatrixAccent } from "../theme";

type MetricCardProps = {
  label: string;
  value: string;
  subValue?: string;
  accent?: MatrixAccent;
};

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, accent = "green" }) => {
  const color = getMatrixAccent(accent);

  return (
    <div
      style={{
        minHeight: 126,
        padding: "18px 18px",
        border: `1px solid ${color}4f`,
        background: "rgba(0, 18, 14, 0.56)",
        boxShadow: `0 0 20px ${color}1f`,
      }}
    >
      <div style={{ color: matrixOpcTheme.colors.text, fontSize: 18, fontWeight: 800 }}>{label}</div>
      <div
        style={{
          marginTop: 16,
          color,
          fontSize: value.length > 4 ? 32 : 44,
          lineHeight: 1,
          fontWeight: 950,
          textShadow: `0 0 18px ${color}55`,
        }}
      >
        {value}
      </div>
      {subValue ? (
        <div style={{ marginTop: 12, color: matrixOpcTheme.colors.muted, fontSize: 15, fontWeight: 650 }}>{subValue}</div>
      ) : null}
    </div>
  );
};

