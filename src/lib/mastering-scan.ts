import { slugId } from "./ids";
import { extractMeters, type MasteringAdvice } from "./mastering";

type SearchHit = { title: string; snippet: string; url: string };

async function searchTavily(query: string): Promise<SearchHit[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query,
      search_depth: "basic",
      max_results: 8,
    }),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { results?: Array<{ title?: string; content?: string; url?: string }> };
  return (json.results ?? [])
    .map((row) => ({
      title: String(row.title || ""),
      snippet: String(row.content || ""),
      url: String(row.url || ""),
    }))
    .filter((row) => row.title && row.url);
}

async function searchDuckDuckGo(query: string): Promise<SearchHit[]> {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "DutcheyyRecords/1.0 (mastering research)" },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const hits: SearchHit[] = [];
  const block = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/span>/gi;
  let match: RegExpExecArray | null;
  while ((match = block.exec(html)) && hits.length < 8) {
    hits.push({
      url: match[1].replace(/&amp;/g, "&"),
      title: match[2].replace(/<[^>]+>/g, "").trim(),
      snippet: match[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return hits.filter((hit) => hit.title && hit.url.startsWith("http"));
}

export async function scanMasteringWeb(query: string): Promise<MasteringAdvice[]> {
  const q = query.trim() || "EDM mastering LUFS true peak Spotify club 2026";
  const now = new Date().toISOString();
  const hits = (await searchTavily(q)).concat(await searchDuckDuckGo(q));
  const seen = new Set<string>();
  const unique: SearchHit[] = [];
  for (const hit of hits) {
    const key = hit.url.split("?")[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(hit);
  }
  return unique.slice(0, 10).map((hit, i) => {
    const meters = extractMeters(`${hit.title} ${hit.snippet}`);
    return {
      id: slugId("scan", hit.title, i),
      query: q,
      title: hit.title,
      snippet: hit.snippet.slice(0, 420),
      url: hit.url,
      lufs: meters.lufs,
      truePeak: meters.truePeak,
      scannedAt: now,
    };
  });
}
