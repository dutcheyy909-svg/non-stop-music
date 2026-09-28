"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { matchAmuseRow, parseAmuseTable } from "./amuse";
import { newPitchId } from "./engine";
import { slugId } from "./ids";
import { dutcheyyRadio } from "./dutcheyy-radio";
import { promoPackages } from "./promo-packages";
import { clearSession, readSession, writeSession } from "./session";
import { updateStore } from "./store";
import { parseThatPitchTable, placementKey, thatPitchToPlacement } from "./that-pitch";
import { emptySyncFields } from "./sync-tags";
import type { PitchChannel, PpcEvent } from "./types";

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
  } else if (rawTarget.startsWith("DJ · ")) {
    channel = "dj";
    targetName = rawTarget.slice(5);
  } else if (rawTarget.startsWith("Supervisor · ")) {
    channel = "licensing";
    targetName = rawTarget.slice(13);
  }

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    if (!track || !targetName) return store;

    if (store.radioStations.some((station) => station.name === targetName)) {
      channel = "radio";
    } else if (store.playlists.some((playlist) => playlist.name === targetName)) {
      channel = "playlist";
    } else if (
      store.supervisors.some(
        (supervisor) =>
          supervisor.name === targetName || targetName.startsWith(`${supervisor.name} —`),
      )
    ) {
      channel = "licensing";
    }

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
  revalidatePath("/promote");
  revalidatePath("/djs");
}

