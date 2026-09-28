"use client";

import { createPitch } from "@/lib/actions";
import type { PitchChannel, Track } from "@/lib/types";

const fieldClass = "mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2";

export function PitchForm({
  tracks,
  targets,
  channel,
  defaultNotes,
}: {
  tracks: Track[];
  targets: string[];
  channel: PitchChannel;
  defaultNotes?: string;
}) {
  const notes = defaultNotes ?? "";

  return (
    <form
      action={createPitch}
      autoComplete="off"
      className="grid gap-3 rounded-xl border border-fuchsia-400/20 bg-black/30 p-4 md:grid-cols-2"
    >
      <input type="hidden" name="channel" value={channel} />
      <label className="text-sm">
        Track
        <select name="trackId" className={fieldClass} suppressHydrationWarning>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Send to
        <select name="targetName" className={fieldClass} suppressHydrationWarning>
          {targets.map((name, index) => (
            <option key={`${index}-${name}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        Notes / EPK message
        <textarea name="notes" rows={4} className={fieldClass} defaultValue={notes} suppressHydrationWarning />
      </label>
      <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium text-white hover:bg-fuchsia-500 md:col-span-2">
        Send pitch (logs EPK + track)
      </button>
    </form>
  );
}
