import { text } from "./ids";

export function headerKey(value: string) {
  return text(value)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function parseDelimited(raw: string) {
  const lines = text(raw)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return { headers: [] as string[], rows: [] as string[][] };
  const delim = lines[0].includes("\t") ? "\t" : ",";
  return {
    headers: lines[0].split(delim).map((cell) => headerKey(cell)),
    rows: lines.slice(1).map((line) => line.split(delim)),
  };
}

export function col(headers: string[], cols: string[], aliases: string[]) {
  const idx = headers.findIndex((h) => aliases.includes(h));
  return idx >= 0 ? text(cols[idx]) : "";
}
