import { firstUrl, parseBudget, slugId, text } from "./ids";
import type { Opportunity } from "./types";

const API = "https://api.browse.ai/v2";

type Captured = {
  capturedTexts?: Record<string, unknown>;
  capturedLists?: Record<string, Array<Record<string, unknown>>>;
  capturedData?: {
    capturedTexts?: Record<string, unknown>;
    capturedLists?: Record<string, Array<Record<string, unknown>>>;
  };
};

function keyOf(row: Record<string, unknown>, aliases: string[]) {
  const map = new Map(Object.keys(row).map((k) => [k.toLowerCase().replace(/[^a-z0-9]+/g, ""), row[k]]));
  for (const alias of aliases) {
    const hit = map.get(alias);
    if (hit != null && text(hit)) return text(hit);
  }
  return "";
}

function rowToOpportunity(row: Record<string, unknown>, index: number, tags: string[]): Opportunity {
  const title =
    keyOf(row, ["title", "brief", "briefproject", "project", "name", "opportunity", "listing"]) ||
    `Browse AI brief ${index + 1}`;
  const genre = keyOf(row, ["genre", "genrestyle", "style", "category"]);
  const mood = keyOf(row, ["mood", "moodenergy", "energy", "vibe"]);
  const budget = keyOf(row, ["budget", "budgetfee", "fee", "pay", "rate"]);
  const url = firstUrl(
    keyOf(row, ["url", "link", "submissionlink", "sourceoftruth", "sourceurl", "href"]),
  );
  const hay = tags.map((t) => t.toLowerCase());
  const needles = `${genre} ${mood} edm electronic`.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = needles.filter((n) => hay.some((h) => h.includes(n) || n.includes(h))).length;
  const fitScore = Math.min(98, 40 + hits * 8);
  return {
    id: slugId("bai", title, index),
    priority: keyOf(row, ["priority"]) || "Medium",
    title,
    source: keyOf(row, ["source", "sourceplatform", "platform"]) || "Browse AI",
    sourceOfTruthUrl: url,
    mediaType: keyOf(row, ["mediatype", "media", "type"]) || "sync",
    genre,
    mood,
    vocal: keyOf(row, ["vocal", "vocalinstrumental"]),
    usage: keyOf(row, ["usage", "usagescene", "scene"]),
    deadline: keyOf(row, ["deadline", "due", "duedate", "closes"]),
    budget,
    territory: keyOf(row, ["territory", "region", "country"]),
    rights: keyOf(row, ["rights", "rightsrequired"]),
    fitScore,
    forecastGbp: parseBudget(budget),
    status: keyOf(row, ["status"]) || "open",
  };
}

export function opportunitiesFromCaptured(payload: unknown, tags: string[]): Opportunity[] {
  const root = (payload || {}) as Captured & { task?: Captured };
  const data = root.capturedData || root.task || root;
  const lists = data.capturedLists || {};
  const rows: Record<string, unknown>[] = [];
  for (const list of Object.values(lists)) {
    if (Array.isArray(list)) rows.push(...list.filter((item) => item && typeof item === "object"));
  }
  const texts = data.capturedTexts;
  if (texts && typeof texts === "object" && !rows.length) {
    rows.push(texts as Record<string, unknown>);
  }
  return rows
    .map((row, i) => rowToOpportunity(row, i, tags))
    .filter((item) => item.title);
}

export function mergeOpportunities(current: Opportunity[], incoming: Opportunity[]) {
  const seen = new Set(
    current.map((item) => (item.sourceOfTruthUrl || item.title).toLowerCase()),
  );
  const extra = incoming.filter((item) => {
    const key = (item.sourceOfTruthUrl || item.title).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...extra, ...current];
}

export function extractBrowseAiRobotId(raw: string) {
  const value = text(raw).trim();
  const fromUrl = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return fromUrl ? fromUrl[0] : value;
}

function resolveRobotId(robotId?: string) {
  const id = extractBrowseAiRobotId(robotId || process.env.BROWSE_AI_ROBOT_ID || "");
  if (!id) {
    throw new Error(
      "Paste your Browse AI robot ID or the robot page URL (dashboard.browse.ai/robots/…).",
    );
  }
  return id;
}

async function browseAi(path: string, init?: RequestInit, apiKey?: string) {
  const key = text(apiKey) || process.env.BROWSE_AI_API_KEY || "";
  if (!key) throw new Error("Paste your Browse AI API key or set BROWSE_AI_API_KEY.");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(text((json as { message?: string }).message) || `Browse AI ${res.status}`);
  }
  return json;
}

export async function pullBrowseAiOpportunities(
  tags: string[],
  robotId?: string,
  apiKey?: string,
) {
  const id = resolveRobotId(robotId);
  const json = (await browseAi(`/robots/${id}/tasks?page=1`, undefined, apiKey)) as {
    result?: {
      items?: Captured[];
      robotTasks?: { items?: Captured[] };
      tasks?: Captured[];
    };
  };
  const items =
    json.result?.robotTasks?.items ?? json.result?.items ?? json.result?.tasks ?? [];
  const latest = items.find((item) => item.capturedLists || item.capturedData || item.capturedTexts) ?? items[0];
  return opportunitiesFromCaptured(latest, tags);
}

export async function runBrowseAiRobot(robotId?: string, originUrl?: string, apiKey?: string) {
  const id = resolveRobotId(robotId);
  const origin = text(originUrl) || process.env.BROWSE_AI_ORIGIN_URL || "";
  const body = origin ? { inputParameters: { originUrl: origin } } : {};
  await browseAi(
    `/robots/${id}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    apiKey,
  );
}
