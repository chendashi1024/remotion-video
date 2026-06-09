import type { CoverData, CoverVariant } from "./types";

const hasChinese = (value: string) => /[\u4e00-\u9fa5]/.test(value);

export const splitTitle = (title: string): string[] => {
  if (title.includes("\n")) {
    return title
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const cleanTitle = title.trim();
  if (cleanTitle.length <= 6) {
    return [cleanTitle];
  }

  const target = cleanTitle.length <= 9 ? Math.ceil(cleanTitle.length / 2) : 5;
  let splitAt = target;
  for (let index = target; index < cleanTitle.length; index++) {
    if (!hasChinese(cleanTitle[index])) {
      splitAt = index + 1;
      break;
    }
  }

  return [cleanTitle.slice(0, splitAt), cleanTitle.slice(splitAt)].filter(Boolean);
};

export const getHighlightedParts = (line: string, words: string[]) => {
  const matches = words
    .filter(Boolean)
    .map((word) => ({ word, index: line.indexOf(word) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) {
    return [{ text: line, highlighted: false }];
  }

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index < cursor) {
      continue;
    }
    if (match.index > cursor) {
      parts.push({ text: line.slice(cursor, match.index), highlighted: false });
    }
    parts.push({ text: match.word, highlighted: true });
    cursor = match.index + match.word.length;
  }

  if (cursor < line.length) {
    parts.push({ text: line.slice(cursor), highlighted: false });
  }

  return parts;
};

export const getCompositionId = (_data: CoverData, variant: CoverVariant) =>
  `cover-${variant}`;
