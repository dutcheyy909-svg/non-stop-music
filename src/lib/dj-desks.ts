export type DjDeskKind = "play" | "remix" | "both";

export type DjDesk = {
  id: string;
  name: string;
  kind: DjDeskKind;
  region: string;
  genre: string;
  blurb: string;
  url: string;
  cost: string;
};

export const djDesks: DjDesk[] = [
  {
    id: "groover-djs",
    name: "Groover — DJs",
    kind: "both",
    region: "Worldwide",
    genre: "All / electronic / hip-hop / pop",
    blurb:
      "Pay-per-send to verified club, radio and festival DJs. They listen and reply. Remix offers sometimes come back from those replies.",
    url: "https://www.groover.co/en/lp/get-your-track-heard-by-djs/",
    cost: "Credits (few € per DJ)",
  },
  {
    id: "submithub",
    name: "SubmitHub",
    kind: "play",
    region: "Worldwide",
    genre: "All; filter electronic / EDM curators",
    blurb: "DJs, mix-show hosts, playlisters and blogs. Best for a released track you want in sets and round-ups.",
    url: "https://www.submithub.com/",
    cost: "Credits; some free",
  },
  {
    id: "labelradar",
    name: "LabelRadar (Beatport)",
    kind: "both",
    region: "Worldwide",
    genre: "Electronic / dance",
    blurb:
      "Demo labels that work with touring DJs, plus label-hosted remix contests (stems in, remix out, possible official release).",
    url: "https://www.labelradar.com/",
    cost: "Free credits then paid",
  },
  {
    id: "skio",
    name: "SKIO remix contests",
    kind: "remix",
    region: "Worldwide",
    genre: "Electronic / pop / hip-hop (per contest)",
    blurb: "Enter live contests, download stems, upload a WAV remix. Labels also host contests here if you want remixes of a Dutcheyy cut.",
    url: "https://skiomusic.com/",
    cost: "Free to enter most contests",
  },
  {
    id: "digital-dj-pool",
    name: "Digital DJ Pool",
    kind: "play",
    region: "US-heavy, worldwide DJs",
    genre: "House, electronic, hip-hop, R&B, Afro",
    blurb: "Independent record pool. Submit once; working DJs browse, download and play. Charts if the pool responds.",
    url: "https://digitaldjpool.com/music-promotion/",
    cost: "Artist/label promo submit",
  },
  {
    id: "inflyte",
    name: "Inflyte",
    kind: "play",
    region: "Worldwide",
    genre: "Club / radio / dance",
    blurb: "Promo delivery into DJ inboxes, Rekordbox and Dropbox. How labels get pre-releases played. Use with your own DJ list or theirs.",
    url: "https://www.inflyteapp.com/",
    cost: "Label / promo account",
  },
  {
    id: "bbc-introducing",
    name: "BBC Introducing",
    kind: "play",
    region: "UK",
    genre: "All UK-eligible new music",
    blurb: "Uploader for unsigned / new UK artists. Regional shows plus Radio 1 / 1Xtra / Asian Network Introducing. Play, not remix.",
    url: "https://www.bbc.co.uk/introducing/uploader",
    cost: "Free",
  },
  {
    id: "amazing-radio",
    name: "Amazing Radio",
    kind: "play",
    region: "UK / online",
    genre: "New / independent",
    blurb: "Presenter-led station that takes artist uploads. Good second UK play desk after Introducing.",
    url: "https://amazingradio.com/",
    cost: "Free / paid boosts",
  },
  {
    id: "hypeddit",
    name: "Hypeddit",
    kind: "play",
    region: "Worldwide",
    genre: "EDM / house / bass / trap",
    blurb: "SoundCloud / mix-show DJs and blogs. Trade follows and downloads; use for plays and guest-mix attention.",
    url: "https://hypeddit.com/",
    cost: "Campaign credits",
  },
  {
    id: "repostexchange",
    name: "Repost Exchange",
    kind: "play",
    region: "Worldwide",
    genre: "Electronic / bass / house",
    blurb: "SoundCloud DJ and page network. Reposts put the track in DJ feeds; some hosts run mix shows.",
    url: "https://repostexchange.com/",
    cost: "Credits",
  },
  {
    id: "dailyplaylists",
    name: "Daily Playlists",
    kind: "play",
    region: "Worldwide",
    genre: "All; filter DJ / mix curators",
    blurb: "Curator marketplace that includes DJ mix accounts alongside Spotify playlists.",
    url: "https://dailyplaylists.com/",
    cost: "Paid campaigns",
  },
  {
    id: "djmag",
    name: "DJ Mag — new music",
    kind: "play",
    region: "Worldwide",
    genre: "Dance / electronic",
    blurb: "Trade press DJs actually read. Use contact / advertising / new-music routes on the site — not a cold inbox dump.",
    url: "https://djmag.com/",
    cost: "Editorial; check current form",
  },
  {
    id: "mixmag",
    name: "Mixmag",
    kind: "play",
    region: "Worldwide",
    genre: "Club / electronic",
    blurb: "Premiere and mix-series culture. Premieres go through PR or the site’s submit/contact paths when they are open.",
    url: "https://mixmag.net/",
    cost: "Editorial",
  },
  {
    id: "splice-contests",
    name: "Splice remix contests",
    kind: "remix",
    region: "Worldwide",
    genre: "Electronic / pop (per drop)",
    blurb: "Periodic brand and artist remix contests with sample packs. Watch Splice Blog / contests, not a standing inbox.",
    url: "https://splice.com/features/remix-contests",
    cost: "Free with Splice account",
  },
  {
    id: "beatport-contests",
    name: "Beatport remix contests",
    kind: "remix",
    region: "Worldwide",
    genre: "Dance",
    blurb: "Official contest pages and LabelRadar remixes. Winning remixes can land on Beatport via the host label.",
    url: "https://www.beatport.com/",
    cost: "Free to enter listed contests",
  },
  {
    id: "dutcheyy-radio",
    name: "Dutcheyy Radio",
    kind: "play",
    region: "In-house",
    genre: "EDM / vault",
    blurb: "Your own station desk. Submission + mechanicals. Use this when you want a guaranteed play log on Non-Stop.",
    url: "/station",
    cost: "In-app fee",
  },
];

export const djKindLabel: Record<DjDeskKind, string> = {
  play: "Get it played",
  remix: "Get a remix",
  both: "Play + remix",
};
