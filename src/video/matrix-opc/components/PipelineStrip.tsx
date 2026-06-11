import { matrixOpcTheme } from "../theme";

type PipelineStripProps = {
  items: string[];
};

export const PipelineStrip: React.FC<PipelineStripProps> = ({ items }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 10 }}>
      {items.map((item, index) => (
        <div key={item} style={{ position: "relative", minWidth: 0, textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
              border: `1px solid ${matrixOpcTheme.colors.green}88`,
              background: "rgba(40,245,154,0.08)",
              color: matrixOpcTheme.colors.green,
              boxShadow: matrixOpcTheme.shadow.greenSoft,
              fontFamily: matrixOpcTheme.monoFont,
              fontSize: 17,
              fontWeight: 900,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div style={{ marginTop: 10, color: matrixOpcTheme.colors.text, fontSize: 18, fontWeight: 760 }}>{item}</div>
          {index < items.length - 1 ? (
            <div
              style={{
                position: "absolute",
                top: 24,
                left: "calc(50% + 32px)",
                right: "-42%",
                height: 1,
                background: `linear-gradient(90deg, ${matrixOpcTheme.colors.green}, transparent)`,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

