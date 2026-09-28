export function text(value: unknown) {
  if (value == null) return "";
  return String(value);
}

export function slugId(prefix: string, value: unknown, index: number) {
  const slug = text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${prefix}-${slug || "item"}-${index + 1}`;
}

export function parseBudget(value: unknown) {
  const cleaned = text(value).replace(/,/g, "");
  const match = cleaned.match(/£?\s*([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : 0;
}

export function excelSerialToIso(value: unknown) {
  const raw = text(value);
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 20000) return raw;
  const utc = Date.UTC(1899, 11, 30) + n * 86400000;
  return new Date(utc).toISOString().slice(0, 10);
}

export function splitContact(value: unknown) {
  const raw = text(value);
  const email = raw.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] ?? "";
  const phone = raw.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0] ?? "";
  return { email, phone };
}

export function firstUrl(...values: Array<unknown>) {
  for (const value of values) {
    const match = text(value).match(/https?:\/\/[^\s]+/i);
    if (match) return match[0];
  }
  return "";
}
