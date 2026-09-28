import { CopyBlock } from "@/components/CopyBlock";
import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { generateSyncAssistant, generateSyncForVault } from "@/lib/actions";
import { generateSyncMetadata, inputFromTrack } from "@/lib/sync-tags";
import { readStore } from "@/lib/store";

const lanes = [
  { key: "tvDrama" as const, label: "TV drama" },
  { key: "gamingTrailer" as const, label: "Gaming trailer" },
  { key: "sportsPromo" as const, label: "Sports promo" },
  { key: "fashionAdvert" as const, label: "Fashion advert" },
];

export default async function SyncAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track: trackId } = await searchParams;
  const store = await readStore();
  const track = store.tracks.find((item) => item.id === trackId) ?? store.tracks[0];
  const preview = track ? generateSyncMetadata(inputFromTrack(track)) : null;
  const packed = store.tracks.filter((item) => item.syncDescription).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">SYNC</p>
        <h1 className="mt-1 text-3xl font-semibold">Sync assistant</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Built in Non-Stop — no third-party metadata mill. Enter or pick a vault cut and the desk writes a supervisor
          description, keywords, suggested TV/film use, and playlist submission categories under TV drama, gaming
          trailer, sports promo, and fashion advert.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Vault cuts" value={store.tracks.length} />
        <Kpi label="Packs saved" value={packed} />
        <Kpi label="Top lane" value={preview?.lanes[0]?.label ?? "—"} hint={preview ? `${preview.lanes[0].score}% fit` : ""} />
      </div>

      <Panel title="Generate a pack">
        <form action={generateSyncAssistant} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            Vault track
            <select
              name="trackId"
              defaultValue={track?.id}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            >
              {store.tracks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} — {item.artist}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Title
            <input
              name="title"
              defaultValue={track?.title}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Artist
            <input
              name="artist"
              defaultValue={track?.artist}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            BPM
            <input
              name="bpm"
              defaultValue={track?.bpm}
              placeholder="140"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Vocal
            <select name="vocal" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              <option value="">From tags</option>
              <option value="instrumental">Instrumental</option>
              <option value="vocal">Vocal</option>
              <option value="both">Both / stems</option>
            </select>
          </label>
          <label className="text-sm">
            Genre
            <input
              name="genre"
              defaultValue={track?.genre}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Mood
            <input
              name="mood"
              defaultValue={track?.mood}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            File name (optional)
            <input
              name="fileName"
              defaultValue={track?.fileName}
              placeholder="dark_emotional_cinematic_trap_140bpm.wav"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Extra notes / usage hints
            <textarea
              name="notes"
              rows={3}
              placeholder="tension, sports promo, no vocal, hybrid trailer…"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <input type="hidden" name="usage" value="" />
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500">
              Generate & save to vault
            </button>
          </div>
        </form>
        <form action={generateSyncForVault} className="mt-3">
          <button className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">Run assistant on whole vault</button>
        </form>
      </Panel>

      {track ? (
        <>
          <Panel title={`Pack — ${track.title}`}>
            <p className="text-sm text-zinc-400">{track.syncDescription || preview?.description}</p>
            <CopyBlock
              text={[
                track.syncDescription || preview?.description,
                "",
                "KEYWORDS",
                track.syncKeywords || preview?.keywords.join(", "),
                "",
                "SUGGESTED USE",
                track.syncSuggestedUse || preview?.suggestedUse,
                "",
                ...lanes.map((lane) => {
                  const cats = track.syncPlaylists?.[lane.key]?.length
                    ? track.syncPlaylists[lane.key]
                    : preview?.playlists[lane.key] ?? [];
                  return `${lane.label.toUpperCase()}\n- ${cats.join("\n- ")}`;
                }),
              ].join("\n")}
              filename={`${track.id}-sync-pack.txt`}
            />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Track description">
              <p className="text-sm text-zinc-300">{track.syncDescription || preview?.description}</p>
            </Panel>
            <Panel title="Keywords">
              <p className="text-sm text-zinc-300">{track.syncKeywords || preview?.keywords.join(", ")}</p>
            </Panel>
          </div>

          <Panel title="Suggested TV / film / promo use">
            <pre className="whitespace-pre-wrap text-sm text-zinc-300">
              {track.syncSuggestedUse || preview?.suggestedUse}
            </pre>
          </Panel>

          <Panel title="Playlist submission categories">
            <div className="grid gap-4 md:grid-cols-2">
              {lanes.map((lane) => {
                const cats = track.syncPlaylists?.[lane.key]?.length
                  ? track.syncPlaylists[lane.key]
                  : preview?.playlists[lane.key] ?? [];
                const scored = preview?.lanes.find((item) => item.label === lane.label);
                return (
                  <article key={lane.key} className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs tracking-[0.18em] text-fuchsia-300">{scored ? `${scored.score}% fit` : "Lane"}</p>
                    <h3 className="mt-1 font-semibold">{lane.label}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{scored?.why}</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                      {cats.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </Panel>
        </>
      ) : null}

      <Panel title="Vault sync packs">
        <DataTable
          headers={["Track", "Top use", "Keywords", "TV drama", "Gaming", "Sports", "Fashion"]}
          rows={store.tracks.map((item) => [
            item.title,
            (item.syncSuggestedUse || "—").split("\n")[0],
            item.syncKeywords || "—",
            (item.syncPlaylists?.tvDrama ?? []).slice(0, 2).join(" · ") || "—",
            (item.syncPlaylists?.gamingTrailer ?? []).slice(0, 2).join(" · ") || "—",
            (item.syncPlaylists?.sportsPromo ?? []).slice(0, 2).join(" · ") || "—",
            (item.syncPlaylists?.fashionAdvert ?? []).slice(0, 2).join(" · ") || "—",
          ])}
        />
      </Panel>
    </div>
  );
}
