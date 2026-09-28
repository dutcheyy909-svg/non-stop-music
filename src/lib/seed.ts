import type { Store } from "./types";
import { STORE_SCHEMA_VERSION } from "./types";
import { excelSerialToIso, firstUrl, parseBudget, slugId, splitContact, text } from "./ids";
import raw from "../../data/master-import.json";
import { fundingForLibrary, fundingRounds } from "./funding";
import { extraScottishStations } from "./scottish-radio";
import { publicWebUrl } from "./blog-urls";
import { knownSpotifyPlaylist, playlistDeepLink } from "./spotify";
import { emptySyncFields } from "./sync-tags";
import { emptyTools4MusicFields } from "./tools4music";

type Row = Record<string, string>;
type Master = {
  radioStations: Row[];
  supervisors: Row[];
  opportunities: Row[];
  placements: Row[];
  playlistsEdm?: Row[];
  playlistsTrap?: Row[];
  playlistsSpotify?: Row[];
  blogs?: Row[];
  mediaContacts?: Row[];
  musicLibraries?: Row[];
  syncLibraries?: Row[];
};

function tokenize(value: unknown) {
  return text(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 2);
}

function fitScore(opportunity: { genre: string; mood: string }, catalogTags: string[]) {
  const hay = new Set(catalogTags.map((t) => text(t).toLowerCase()));
  const needles = [...tokenize(opportunity.genre), ...tokenize(opportunity.mood)];
  if (!needles.length) return 42;
  const hits = needles.filter((n) => hay.has(n) || [...hay].some((h) => h.includes(n)));
  return Math.min(98, Math.round(35 + (hits.length / needles.length) * 65));
}

