import { col, headerKey, parseDelimited } from "./table-import";
import { text } from "./ids";

export type AmuseRow = {
  title: string;
  artist: string;
  isrc: string;
  upc: string;
  preReleaseLink: string;
};

function norm(value: string) {
  return text(value)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function parseAmuseTable(raw: string): AmuseRow[] {
  const { headers, rows } = parseDelimited(raw);
  if (!headers.length) return [];
  const hasId = headers.some((h) =>
    ["isrc", "upc", "ean", "barcode", "catalog", "prerelease", "prereleaselink", "presave", "presavelink", "smartlink", "link", "url", "amuselink"].includes(
      h,
    ),
  );
  if (!hasId) return [];

  const out: AmuseRow[] = [];
  for (const cols of rows) {
    const title = col(headers, cols, ["title", "track", "tracktitle", "song", "name", "releasetitle"]);
    const isrc = col(headers, cols, ["isrc"]).replace(/\s+/g, "").toUpperCase();
    const upc = col(headers, cols, ["upc", "ean", "barcode", "catalog"]).replace(/\s+/g, "");
    const preReleaseLink = col(headers, cols, [
      "prereleaselink",
      "prerelease",
      "presave",
      "presavelink",
      "smartlink",
      "amuselink",
      "link",
      "url",
    ]);
    if (!title || (!isrc && !upc && !preReleaseLink)) continue;
    out.push({
      title,
      artist: col(headers, cols, ["artist", "artists", "primaryartist"]),
      isrc,
      upc,
      preReleaseLink,
    });
  }
  return out;
}

export function matchAmuseRow(title: string, artist: string, rows: AmuseRow[]) {
  const wantTitle = norm(title);
  const wantArtist = norm(artist);
  return (
    rows.find((row) => norm(row.title) === wantTitle && (!row.artist || !wantArtist || norm(row.artist) === wantArtist)) ||
    rows.find((row) => norm(row.title) === wantTitle) ||
    rows.find((row) => wantTitle && (norm(row.title).includes(wantTitle) || wantTitle.includes(norm(row.title))))
  );
}

export function titleKey(title: string, artist: string) {
  return `${norm(title)}|${norm(artist)}`;
}
