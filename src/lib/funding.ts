export type FundingRound = {
  id: string;
  programme: string;
  funder: string;
  amount: string;
  deadline: string;
  status: "open" | "upcoming" | "rolling" | "closed";
  url: string;
  fit: string;
};

export const fundingRounds: FundingRound[] = [
  {
    id: "hm-fast-track-r2",
    programme: "Fast Track (career / recording / sync costs)",
    funder: "Help Musicians",
    amount: "Up to £500",
    deadline: "2026-10-09",
    status: "open",
    url: "https://www.helpmusicians.org.uk/get-support/develop-as-a-musician/fast-track-grants",
    fit: "UK working musicians. Can cover recording, release, networking and costs tied to sync / catalogue opportunities.",
  },
  {
    id: "hm-fast-track-r3",
    programme: "Fast Track round 3",
    funder: "Help Musicians",
    amount: "Up to £500",
    deadline: "2026-11-20",
    status: "upcoming",
    url: "https://www.helpmusicians.org.uk/get-support/develop-as-a-musician/fast-track-grants",
    fit: "Opens 19 October 2026. Same Fast Track uses as round 2.",
  },
  {
    id: "ace-mcgf-r1",
    programme: "Music Creators Growth Fund — round one",
    funder: "Arts Council England",
    amount: "Check current guidance",
    deadline: "2026-10-29",
    status: "upcoming",
    url: "https://www.artscouncil.org.uk/music-growth-package/who-we-support-music-creators",
    fit: "Opens 1 October 2026. Explicitly covers catalogue marketing, self-publishing and sync licensing of recent work.",
  },
  {
    id: "ace-sgm-sep",
    programme: "Supporting Grassroots Music",
    funder: "Arts Council England",
    amount: "Up to £3,500",
    deadline: "2026-09-27",
    status: "open",
    url: "https://www.artscouncil.org.uk/supporting-grassroots-music",
    fit: "Live / promoter ecosystem. Next round after this: 1 November 2026.",
  },
  {
    id: "ace-sgm-nov",
    programme: "Supporting Grassroots Music — November round",
    funder: "Arts Council England",
    amount: "Up to £3,500",
    deadline: "2026-11-01",
    status: "upcoming",
    url: "https://www.artscouncil.org.uk/supporting-grassroots-music",
    fit: "Follow-on SGM round.",
  },
  {
    id: "cs-open",
    programme: "Open Fund for Individuals",
    funder: "Creative Scotland",
    amount: "£500–£50,000",
    deadline: "Rolling — apply anytime",
    status: "rolling",
    url: "https://www.creativescotland.com/funding/funding-programmes/open-funding/open-fund-for-individuals",
    fit: "Scotland-based creators. Research, development or delivery including catalogue / project work. No deadline.",
  },
  {
    id: "prs-open",
    programme: "Open Fund for Music Creators",
    funder: "PRS Foundation",
    amount: "Up to £5,000",
    deadline: "2026-09-07",
    status: "closed",
    url: "https://prsfoundation.com/funding-support/deadlines/",
    fit: "Last 2026 deadline was 7 September. Watch the PRS deadlines page for 2027 dates.",
  },
  {
    id: "mgf-biz",
    programme: "Music Growth Fund (music businesses)",
    funder: "Arts Council England / partners",
    amount: "£1,000–£100,000 (strands)",
    deadline: "2026-10-15",
    status: "open",
    url: "https://www.artscouncil.org.uk/music-growth-package",
    fit: "For music companies and libraries scaling catalogue, staff or export — confirm current strand on ACE site.",
  },
];

export function fundingForLibrary(name: string, notes = "", genre = "") {
  const hay = `${name} ${notes} ${genre}`.toLowerCase();
  const pool = fundingRounds.filter((round) => round.status !== "closed");
  if (/scotland/.test(hay)) {
    return pool.find((round) => round.id === "cs-open") ?? pool[0];
  }
  const dated = pool
    .filter((round) => round.deadline.match(/^\d{4}-\d{2}-\d{2}$/))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  return dated[0] ?? pool.find((round) => round.status === "rolling") ?? pool[0];
}