export function buildStoreFromMaster(master: Master): Store {
  const radioStations = master.radioStations
    .map((row, i) => {
      const name = text(row["Station / Platform"]);
      if (!name) return null;
      const contact = text(row["Public Contact"]);
      const parts = splitContact(`${contact} ${text(row.Notes)}`);
      return {
        id: slugId("radio", name, i),
        name,
        country: text(row.Country),
        stationType: text(row["Station Type"]),
        verification: text(row["Verification Level"]),
        genreFit: text(row["Genre / Show Fit"]),
        website: text(row["Official Website"]),
        submissionPage: text(row["Submission Page"]),
        contact,
        email: parts.email,
        phone: parts.phone,
        submissionFormat: text(row["Submission Format"]),
        accepting: text(row["Accepting Now?"]),
        priority: text(row.Priority),
        status: text(row.Status) || "research",
        notes: text(row.Notes),
        source: text(row["Research Source"]),
      };
    })
    .filter((row) => row !== null);

  const radioNames = new Set(radioStations.map((s) => s.name.toLowerCase()));
  for (const extra of extraScottishStations()) {
    if (!radioNames.has(extra.name.toLowerCase())) {
      radioStations.push(extra);
      radioNames.add(extra.name.toLowerCase());
    }
  }

  const supervisors = master.supervisors
    .map((row, i) => {
      const name = text(row.Supervisor);
      if (!name) return null;
      return {
        id: slugId("sup", name, i),
        name,
        organisation: text(row["Organisation / Source"]),
        region: text(row.Region),
        role: text(row["Verified Role / Context"]),
        credits: text(row["Selected Credits / Notes"]),
        unsolicited: text(row["Unsolicited Submissions Verified?"]),
        contact: text(row["Public Business Contact / Route"]),
        sourceUrl: text(row["Source URL"]),
        status: text(row["DUTCHHEYY Status"]),
        priority: text(row.Priority),
        notes: text(row["Response / Notes"]),
      };
    })
    .filter((row) => row !== null);

  const placements = master.placements.map((row, i) => ({
    id: slugId("plc", row["Placement ID"] || row["Track Title"], i),
    trackTitle: row["Track Title"],
    artist: row.Artist,
    type: row["Placement Type"],
    production: row["Production / Playlist / Station"],
    playlist: row["Episode / Campaign / Playlist"],
    library: row["Library / Agency"],
    clientBrand: row["Client / Brand / Curator"],
    supervisorContact: row["Music Supervisor / Contact"],
    usage: row.Usage,
    date: excelSerialToIso(row["Placement Date"]),
    airPublishDate: excelSerialToIso(row["Air / Publish Date"]),
    endDate: excelSerialToIso(row["End Date"]),
    masterFee: row["Master Fee"],
    publishingFee: row["Publishing Fee"],
    cueFee: row["Other Income"],
    incomePerPlacement: row["Income per Placement"],
    isrc: row.ISRC,
    invoiceNo: row["Invoice No."],
    paymentReceived: row["Payment Received"],
    notes: row.Notes,
    source: "master",
    sourceUrl: "",
  }));

  const trackMap = new Map<string, { title: string; artist: string; isrc: string }>();
  for (const p of placements) {
    const key = `${p.trackTitle}|${p.artist}`.toLowerCase();
    if (p.trackTitle) {
      trackMap.set(key, { title: p.trackTitle, artist: p.artist || "DUTCHEYY", isrc: p.isrc });
    }
  }

  const defaultTags = ["edm", "electronic", "house", "dark", "driving", "vocal"];
  const tracks = [...trackMap.values()].map((t, i) => ({
    id: slugId("trk", t.title, i),
    title: t.title,
    artist: t.artist,
    isrc: t.isrc,
    upc: "",
    writers: "Duncan",
    tags: defaultTags,
    mood: "dark / driving",
    genre: "EDM",
    duration: "",
    bpm: "",
    rights: "Master + publishing — confirm splits",
    spotifyUri: "",
    preReleaseLink: "",
    fileName: "",
    masteringTarget: "",
    masteringLufs: "",
    masteringTruePeak: "",
    masteringNotes: "",
    masteringSources: "",
    ...emptyTools4MusicFields(),
    ...emptySyncFields(),
  }));

  const catalogTags = tracks.flatMap((t) => t.tags);

  const opportunities = master.opportunities.map((row, i) => {
    const budget = parseBudget(row["Budget / Fee"]);
    const genre = row["Genre / Style"];
    const mood = row["Mood / Energy"];
    return {
      id: slugId("opp", row["Brief / Project"], i),
      priority: row.Priority,
      title: row["Brief / Project"],
      source: row["Source / Platform"],
      sourceOfTruthUrl: firstUrl(row["Submission Link"], row["Source URL"]),
      mediaType: row["Media Type"],
      genre,
      mood,
      vocal: row["Vocal / Instrumental"],
      usage: row["Usage / Scene"],
      deadline: row.Deadline,
      budget: row["Budget / Fee"],
      territory: row.Territory,
      rights: row["Rights Required"],
      fitScore: fitScore({ genre, mood }, catalogTags),
      forecastGbp: budget,
      status: row.Status || "open",
    };
  });

  const playlists = [
    ...(master.playlistsSpotify ?? []).map((row, i) => {
      const name = row["Curator / Brand"] || row["Focus"] || `Playlist ${i + 1}`;
      const url = firstUrl(row.URL, row["Spotify Playlist URL"], knownSpotifyPlaylist(name));
      const links = playlistDeepLink(url || knownSpotifyPlaylist(name));
      return {
        id: slugId("pl", `${name}-${row.Focus}-${row["No."]}`, i),
        name,
        platform: row.Role || "Spotify",
        curator: row["Curator / Brand"],
        genre: row.Genre || row.Focus,
        followers: "",
        url: links.spotifyUrl || url,
        spotifyUrl: links.spotifyUrl,
        deepLink: links.deepLink,
        email: "",
        country: row.Country,
        status: row["Campaign Status"] || "target",
        notes: row.Notes,
        sourcePlacement: row["Related pack / track"],
      };
    }),
    ...(master.playlistsEdm ?? []).map((row, i) => {
      const url = firstUrl(row["Spotify Playlist URL"], row["Submission Link"], row["Source URL"]);
      const links = playlistDeepLink(url);
      return {
        id: slugId("pl-edm", row["Curator Name"], i),
        name: row["Curator Name"],
        platform: row["Submission Platform"] || "Spotify",
        curator: row["Curator Name"],
        genre: row.Genre,
        followers: row["Follower Count"],
        url: links.spotifyUrl || url,
        spotifyUrl: links.spotifyUrl,
        deepLink: links.deepLink,
        email: splitContact(row["Public Email"] || "").email,
        country: row.Country || "",
        status: row["Campaign Status"] || "target",
        notes: row.Notes,
        sourcePlacement: "",
      };
    }),
    ...(master.playlistsTrap ?? []).map((row, i) => {
      const url = firstUrl(
        knownSpotifyPlaylist(row["Playlist / Target"]),
        row["Submission / Research Link"],
        row["Target Source URL"],
      );
      const links = playlistDeepLink(url);
      return {
        id: slugId("pl-trap", row["Playlist / Target"], i),
        name: row["Playlist / Target"],
        platform: row.Platform || "Spotify",
        curator: row["Curator / Brand"],
        genre: row["Genre Focus"],
        followers: "",
        url: links.spotifyUrl || url,
        spotifyUrl: links.spotifyUrl,
        deepLink: links.deepLink,
        email: "",
        country: row["Country / Region"] || "",
        status: row["Campaign Status"] || "target",
        notes: row.Notes,
        sourcePlacement: "",
      };
    }),
  ];

  const blogs = (master.blogs ?? []).map((row, i) => ({
    id: slugId("blog", row.BLOG, i),
    name: row.BLOG,
    email: row["CONTACT EMAIL"],
    website: publicWebUrl(row.WEBSITE),
    location: row.LOCATION,
    genre: row.GENRE,
  }));

  const libraries = [
    ...(master.musicLibraries ?? []).map((row, i) => {
      const name = text(row["Platform / Company"]);
      const notes = text(row["Primary Function"]);
      const genre = text(row["Genre Focus"]);
      const fund = fundingForLibrary(name, notes, genre);
      return {
        id: slugId("lib", name, i),
        name,
        category: text(row.Category) || "Music library",
        url: firstUrl(row["Website or Submission URL"], row["Source URL"]),
        genre,
        notes,
        funding: `${fund.funder} — ${fund.programme} (${fund.amount})`,
        fundingDeadline: fund.deadline,
        fundingUrl: fund.url,
        fundingStatus: fund.status,
      };
    }),
    ...(master.syncLibraries ?? [])
      .map((row, i) => {
        const name = text(row["Company / Library"] || row["Platform / Company"]);
        if (!name || name.length > 80) return null;
        const notes = text(row["Upfront submission cost"] || row["Primary Function"]);
        const genre = text(row["Best fit / focus"] || row["Genre Focus"]);
        const fund = fundingForLibrary(name, notes, genre);
        return {
          id: slugId("synclib", name, i),
          name,
          category: text(row.Type) || "Sync library",
          url: firstUrl(row["Submission route"], row["Website or Submission URL"], row["Source URL"]),
          genre,
          notes,
          funding: `${fund.funder} — ${fund.programme} (${fund.amount})`,
          fundingDeadline: fund.deadline,
          fundingUrl: fund.url,
          fundingStatus: fund.status,
        };
      })
      .filter((row) => row !== null),
  ];

  const prospects = supervisors.slice(0, 12).map((s, i) => ({
    id: slugId("anr", s.name, i),
    name: s.name,
    role: "supervisor" as const,
    rightsReady: /email|@/.test(s.contact),
    commercialScore: s.priority === "High" ? 82 : 64,
    creativeScore: 70 + (i % 20),
    syncScore: 68 + (i % 25),
    revenueProjection: 1500 + i * 250,
    notes: s.credits,
  }));

  return {
    schemaVersion: STORE_SCHEMA_VERSION,
    tracks,
    radioStations,
    supervisors,
    opportunities,
    playlists,
    placements,
    pitches: [],
    prospects,
    blogs,
    libraries,
    fundingRounds,
    masteringAdvice: [],
    ppcEvents: [],
    radioSubmissions: [],
    radioSpins: [],
    radioLedger: [],
    fanLeads: [],
    promoOrders: [],
    vendorProducts: [],
    playlistAnalyses: [],
    calendarReminders: [],
    browseAiRobotId: "",
    browseAiOriginUrl: "",
    monitorActions: [],
    epk: {
      name: "DUTCHEYY RECORDS",
      shortBio: "Independent. Global. Future focused. Real music, real people, real progress.",
      longBio:
        "Dutcheyy Records is a music, publishing, sync and artist-development house. More than music — create, release, publish, sync, grow, repeat.",
      location: "United Kingdom",
      genres: "EDM, electronic, house, hip-hop",
      website: "",
      spotify: "",
      instagram: "",
    },
  };
}

export const seededStore = buildStoreFromMaster(raw as Master);
