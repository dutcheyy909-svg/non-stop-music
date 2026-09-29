import type { Opportunity, Store } from "./types";

export type FeeKind = "cash" | "split" | "tbc";

export type ListedFee = {
  kind: FeeKind;
  gbp: number;
  highGbp: number;
  label: string;
};

export function listedFee(value: unknown): ListedFee {
  const raw = String(value ?? "").trim();
  if (!raw) return { kind: "tbc", gbp: 0, highGbp: 0, label: "No fee on listing" };

  const splitDeal = /50\s*\/\s*50|\bsplit\b/i.test(raw);
  const pounds = [...raw.matchAll(/£\s*([0-9][0-9,]*(?:\.\d+)?)/g)].map((match) =>
    Number(match[1].replace(/,/g, "")),
  );
  const cashPounds = pounds.filter((n) => n >= 100);

  if (splitDeal && cashPounds.length === 0) {
    return { kind: "split", gbp: 0, highGbp: 0, label: "Split / no cash fee listed" };
  }
  if (cashPounds.length) {
    const gbp = cashPounds[0];
    const highGbp = cashPounds[cashPounds.length - 1];
    return {
      kind: "cash",
      gbp,
      highGbp,
      label: highGbp > gbp ? `£${gbp.toLocaleString("en-GB")}–£${highGbp.toLocaleString("en-GB")} listed` : `£${gbp.toLocaleString("en-GB")} listed`,
    };
  }
  if (splitDeal) return { kind: "split", gbp: 0, highGbp: 0, label: "Split / no cash fee listed" };
  if (/terms|tbc|tba|negotia|shown on live/i.test(raw)) {
    return { kind: "tbc", gbp: 0, highGbp: 0, label: "Fee TBC" };
  }
  return { kind: "tbc", gbp: 0, highGbp: 0, label: "No cash fee listed" };
}

export function isOpenBrief(item: Opportunity) {
  return !/closed|passed|expired|lost/i.test(item.status || "open");
}

export function summarisePipeline(store: Store) {
  const briefs = (store.opportunities ?? []).filter(isOpenBrief).map((item) => {
    const fee = listedFee(item.budget);
    return { ...item, fee, forecastGbp: fee.gbp };
  });
  const cash = briefs.filter((item) => item.fee.kind === "cash");
  const splits = briefs.filter((item) => item.fee.kind === "split");
  const tbc = briefs.filter((item) => item.fee.kind === "tbc");
  const cashListed = cash.reduce((sum, item) => sum + item.fee.gbp, 0);
  const cashCeiling = cash.reduce((sum, item) => sum + item.fee.highGbp, 0);
  const weighted = cash.reduce((sum, item) => sum + item.fee.gbp * (Math.min(100, Math.max(0, item.fitScore)) / 100), 0);

  return {
    briefs,
    openCount: briefs.length,
    cashCount: cash.length,
    splitCount: splits.length,
    tbcCount: tbc.length,
    cashListed,
    cashCeiling,
    weighted: Math.round(weighted),
  };
}

export function moneyGbp(value: number) {
  return `£${Math.round(value).toLocaleString("en-GB")}`;
}
