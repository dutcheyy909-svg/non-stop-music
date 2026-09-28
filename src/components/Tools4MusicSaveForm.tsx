import { saveTools4MusicToTrack } from "@/lib/actions";
import type { Track } from "@/lib/types";

const inputClass = "mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2";

export function Tools4MusicSaveForm({
  tracks,
  selected,
  loadPath,
}: {
  tracks: Track[];
  selected?: Track;
  loadPath: "/tools4music" | "/production";
}) {
  const track = selected ?? tracks[0];

  return (
    <div className="space-y-4">
      <form action={loadPath} className="grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="text-sm">
          Vault track
          <select name="track" defaultValue={track?.id} className={inputClass}>
            {tracks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} — {item.artist}
                {item.royaltyStreamsTarget || item.bpm ? " · saved" : ""}
              </option>
            ))}
          </select>
        </label>
        <button className="self-end rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">Load cut</button>
      </form>

      {track ? (
        <form action={saveTools4MusicToTrack} className="grid gap-3 md:grid-cols-3">
          <input type="hidden" name="trackId" value={track.id} />
          <input type="hidden" name="next" value={loadPath} />
          <p className="text-sm text-zinc-400 md:col-span-3">
            Open a calculator, then paste the result onto <span className="text-fuchsia-200">{track.title}</span>.
            Blank boxes keep whatever is already on the vault.
          </p>
          <label className="text-sm">
            Streams to goal
            <input
              name="royaltyStreamsTarget"
              defaultValue={track.royaltyStreamsTarget}
              placeholder="e.g. 1,000,000"
              className={inputClass}
            />
          </label>
          <label className="text-sm">
            Split %
            <input
              name="royaltySplitPercent"
              defaultValue={track.royaltySplitPercent}
              placeholder="e.g. 50 writer / 50 publisher"
              className={inputClass}
            />
          </label>
          <label className="text-sm">
            Sync fee band
            <input
              name="royaltySyncFeeBand"
              defaultValue={track.royaltySyncFeeBand}
              list="sync-fee-bands"
              placeholder="e.g. £1k–5k TV drama"
              className={inputClass}
            />
            <datalist id="sync-fee-bands">
              <option value="£250–500 micro / social" />
              <option value="£500–1k web / promo" />
              <option value="£1–5k TV drama" />
              <option value="£5–15k film / game trailer" />
              <option value="£15k+ brand / national ad" />
            </datalist>
          </label>
          <label className="text-sm">
            BPM
            <input name="bpm" defaultValue={track.bpm} placeholder="from BPM tap" className={inputClass} />
          </label>
          <label className="text-sm">
            Delay (ms)
            <input
              name="delayMs"
              defaultValue={track.delayMs}
              placeholder="from delay-time tool"
              className={inputClass}
            />
          </label>
          <label className="text-sm md:col-span-3">
            Production notes
            <textarea
              name="productionNotes"
              rows={3}
              defaultValue={track.productionNotes}
              placeholder="BPM and delay write in here if you leave this blank."
              className={inputClass}
            />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500 md:col-span-3">
            Save onto this track
          </button>
        </form>
      ) : (
        <p className="text-sm text-zinc-500">Add a cut in Catalogue Vault first.</p>
      )}
    </div>
  );
}
