export type PromoTab = "radio" | "spotify" | "blogs";

export type PromoPackage = {
  id: string;
  tab: PromoTab;
  name: string;
  priceGbp: number;
  blurb: string;
  includes: string[];
  deskHref: string;
};

export const promoPackages: PromoPackage[] = [
  {
    id: "radio-rotation",
    tab: "radio",
    name: "Dutcheyy Radio — rotation pack",
    priceGbp: 49,
    blurb: "Submission fee bundled with two weeks of rotation logging and mechanicals on the in-house station.",
    includes: [
      "Inbox submission on Dutcheyy Radio",
      "Fee + mechanical ledger lines",
      "Two weeks in the rotation list",
      "ISRC shown on the spin log",
    ],
    deskHref: "/station",
  },
  {
    id: "radio-heavy",
    tab: "radio",
    name: "Dutcheyy Radio — heavy rotate",
    priceGbp: 99,
    blurb: "More spins booked, same station desk. Still needs PRS/PPL if you go public.",
    includes: ["Everything in rotation pack", "Priority inbox", "Spin log burst (you click Log spin per play)"],
    deskHref: "/station",
  },
  {
    id: "spotify-push",
    tab: "spotify",
    name: "Spotify — curator push",
    priceGbp: 39,
    blurb: "One catalogue cut pushed at independent Spotify playlists from your master sheet, plus the for Artists editorial link.",
    includes: [
      "Pipeline log per curator",
      "Open Spotify for Artists pitch",
      "Playlist Intelligence + deep links",
    ],
    deskHref: "/promote",
  },
  {
    id: "spotify-campaign",
    tab: "spotify",
    name: "Spotify — campaign",
    priceGbp: 89,
    blurb: "Same as push, aimed at a batch of independent curators rather than a single send.",
    includes: ["Curator push", "Safari playlist import on Promotion", "Follow-up dates in the pipeline"],
    deskHref: "/promote",
  },
  {
    id: "blogs-desk",
    tab: "blogs",
    name: "EDM blogs — desk send",
    priceGbp: 35,
    blurb: "Pitch pack aimed at the EDM blogs sheet: name, email, site, genre.",
    includes: ["Blog contact list from the master book", "EPK + track notes in CRM/outreach", "One logged pitch"],
    deskHref: "/blogs",
  },
  {
    id: "blogs-run",
    tab: "blogs",
    name: "EDM blogs — run",
    priceGbp: 75,
    blurb: "Wider blog pass for one release.",
    includes: ["Desk send", "Multiple logged pitches", "Follow-up on the pipeline"],
    deskHref: "/blogs",
  },
];

export const promoTabs: { id: PromoTab; label: string }[] = [
  { id: "radio", label: "Radio" },
  { id: "spotify", label: "Spotify submissions" },
  { id: "blogs", label: "Blogs" },
];
