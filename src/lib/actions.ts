"use server";

import { revalidatePath } from "next/cache";
import { newPitchId } from "./engine";
import { updateStore } from "./store";
import type { PitchChannel } from "./types";

export async function createPitch(formData: FormData) {
  const trackId = String(formData.get("trackId") || "");
  const rawTarget = String(formData.get("targetName") || "");
  const notes = String(formData.get("notes") || "");
  let channel = String(formData.get("channel") || "other") as PitchChannel;
  let targetName = rawTarget;
  if (rawTarget.startsWith("Radio · ")) {
    channel = "radio";
    targetName = rawTarget.slice(8);
  } else if (rawTarget.startsWith("Playlist · ")) {
    channel = "playlist";
    targetName = rawTarget.slice(11);
  } else if (rawTarget.startsWith("Supervisor · ")) {
    channel = "licensing";
    targetName = rawTarget.slice(13);
  }

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    if (!track || !targetName) return store;
    return {
      ...store,
      pitches: [
        {
          id: newPitchId(targetName, store.pitches.length),
          trackId: track.id,
          trackTitle: track.title,
          targetName,
          channel,
          status: "sent",
          createdAt: new Date().toISOString(),
          followUpAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          notes,
        },
        ...store.pitches,
      ],
    };
  });

  revalidatePath("/");
  revalidatePath("/pipeline");
  revalidatePath("/radio");
  revalidatePath("/playlists");
  revalidatePath("/outreach");
}

export async function saveEpk(formData: FormData) {
  await updateStore((store) => ({
    ...store,
    epk: {
      name: String(formData.get("name") || store.epk.name),
      shortBio: String(formData.get("shortBio") || store.epk.shortBio),
      longBio: String(formData.get("longBio") || store.epk.longBio),
      location: String(formData.get("location") || store.epk.location),
      genres: String(formData.get("genres") || store.epk.genres),
      website: String(formData.get("website") || store.epk.website),
      spotify: String(formData.get("spotify") || store.epk.spotify),
      instagram: String(formData.get("instagram") || store.epk.instagram),
    },
  }));
  revalidatePath("/epk");
}

export async function resetFromMaster() {
  const { writeStore } = await import("./store");
  const { seededStore } = await import("./seed");
  const { runMonitor } = await import("./engine");
  await writeStore(runMonitor(seededStore));
  revalidatePath("/");
}
