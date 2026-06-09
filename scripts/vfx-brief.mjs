const effectHeader = /^🎬\s*\[(自动|手动)\]\[(VFX-\d{3}|SHOT-\d{3})\]\[([A-Za-z]+)\]\s*$/;
const fieldLine = /^-\s*([^：:]+)[：:]\s*(.*)$/;

export const parseVfxBrief = (markdown) => {
  const items = [];
  let current = null;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    const header = line.match(effectHeader);

    if (header) {
      if (current) {
        items.push(current);
      }
      current = {
        mode: header[1],
        id: header[2],
        type: header[3],
        anchor: "",
        name: "",
        text: "",
        motion: "",
        duration: "",
        sound: "",
        outputName: "",
        requiredAction: "",
        capcutAction: "",
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const field = line.match(fieldLine);
    if (!field) {
      continue;
    }

    const key = field[1].trim();
    const value = field[2].trim();

    if (key === "锚点") current.anchor = value;
    if (key === "名称") current.name = value;
    if (key === "画面文字") current.text = value;
    if (key === "动效") current.motion = value;
    if (key === "建议时长") current.duration = value;
    if (key === "音效") current.sound = value;
    if (key === "导出命名") current.outputName = value;
    if (key === "需要你") current.requiredAction = value;
    if (key === "剪映处理") current.capcutAction = value;
  }

  if (current) {
    items.push(current);
  }

  return {
    effects: items.filter((item) => item.mode === "自动"),
    manualAssets: items.filter((item) => item.mode === "手动"),
  };
};
