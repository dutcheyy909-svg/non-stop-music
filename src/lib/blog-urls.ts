import { text } from "./ids";

const MOVES: Record<string, string> = {
  "residentadvisor.net": "https://ra.co/",
  "usa.djmag.com": "https://djmag.com/",
  "djmag.com": "https://djmag.com/",
  "datatransmission.co.uk": "https://datatransmission.co/",
  "digitalhighblog.com": "https://digitalhigh.blog/",
  "hmwl.org": "https://www.housemusicwithlove.com/",
  "gerdas-tanzcafe.blogspot.de": "https://www.gerdas-tanzcafe.de/",
  "soignetesoreilles.blogspot.fr": "https://soignetesoreilles.blogspot.com/",
  "purplesneakers.com.au": "https://themusic.com.au/purple-sneakers",
  "passionweiss.com": "https://www.powmag.net/",
  "thekollection.com": "https://www.thekollection.org/",
  "novafuture-blog.com": "https://novafuture.blog/",
  "noiseporn.com": "https://noiseprn.com/",
  "edm.com": "https://edm.com/",
};

export function publicWebUrl(value: unknown) {
  const raw = text(value).trim();
  if (!raw) return "";
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProto);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (MOVES[host]) return MOVES[host];
    if (url.protocol === "http:") url.protocol = "https:";
    return url.toString();
  } catch {
    return withProto;
  }
}
