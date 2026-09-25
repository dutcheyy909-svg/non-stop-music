export type ContactRole =
  | "artist"
  | "producer"
  | "writer"
  | "supervisor"
  | "library"
  | "brand"
  | "radio"
  | "other";

export type PitchChannel = "radio" | "licensing" | "playlist" | "collab" | "other";

export type PitchStatus =
  | "draft"
  | "sent"
  | "opened"
  | "shortlisted"
  | "added"
  | "rotation"
  | "passed"
  | "licensed";

export type Track = {
  id: string;
  title: string;
  artist: string;
  isrc: string;
  writers: string;
  tags: string[];
  mood: string;
  genre: string;
  duration: string;
  rights: string;
  spotifyUri: string;
  fileName: string;
};

export type RadioStation = {
  id: string;
  name: string;
  country: string;
  stationType: string;
  verification: string;
  genreFit: string;
  website: string;
  submissionPage: string;
  contact: string;
  submissionFormat: string;
  accepting: string;
  priority: string;
  status: string;
  notes: string;
  source: string;
};

export type Supervisor = {
  id: string;
  name: string;
  organisation: string;
  region: string;
  role: string;
  credits: string;
  unsolicited: string;
  contact: string;
  sourceUrl: string;
  status: string;
  priority: string;
  notes: string;
};

export type Opportunity = {
  id: string;
  priority: string;
  title: string;
  source: string;
  mediaType: string;
  genre: string;
  mood: string;
  vocal: string;
  usage: string;
  deadline: string;
  budget: string;
  territory: string;
  rights: string;
  fitScore: number;
  forecastGbp: number;
  status: string;
};

export type PlaylistTarget = {
  id: string;
  name: string;
  platform: string;
  curator: string;
  genre: string;
  followers: string;
  url: string;
  status: string;
  notes: string;
  sourcePlacement: string;
};

export type Placement = {
  id: string;
  trackTitle: string;
  artist: string;
  type: string;
  production: string;
  playlist: string;
  library: string;
  date: string;
  notes: string;
};

export type Pitch = {
  id: string;
  trackId: string;
  trackTitle: string;
  targetName: string;
  channel: PitchChannel;
  status: PitchStatus;
  createdAt: string;
  followUpAt: string;
  notes: string;
};

export type Prospect = {
  id: string;
  name: string;
  role: ContactRole;
  rightsReady: boolean;
  commercialScore: number;
  creativeScore: number;
  syncScore: number;
  revenueProjection: number;
  notes: string;
};

export type MonitorAction = {
  id: string;
  type: string;
  title: string;
  reason: string;
  href: string;
  status: "open" | "done" | "dismissed";
};

export type Store = {
  tracks: Track[];
  radioStations: RadioStation[];
  supervisors: Supervisor[];
  opportunities: Opportunity[];
  playlists: PlaylistTarget[];
  placements: Placement[];
  pitches: Pitch[];
  prospects: Prospect[];
  monitorActions: MonitorAction[];
  epk: {
    name: string;
    shortBio: string;
    longBio: string;
    location: string;
    genres: string;
    website: string;
    spotify: string;
    instagram: string;
  };
};
