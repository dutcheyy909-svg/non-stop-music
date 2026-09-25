export function slugId(prefix: string, value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${prefix}-${slug || "item"}-${index + 1}`;
}

export function parseBudget(value: string) {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/£?\s*([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : 0;
}

export function excelSerialToIso(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 20000) return value;
  const utc = Date.UTC(1899, 11, 30) + n * 86400000;
  return new Date(utc).toISOString().slice(0, 10);
}