export async function pushToPlaylist(formData: FormData) {
  const trackId = String(formData.get("trackId") || "");
  const playlistId = String(formData.get("playlistId") || "");
  const notes = String(formData.get("notes") || "");

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    const playlist = store.playlists.find((item) => item.id === playlistId);
    if (!track || !playlist) return store;
    const label = [playlist.name, playlist.country, playlist.genre].filter(Boolean).join(" · ");
    return {
      ...store,
      pitches: [
        {
          id: newPitchId(label, store.pitches.length),
          trackId: track.id,
          trackTitle: track.title,
          targetName: label,
          channel: "playlist",
          status: "sent",
          createdAt: new Date().toISOString(),
          followUpAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          notes: [
            notes,
            playlist.url ? `Submit: ${playlist.url}` : "",
            playlist.spotifyUrl ? `Spotify: ${playlist.spotifyUrl}` : "",
            playlist.deepLink ? `Deep link: ${playlist.deepLink}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
        ...store.pitches,
      ],
    };
  });

  revalidatePath("/promote");
  revalidatePath("/playlists");
  revalidatePath("/pipeline");
  revalidatePath("/");
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

export async function importAmuseCodes(formData: FormData) {
  const raw = String(formData.get("amuseTable") || "");
  const rows = parseAmuseTable(raw);
  if (!rows.length) return;

  await updateStore((store) => {
    const tracks = store.tracks.map((track) => {
      const hit = matchAmuseRow(track.title, track.artist, rows);
      if (!hit) {
        return { ...track, upc: track.upc ?? "", preReleaseLink: track.preReleaseLink ?? "" };
      }
      return {
        ...track,
        isrc: hit.isrc || track.isrc,
        upc: hit.upc || track.upc || "",
        preReleaseLink: hit.preReleaseLink || track.preReleaseLink || "",
      };
    });

    const extras = rows
      .filter((row) => !store.tracks.some((track) => matchAmuseRow(track.title, track.artist, [row])))
      .map((row, i) => ({
        id: slugId("trk", row.title, tracks.length + i),
        title: row.title,
        artist: row.artist || "DUTCHEYY",
        isrc: row.isrc,
        upc: row.upc,
        writers: "Duncan",
        tags: ["edm", "electronic"],
        mood: "",
        genre: "EDM",
        duration: "",
        bpm: "",
        rights: "Master + publishing — confirm splits",
        spotifyUri: "",
        preReleaseLink: row.preReleaseLink,
        fileName: "",
        masteringTarget: "",
        masteringLufs: "",
        masteringTruePeak: "",
        masteringNotes: "",
        masteringSources: "",
        ...emptySyncFields(),
      }));

    return { ...store, tracks: [...tracks, ...extras] };
  });

  revalidatePath("/catalog");
  revalidatePath("/metadata");
  revalidatePath("/");
}

export async function importThatPitchPlacements(formData: FormData) {
  const raw = String(formData.get("thatPitchTable") || "");
  const rows = parseThatPitchTable(raw);
  if (!rows.length) return;

  await updateStore((store) => {
    const seen = new Set(store.placements.map((item) => placementKey(item)));
    const extra = rows
      .map((row, i) => thatPitchToPlacement(row, store.placements.length + i))
      .filter((item) => {
        const key = placementKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return { ...store, placements: [...extra, ...store.placements] };
  });

  revalidatePath("/pipeline");
  revalidatePath("/catalog");
  revalidatePath("/data");
  revalidatePath("/");
}

export async function resetFromMaster() {
  const { writeStore } = await import("./store");
  const { seededStore } = await import("./seed");
  const { runMonitor } = await import("./engine");
  await writeStore(runMonitor(seededStore));
  revalidatePath("/");
}

export async function importSafariBookmarks(formData: FormData) {
  const file = formData.get("bookmarks");
  if (!(file instanceof File) || file.size === 0) return;
  const html = await file.text();
  const { parseBookmarkFile } = await import("./safari-playlists");
  const imported = parseBookmarkFile(html);

  await updateStore((store) => {
    const seen = new Set(
      store.playlists.map((item) => item.url.split("?")[0].toLowerCase()),
    );
    const extra = imported.filter((item) => {
      const key = item.url.split("?")[0].toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { ...store, playlists: [...extra, ...store.playlists] };
  });

  revalidatePath("/promote");
  revalidatePath("/playlists");
  revalidatePath("/data");
  revalidatePath("/");
}

export async function scanMasteringAdvice(formData: FormData) {
  const query = String(formData.get("query") || "");
  const { scanMasteringWeb } = await import("./mastering-scan");
  const hits = await scanMasteringWeb(query);
  if (!hits.length) return;

  await updateStore((store) => ({
    ...store,
    masteringAdvice: [...hits, ...(store.masteringAdvice ?? [])].slice(0, 40),
  }));

  revalidatePath("/mastering");
  revalidatePath("/engine");
}

export async function applyMasteringToTrack(formData: FormData) {
  const trackId = String(formData.get("trackId") || "");
  const presetId = String(formData.get("presetId") || "spotify");
  const { chainFromAdvice, masteringPresets } = await import("./mastering");
  const preset = masteringPresets.find((item) => item.id === presetId) ?? masteringPresets[0];

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    if (!track || !preset) return store;
    const notes = chainFromAdvice(preset, store.masteringAdvice ?? []);
    const sources = [
      preset.sourceUrl,
      ...(store.masteringAdvice ?? []).slice(0, 5).map((hit) => hit.url),
    ]
      .filter(Boolean)
      .join("\n");
    return {
      ...store,
      tracks: store.tracks.map((item) =>
        item.id === track.id
          ? {
              ...item,
              masteringTarget: preset.name,
              masteringLufs: preset.lufs,
              masteringTruePeak: preset.truePeak,
              masteringNotes: notes,
              masteringSources: sources,
            }
          : item,
      ),
    };
  });

  revalidatePath("/mastering");
  revalidatePath("/catalog");
  revalidatePath("/engine");
}

export async function logPpcEvent(formData: FormData) {
  const kind: PpcEvent["kind"] = String(formData.get("kind") || "click") === "pageview" ? "pageview" : "click";
  const page = String(formData.get("page") || "/production");
  const href = String(formData.get("href") || "");
  const label = String(formData.get("label") || "");
  if (!href && kind === "click") return;

  await updateStore((store) => ({
    ...store,
    ppcEvents: [
      {
        id: slugId("ppc", `${kind}-${label}`, (store.ppcEvents ?? []).length),
        kind,
        page,
        href,
        label,
        at: new Date().toISOString(),
      },
      ...(store.ppcEvents ?? []),
    ].slice(0, 400),
  }));
}

function radioPaths() {
  revalidatePath("/station");
  revalidatePath("/radio");
  revalidatePath("/");
}

export async function submitToDutcheyyRadio(formData: FormData) {
  const trackId = String(formData.get("trackId") || "");
  const notes = String(formData.get("notes") || "");
  const paidNow = String(formData.get("paidNow") || "") === "on";

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    if (!track) return store;
    const owned = /dutcheyy/i.test(track.artist) || /dutcheyy/i.test(track.rights);
    const status = paidNow ? "paid" : "awaiting-fee";
    const at = new Date().toISOString();
    const submission = {
      id: slugId("rsub", track.title, (store.radioSubmissions ?? []).length),
      trackId: track.id,
      trackTitle: track.title,
      artist: track.artist,
      isrc: track.isrc,
      owned,
      status: status as "awaiting-fee" | "paid" | "rotation" | "rejected",
      submissionFeeGbp: dutcheyyRadio.submissionFeeGbp,
      notes,
      createdAt: at,
    };
    const ledger = paidNow
      ? [
          {
            id: slugId("rled", track.title, (store.radioLedger ?? []).length),
            kind: "submission" as const,
            direction: "in" as const,
            amountGbp: dutcheyyRadio.submissionFeeGbp,
            detail: `Submission fee — ${track.title}`,
            at,
          },
          ...(store.radioLedger ?? []),
        ]
      : store.radioLedger ?? [];
    return {
      ...store,
      radioSubmissions: [submission, ...(store.radioSubmissions ?? [])],
      radioLedger: ledger,
    };
  });
  radioPaths();
}

export async function takeRadioSubmissionFee(formData: FormData) {
  const id = String(formData.get("submissionId") || "");
  await updateStore((store) => {
    const row = (store.radioSubmissions ?? []).find((item) => item.id === id);
    if (!row || row.status !== "awaiting-fee") return store;
    const at = new Date().toISOString();
    return {
      ...store,
      radioSubmissions: (store.radioSubmissions ?? []).map((item) =>
        item.id === id ? { ...item, status: "paid" as const } : item,
      ),
      radioLedger: [
        {
          id: slugId("rled", row.trackTitle, (store.radioLedger ?? []).length),
          kind: "submission" as const,
          direction: "in" as const,
          amountGbp: row.submissionFeeGbp,
          detail: `Submission fee received — ${row.trackTitle}`,
          at,
        },
        ...(store.radioLedger ?? []),
      ],
    };
  });
  radioPaths();
}

export async function addRadioRotation(formData: FormData) {
  const id = String(formData.get("submissionId") || "");
  await updateStore((store) => ({
    ...store,
    radioSubmissions: (store.radioSubmissions ?? []).map((item) =>
      item.id === id && (item.status === "paid" || item.status === "rotation")
        ? { ...item, status: "rotation" as const }
        : item,
    ),
  }));
  radioPaths();
}

export async function logDutcheyyRadioSpin(formData: FormData) {
  const id = String(formData.get("submissionId") || "");
  await updateStore((store) => {
    const row = (store.radioSubmissions ?? []).find((item) => item.id === id && item.status === "rotation");
    if (!row) return store;
    const at = new Date().toISOString();
    const mechanical = dutcheyyRadio.mechanicalPerSpinGbp;
    const reserve = dutcheyyRadio.performanceReserveGbp;
    const spin = {
      id: slugId("spin", row.trackTitle, (store.radioSpins ?? []).length),
      trackTitle: row.trackTitle,
      artist: row.artist,
      owned: row.owned,
      mechanicalGbp: mechanical,
      performanceReserveGbp: reserve,
      at,
    };
    const ledger = [
      {
        id: slugId("rled", `m-${row.trackTitle}`, (store.radioLedger ?? []).length),
        kind: "mechanical" as const,
        direction: "in" as const,
        amountGbp: mechanical,
        detail: row.owned
          ? `Mechanical (publisher share) — ${row.trackTitle}`
          : `Mechanical clearance billed — ${row.trackTitle}`,
        at,
      },
      {
        id: slugId("rled", `p-${row.trackTitle}`, (store.radioLedger ?? []).length + 1),
        kind: "performance-reserve" as const,
        direction: "out" as const,
        amountGbp: reserve,
        detail: `PRS/PPL reserve on spin — ${row.trackTitle}`,
        at,
      },
      ...(store.radioLedger ?? []),
    ];
    return {
      ...store,
      radioSpins: [spin, ...(store.radioSpins ?? [])],
      radioLedger: ledger,
    };
  });
  radioPaths();
}

export async function saveFanLead(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const country = String(formData.get("country") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const role = String(formData.get("role") || "other").trim();
  const age = Number(formData.get("age"));
  const consent = String(formData.get("consent") || "") === "on";

  if (!consent) return { ok: false, error: "Consent is required." };
  if (!name || !email || !country) return { ok: false, error: "Name, email and country are required." };
  if (!Number.isFinite(age) || age < 18) return { ok: false, error: "You must be 18 or over." };
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };

  await updateStore((store) => {
    const existing = (store.fanLeads ?? []).some((lead) => lead.email === email);
    if (existing) return store;
    return {
      ...store,
      fanLeads: [
        {
          id: slugId("lead", email, (store.fanLeads ?? []).length),
          name,
          email,
          age,
          country,
          city,
          role,
          createdAt: new Date().toISOString(),
        },
        ...(store.fanLeads ?? []),
      ],
    };
  });
  revalidatePath("/crm");
  revalidatePath("/data");
  return { ok: true };
}

export async function loginUser(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!name || !email.includes("@")) return;
  await writeSession(name, email);
  redirect("/deals");
}

export async function logoutUser() {
  await clearSession();
  redirect("/");
}

export async function buyPromoPackage(formData: FormData) {
  const session = await readSession();
  if (!session) redirect("/login");
  const packageId = String(formData.get("packageId") || "");
  const pack = promoPackages.find((item) => item.id === packageId);
  if (!pack) return;

  await updateStore((store) => ({
    ...store,
    promoOrders: [
      {
        id: slugId("ord", pack.id, (store.promoOrders ?? []).length),
        packageId: pack.id,
        packageName: pack.name,
        tab: pack.tab,
        email: session.email,
        amountGbp: pack.priceGbp,
        createdAt: new Date().toISOString(),
      },
      ...(store.promoOrders ?? []),
    ],
  }));
  revalidatePath("/deals");
}

export async function importBrowseAiOpportunities(formData: FormData) {
  const { extractBrowseAiRobotId, pullBrowseAiOpportunities, mergeOpportunities } = await import("./browse-ai");
  const { readStore } = await import("./store");
  const robotId = extractBrowseAiRobotId(String(formData.get("robotId") || ""));
  const originUrl = String(formData.get("originUrl") || "").trim();
  const apiKey = String(formData.get("apiKey") || "").trim();
  const current = await readStore();
  const incoming = await pullBrowseAiOpportunities(
    current.tracks.flatMap((track) => track.tags),
    robotId || current.browseAiRobotId,
    apiKey,
  );
  if (!incoming.length) return;
  await updateStore((store) => ({
    ...store,
    browseAiRobotId: robotId || store.browseAiRobotId || "",
    browseAiOriginUrl: originUrl || store.browseAiOriginUrl || "",
    opportunities: mergeOpportunities(store.opportunities, incoming),
  }));
  revalidatePath("/opportunities");
  revalidatePath("/");
}

export async function runBrowseAiSyncJob(formData: FormData) {
  const { extractBrowseAiRobotId, runBrowseAiRobot } = await import("./browse-ai");
  const robotId = extractBrowseAiRobotId(String(formData.get("robotId") || ""));
  const originUrl = String(formData.get("originUrl") || "").trim();
  const apiKey = String(formData.get("apiKey") || "").trim();
  await updateStore((store) => ({
    ...store,
    browseAiRobotId: robotId || store.browseAiRobotId || "",
    browseAiOriginUrl: originUrl || store.browseAiOriginUrl || "",
  }));
  const { readStore } = await import("./store");
  const store = await readStore();
  await runBrowseAiRobot(store.browseAiRobotId, store.browseAiOriginUrl, apiKey);
  revalidatePath("/opportunities");
}

export async function importBrowseAiJson(formData: FormData) {
  const raw = String(formData.get("browseAiJson") || "");
  if (!raw.trim()) return;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return;
  }
  const { opportunitiesFromCaptured, mergeOpportunities } = await import("./browse-ai");
  await updateStore((store) => {
    const incoming = opportunitiesFromCaptured(
      parsed,
      store.tracks.flatMap((track) => track.tags),
    );
    if (!incoming.length) return store;
    return { ...store, opportunities: mergeOpportunities(store.opportunities, incoming) };
  });
  revalidatePath("/opportunities");
  revalidatePath("/");
}

export async function submitVendorProduct(formData: FormData) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const vendorName = String(formData.get("vendorName") || "").trim();
  const vendorEmail = String(formData.get("vendorEmail") || "").trim();
  const productName = String(formData.get("productName") || "").trim();
  const category = String(formData.get("otherCategory") || formData.get("category") || "Other").trim() || "Other";
  const cost = String(formData.get("cost") || "").trim();
  const productUrl = String(formData.get("productUrl") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!vendorName || !vendorEmail || !productName) return;

  const id = slugId("vnd", productName, Date.now());
  let fileName = "";
  let filePath = "";
  const upload = formData.get("file");
  if (upload instanceof File && upload.size > 0) {
    const safe = upload.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "product.bin";
    fileName = upload.name;
    filePath = `/uploads/vendors/${id}-${safe}`;
    const abs = path.join(process.cwd(), "uploads", "vendors", `${id}-${safe}`);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, Buffer.from(await upload.arrayBuffer()));
  }

  await updateStore((store) => ({
    ...store,
    vendorProducts: [
      {
        id,
        vendorName,
        vendorEmail,
        productName,
        category,
        cost,
        productUrl,
        description,
        fileName,
        filePath,
        status: "pending" as const,
        submittedAt: new Date().toISOString(),
        reviewedAt: "",
        reviewNote: "",
      },
      ...(store.vendorProducts ?? []),
    ],
  }));
  revalidatePath("/vendors");
  revalidatePath("/vendors/review");
  revalidatePath("/production");
  revalidatePath("/");
  redirect("/vendors?queued=1");
}

export async function reviewVendorProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const decision = String(formData.get("decision") || "");
  const reviewNote = String(formData.get("reviewNote") || "").trim();
  const status = decision === "approved" || decision === "rejected" ? decision : "";
  if (!id || !status) return;

  await updateStore((store) => ({
    ...store,
    vendorProducts: (store.vendorProducts ?? []).map((item) =>
      item.id === id
        ? { ...item, status, reviewNote, reviewedAt: new Date().toISOString() }
        : item,
    ),
  }));
  revalidatePath("/vendors");
  revalidatePath("/vendors/review");
  revalidatePath("/production");
  revalidatePath("/");
}

export async function generateSyncAssistant(formData: FormData) {
  const { applySyncResult, generateSyncMetadata, inputFromTrack } = await import("./sync-tags");
  const trackId = String(formData.get("trackId") || "");
  const notes = String(formData.get("notes") || "");
  const vocal = String(formData.get("vocal") || "");
  const bpm = String(formData.get("bpm") || "");
  const usage = String(formData.get("usage") || "");

  await updateStore((store) => {
    const track = store.tracks.find((item) => item.id === trackId);
    if (!track) return store;
    const result = generateSyncMetadata({
      ...inputFromTrack(track, notes),
      vocal: vocal || inputFromTrack(track).vocal,
      bpm: bpm || track.bpm,
      usage,
      notes,
      title: String(formData.get("title") || track.title),
      artist: String(formData.get("artist") || track.artist),
      genre: String(formData.get("genre") || track.genre),
      mood: String(formData.get("mood") || track.mood),
      fileName: String(formData.get("fileName") || track.fileName),
    });
    return {
      ...store,
      tracks: store.tracks.map((item) => (item.id === track.id ? applySyncResult(item, result) : item)),
    };
  });
  revalidatePath("/sync-assistant");
  revalidatePath("/metadata");
  revalidatePath("/catalog");
  revalidatePath("/opportunities");
  redirect(`/sync-assistant?track=${encodeURIComponent(trackId)}`);
}

export async function generateSyncForVault() {
  const { applySyncResult, generateSyncMetadata, inputFromTrack } = await import("./sync-tags");
  await updateStore((store) => ({
    ...store,
    tracks: store.tracks.map((track) => applySyncResult(track, generateSyncMetadata(inputFromTrack(track)))),
  }));
  revalidatePath("/sync-assistant");
  revalidatePath("/metadata");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function capturePlaylistAnalysis(formData: FormData) {
  const { analysisFromForm } = await import("./playlist-analysis");
  const playlistId = String(formData.get("playlistId") || "");
  const analysis = analysisFromForm({
    raw: String(formData.get("raw") || ""),
    playlistId,
    playlistName: String(formData.get("playlistName") || ""),
    spotifyUrl: String(formData.get("spotifyUrl") || ""),
    tracks: String(formData.get("tracks") || ""),
    bpm: String(formData.get("bpm") || ""),
    energy: String(formData.get("energy") || ""),
    danceability: String(formData.get("danceability") || ""),
    valence: String(formData.get("valence") || ""),
    acousticness: String(formData.get("acousticness") || ""),
    instrumentalness: String(formData.get("instrumentalness") || ""),
    speechiness: String(formData.get("speechiness") || ""),
    loudness: String(formData.get("loudness") || ""),
    key: String(formData.get("key") || ""),
    genres: String(formData.get("genres") || ""),
  });
  const hasNumbers =
    analysis.bpm != null ||
    analysis.energy != null ||
    analysis.danceability != null ||
    analysis.valence != null ||
    Boolean(analysis.raw.trim());
  if (!hasNumbers) return;

  await updateStore((store) => {
    const playlist = store.playlists.find((item) => item.id === playlistId);
    return {
      ...store,
      playlistAnalyses: [
        {
          ...analysis,
          playlistName: analysis.playlistName || playlist?.name || analysis.playlistName,
          spotifyUrl: analysis.spotifyUrl || playlist?.spotifyUrl || playlist?.url || "",
        },
        ...(store.playlistAnalyses ?? []),
      ].slice(0, 80),
    };
  });
  revalidatePath("/analyser");
  revalidatePath("/spark");
  revalidatePath("/metadata");
  revalidatePath("/playlists");
}

export async function applyAnalysisToTrack(formData: FormData) {
  const analysisId = String(formData.get("analysisId") || "");
  const trackId = String(formData.get("trackId") || "");
  const { keywordsFromAnalysis } = await import("./playlist-analysis");
  await updateStore((store) => {
    const analysis = (store.playlistAnalyses ?? []).find((item) => item.id === analysisId);
    const track = store.tracks.find((item) => item.id === trackId);
    if (!analysis || !track) return store;
    const keywords = keywordsFromAnalysis(analysis);
    const bpm = analysis.bpm && !track.bpm ? String(Math.round(analysis.bpm)) : track.bpm;
    return {
      ...store,
      tracks: store.tracks.map((item) =>
        item.id === track.id
          ? {
              ...item,
              bpm,
              tags: [...new Set([...item.tags, ...keywords])],
              syncKeywords: [...new Set([...(item.syncKeywords ? item.syncKeywords.split(/,\s*/) : []), ...keywords])]
                .filter(Boolean)
                .join(", "),
            }
          : item,
      ),
    };
  });
  revalidatePath("/analyser");
  revalidatePath("/sync-assistant");
  revalidatePath("/metadata");
  revalidatePath("/catalog");
}
