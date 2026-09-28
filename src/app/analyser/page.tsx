import Link from "next/link";
import { SparkDesk } from "@/app/spark/SparkDesk";
import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { applyAnalysisToTrack, capturePlaylistAnalysis } from "@/lib/actions";
import { sparkPulseUrl, keywordsFromAnalysis, trackFitToAnalysis } from "@/lib/playlist-analysis";
import { sparkTools } from "@/lib/spark-tools";
import { readStore } from "@/lib/store";

export default async function AnalyserPage({
  searchParams,
}: {
  searchParams: Promise<{ playlist?: string; analysis?: string }>;
}) {
  const { playlist: playlistId, analysis: analysisId } = await searchParams;
  const store = await readStore();
  const pulse = sparkTools.find((item) => item.id === "spark-pulse")!;
  const playlist = store.playlists.find((item) => item.id === playlistId) ?? store.playlists.find((item) => item.spotifyUrl);
  const analyses = store.playlistAnalyses ?? [];
  const selected = analyses.find((item) => item.id === analysisId) ?? analyses[0];
  const fits = selected
    ? [...store.tracks]
        .map((track) => ({ track, ...trackFitToAnalysis(track, selected) }))
        .sort((a, b) => b.score - a.score)
    : [];
  const openUrl = sparkPulseUrl(playlist?.spotifyUrl || playlist?.url);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">SPARK PULSE</p>
        <h1 className="mt-1 text-3xl font-semibold">Playlist analyser</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Run a Spotify playlist through Spark Pulse (the Chosic playlist analyser). Then paste the numbers so the
          metadata analyser can catch BPM, energy, danceability, valence and genres — and score the vault against that
          shape before you pitch.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi label="Captured scans" value={analyses.length} />
        <Kpi label="Playlist BPM" value={selected?.bpm ?? "—"} />
        <Kpi label="Energy" value={selected?.energy != null ? `${selected.energy}` : "—"} />
        <Kpi label="Valence" value={selected?.valence != null ? `${selected.valence}` : "—"} />
      </div>

      <Panel title="1. Analyse the playlist">
        <form action="/analyser" className="mb-4">
          <label className="text-sm">
            Open Pulse with a vault playlist
            <select
              name="playlist"
              defaultValue={playlist?.id}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            >
              {store.playlists
                .filter((item) => item.spotifyUrl || /spotify/i.test(item.url))
                .slice(0, 120)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <button className="mt-2 rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">Load in Pulse</button>
        </form>
        <SparkDesk tool={{ ...pulse, cta: "Open Spark Pulse" }} src={openUrl} page="/analyser" />
      </Panel>

      <Panel title="2. Catch the numbers (metadata analyser)">
        <p className="mb-3 text-sm text-zinc-400">
          Copy the overview from Pulse (or JSON). We parse BPM, energy, danceability, valence, acousticness,
          instrumentalness, speechiness, key, loudness and genres. Blank boxes are filled from the paste when we can
          read them.
        </p>
        <form action={capturePlaylistAnalysis} className="grid gap-3 md:grid-cols-3">
          <label className="text-sm md:col-span-3">
            Attach to playlist
            <select name="playlistId" defaultValue={playlist?.id} className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              <option value="">Ad hoc / not in the sheet</option>
              {store.playlists.slice(0, 200).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Playlist name
            <input name="playlistName" defaultValue={playlist?.name} className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm md:col-span-2">
            Spotify URL
            <input
              name="spotifyUrl"
              defaultValue={playlist?.spotifyUrl || playlist?.url}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-3">
            Paste Pulse / Chosic output
            <textarea
              name="raw"
              rows={8}
              placeholder={"Energy: 74%\nDanceability: 68%\nValence: 41%\nAverage tempo: 128 BPM\nTracks: 50\nGenres: edm, house"}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="text-sm">
            BPM
            <input name="bpm" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Energy (0–100)
            <input name="energy" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Danceability
            <input name="danceability" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Valence
            <input name="valence" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Acousticness
            <input name="acousticness" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Instrumentalness
            <input name="instrumentalness" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Speechiness
            <input name="speechiness" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Key
            <input name="key" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Loudness
            <input name="loudness" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm md:col-span-3">
            Genres
            <input name="genres" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Track count
            <input name="tracks" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500 md:col-span-3">
            Catch numbers into metadata
          </button>
        </form>
      </Panel>

      {selected ? (
        <Panel title={`3. Vault fit vs ${selected.playlistName}`}>
          <p className="mb-3 text-sm text-fuchsia-200">
            Caught keywords: {keywordsFromAnalysis(selected).join(" · ") || "—"}
          </p>
          <DataTable
            headers={["Fit", "Track", "Why", "Catch onto track"]}
            rows={fits.slice(0, 12).map((row) => [
              row.score,
              row.track.title,
              row.reasons.join(" · ") || "—",
              <form key={row.track.id} action={applyAnalysisToTrack}>
                <input type="hidden" name="analysisId" value={selected.id} />
                <input type="hidden" name="trackId" value={row.track.id} />
                <button className="text-fuchsia-300 underline">Apply BPM + keywords</button>
              </form>,
            ])}
          />
        </Panel>
      ) : null}

      <Panel title="Saved scans">
        <DataTable
          headers={["When", "Playlist", "BPM", "Energy", "Dance", "Valence", "Genres", "Open"]}
          rows={analyses.map((item) => [
            item.capturedAt.slice(0, 16).replace("T", " "),
            item.playlistName,
            item.bpm ?? "—",
            item.energy ?? "—",
            item.danceability ?? "—",
            item.valence ?? "—",
            item.genres || "—",
            <Link key={item.id} href={`/analyser?analysis=${item.id}`} className="text-fuchsia-300 underline">
              Fit vault
            </Link>,
          ])}
        />
      </Panel>
    </div>
  );
}
