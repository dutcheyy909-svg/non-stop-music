import { readFile, writeFile } from "node:fs/promises";

const store = JSON.parse(await readFile("data/store.json", "utf8"));
const blogs = store.blogs ?? [];

function hrefOf(website) {
  const raw = String(website || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 DutcheyyRecordsLinkCheck/1.0" },
    });
    if ([405, 403, 400, 401, 501].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 DutcheyyRecordsLinkCheck/1.0" },
      });
    }
    return { ok: res.status < 400, status: res.status, final: res.url };
  } catch (error) {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
        headers: { "user-agent": "Mozilla/5.0 DutcheyyRecordsLinkCheck/1.0" },
      });
      return { ok: res.status < 400, status: res.status, final: res.url };
    } catch (err) {
      return { ok: false, status: 0, error: String(err.message || err) };
    }
  } finally {
    clearTimeout(timer);
  }
}

const unique = [...new Map(blogs.map((b) => [hrefOf(b.website), b])).entries()].filter(([href]) => href);
const results = [];
const concurrency = 12;
let i = 0;
async function worker() {
  while (i < unique.length) {
    const idx = i++;
    const [href, blog] = unique[idx];
    let result = await probe(href);
    if (!result.ok && href.startsWith("http://")) {
      const httpsTry = await probe(href.replace(/^http:\/\//i, "https://"));
      if (httpsTry.ok) result = { ...httpsTry, upgraded: true };
    }
    results.push({
      name: blog.name,
      stored: blog.website,
      href,
      ...result,
    });
    if (results.length % 40 === 0) console.error(`checked ${results.length}/${unique.length}`);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
results.sort((a, b) => a.name.localeCompare(b.name));
const summary = {
  blogs: blogs.length,
  uniqueUrls: unique.length,
  empty: blogs.filter((b) => !String(b.website || "").trim()).length,
  ok: results.filter((r) => r.ok).length,
  fail: results.filter((r) => !r.ok).length,
  fails: results.filter((r) => !r.ok),
  upgrades: results.filter((r) => r.upgraded),
};
await writeFile("/tmp/blog-link-check.json", JSON.stringify({ summary: { ...summary, fails: summary.fails.length }, results }, null, 2));
console.log(JSON.stringify({ ...summary, fails: summary.fails.slice(0, 80) }, null, 2));
