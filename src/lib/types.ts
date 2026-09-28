export type ContactRole =
  | "artist"
  | "producer"
  | "writer"
  | "supervisor"
  | "library"
  | "brand"
  | "radio"
  | "other";

export type PitchChannel = "radio" | "licensing" | "playlist" | "collab" | "dj" | "other";

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
  upc: string;
  writers: string;
  tags: string[];
  mood: string;
  genre: string;
  duration: string;
  bpm: string;
  rights: string;
  spotifyUri: string;
  preReleaseLink: string;
  fileName: string;
  masteringTarget: string;
  masteringLufs: string;
  masteringTruePeak: string;
  masteringNotes: string;
  masteringSources: string;
  syncDescription: string;
  syncKeywords: string;
  syncSuggestedUse: string;
  syncPlaylists: SyncPlaylistPack;
};

export type SyncPlaylistPack = {
  tvDrama: string[];
  gamingTrailer: string[];
  sportsPromo: string[];
  fashionAdvert: string[];
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
  email: string;
  phone: string;
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
  sourceOfTruthUrl: string;
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
  spotifyUrl: string;
  deepLink: string;
  email: string;
  country: string;
  status: string;
  notes: string;
  sourcePlacement: string;
};

export type PlaylistAnalysis = {
  id: string;
  playlistId: string;
  playlistName: string;
  spotifyUrl: string;
  tracks: number | null;
  bpm: number | null;
  energy: number | null;
  danceability: number | null;
  valence: number | null;
  acousticness: number | null;
  instrumentalness: number | null;
  speechiness: number | null;
  loudness: string;
  key: string;
  genres: string;
  raw: string;
  capturedAt: string;
};

export type BlogContact = {
  id: string;
  name: string;
  email: string;
  website: string;
  location: string;
  genre: string;
};

export type LibraryOutlet = {
  id: string;
  name: string;
  category: string;
  url: string;
  genre: string;
  notes: string;
  funding: string;
  fundingDeadline: string;
  fundingUrl: string;
  fundingStatus: string;
};

export type Placement = {
  id: string;
  trackTitle: string;
  artist: string;
  type: string;
  production: string;
  playlist: string;
  library: string;
  clientBrand: string;
  supervisorContact: string;
  usage: string;
  date: string;
  airPublishDate: string;
  endDate: string;
  masterFee: string;
  publishingFee: string;
  cueFee: string;
  incomePerPlacement: string;
  isrc: string;
  invoiceNo: string;
  paymentReceived: string;
  notes: string;
  source: string;
  sourceUrl: string;
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

export type PpcEvent = {
  id: string;
  kind: "click" | "pageview";
  page: string;
  href: string;
  label: string;
  at: string;
};

export type RadioSubmission = {
  id: string;
  trackId: string;
  trackTitle: string;
  artist: string;
  isrc: string;
  owned: boolean;
  status: "awaiting-fee" | "paid" | "rotation" | "rejected";
  submissionFeeGbp: number;
  notes: string;
  createdAt: string;
};

export type RadioSpin = {
  id: string;
  trackTitle: string;
  artist: string;
  owned: boolean;
  mechanicalGbp: number;
  performanceReserveGbp: number;
  at: string;
};

export type RadioLedgerLine = {
  id: string;
  kind: "submission" | "mechanical" | "performance-reserve";
  direction: "in" | "out";
  amountGbp: number;
  detail: string;
  at: string;
};

export type FanLead = {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  city: string;
  role: string;
  createdAt: string;
};

export type PromoOrder = {
  id: string;
  packageId: string;
  packageName: string;
  tab: string;
  email: string;
  amountGbp: number;
  createdAt: string;
};

export type VendorProductStatus = "pending" | "approved" | "rejected";

export type VendorProduct = {
  id: string;
  vendorName: string;
  vendorEmail: string;
  productName: string;
  category: string;
  cost: string;
  productUrl: string;
  description: string;
  fileName: string;
  filePath: string;
  status: VendorProductStatus;
  submittedAt: string;
  reviewedAt: string;
  reviewNote: string;
};

export type Store = {
  schemaVersion: number;
  tracks: Track[];
  radioStations: RadioStation[];
  supervisors: Supervisor[];
  opportunities: Opportunity[];
  playlists: PlaylistTarget[];
  placements: Placement[];
  pitches: Pitch[];
  prospects: Prospect[];
  blogs: BlogContact[];
  libraries: LibraryOutlet[];
  fundingRounds: import("./funding").FundingRound[];
  masteringAdvice: import("./mastering").MasteringAdvice[];
  ppcEvents: PpcEvent[];
  radioSubmissions: RadioSubmission[];
  radioSpins: RadioSpin[];
  radioLedger: RadioLedgerLine[];
  fanLeads: FanLead[];
  promoOrders: PromoOrder[];
  vendorProducts: VendorProduct[];
  playlistAnalyses: PlaylistAnalysis[];
  browseAiRobotId: string;
  browseAiOriginUrl: string;
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

export const STORE_SCHEMA_VERSION = 5;
