import type { Store, Track } from "./types";

export type BusinessLink = {
  id: string;
  name: string;
  group: "tax" | "company" | "rights" | "accounts";
  blurb: string;
  url: string;
};

export type SubmitTemplate = {
  id: string;
  name: string;
  group: "submit" | "tax";
  ext: "txt" | "csv";
  body: string;
};

export const businessLinks: BusinessLink[] = [
  {
    id: "sa-file",
    name: "HMRC Self Assessment",
    group: "tax",
    blurb: "Log in and file the SA100. Sole-trader music income, expenses and royalty statements sit here.",
    url: "https://www.gov.uk/log-in-file-self-assessment-tax-return",
  },
  {
    id: "sa-register",
    name: "Register for Self Assessment",
    group: "tax",
    blurb: "Need an UTR if Dutcheyy Records is trading as a sole trader or partnership.",
    url: "https://www.gov.uk/register-for-self-assessment",
  },
  {
    id: "vat",
    name: "VAT registration",
    group: "tax",
    blurb: "Check the VAT threshold and register if taxable turnover crosses it. Music licences can be VATable.",
    url: "https://www.gov.uk/vat-registration",
  },
  {
    id: "mtd",
    name: "Making Tax Digital",
    group: "tax",
    blurb: "VAT (and income tax later) must be kept in compatible software. Pair with FreeAgent / Xero below.",
    url: "https://www.gov.uk/government/publications/making-tax-digital",
  },
  {
    id: "corp-tax",
    name: "Corporation Tax",
    group: "tax",
    blurb: "If the label is a limited company. CT600 after year-end; keep master/publishing invoices dated in that year.",
    url: "https://www.gov.uk/corporation-tax",
  },
  {
    id: "paye",
    name: "PAYE for employers",
    group: "tax",
    blurb: "If you pay staff, session players on payroll, or take a salary from the company.",
    url: "https://www.gov.uk/paye-for-employers",
  },
  {
    id: "expenses",
    name: "Self-employed expenses",
    group: "tax",
    blurb: "What HMRC allows: studio, plugins (business use), travel to sessions, website, promo that is not entertainment.",
    url: "https://www.gov.uk/expenses-if-youre-self-employed",
  },
  {
    id: "invoice-rules",
    name: "What to put on an invoice",
    group: "tax",
    blurb: "Legal invoice fields for UK sales: who you are, who they are, date, description, VAT if registered.",
    url: "https://www.gov.uk/invoicing-and-taking-payment-from-customers",
  },
  {
    id: "companies-house",
    name: "Companies House",
    group: "company",
    blurb: "File confirmation statements and accounts if you are Ltd. Search the register for counterparties.",
    url: "https://www.gov.uk/government/organisations/companies-house",
  },
  {
    id: "prs",
    name: "PRS for Music",
    group: "rights",
    blurb: "Writer/publisher performing and mechanical collections in the UK. Register works before radio and DJ plays.",
    url: "https://www.prsformusic.com/",
  },
  {
    id: "ppl",
    name: "PPL",
    group: "rights",
    blurb: "Master-side UK radio and public performance. Dutcheyy Radio mechanicals in Non-Stop do not replace PPL.",
    url: "https://www.ppluk.com/",
  },
  {
    id: "freeagent",
    name: "FreeAgent",
    group: "accounts",
    blurb: "UK small-business accounts. Bank feed, invoices, Self Assessment export.",
    url: "https://www.freeagent.com/",
  },
  {
    id: "xero",
    name: "Xero",
    group: "accounts",
    blurb: "Cloud books. Good once you have a bookkeeper. Making Tax Digital compatible.",
    url: "https://www.xero.com/uk/",
  },
  {
    id: "quickbooks",
    name: "QuickBooks UK",
    group: "accounts",
    blurb: "Invoices, VAT, Self Assessment. Use if you already bank with Intuit.",
    url: "https://quickbooks.intuit.com/uk/",
  },
  {
    id: "crunch",
    name: "Crunch",
    group: "accounts",
    blurb: "Accountant + software bundle aimed at UK freelancers and small labels.",
    url: "https://www.crunch.co.uk/",
  },
];

export const businessLinkGroups = [
  { id: "tax" as const, title: "Tax & HMRC" },
  { id: "company" as const, title: "Company filings" },
  { id: "rights" as const, title: "Collections (not tax software)" },
  { id: "accounts" as const, title: "Books" },
];

function line(label: string, value: string) {
  return value.trim() ? `${label}: ${value.trim()}` : "";
}

export function buildSubmitTemplates(store: Store, track: Track | undefined): SubmitTemplate[] {
  const epk = store.epk;
  const title = track?.title || "[TRACK TITLE]";
  const artist = track?.artist || epk.name;
  const genre = track?.genre || epk.genres;
  const mood = track?.mood || "";
  const isrc = track?.isrc || "[ISRC]";
  const bpm = track?.bpm || "[BPM]";
  const rights = track?.rights || "Master + publishing — confirm splits";
  const stream = track?.spotifyUri || track?.preReleaseLink || epk.spotify || "[STREAM / WAV LINK]";
  const web = epk.website || "[WEBSITE]";
  const loc = epk.location || "United Kingdom";
  const bio = epk.shortBio;
  const header = [
    line("Label", epk.name),
    line("Artist", artist),
    line("Track", title),
    line("Genre", genre),
    line("Mood", mood),
    line("BPM", bpm),
    line("ISRC", isrc),
    line("UPC", track?.upc || ""),
    line("Rights", rights),
    line("Listen", stream),
    line("Location", loc),
    line("Site", web),
  ]
    .filter(Boolean)
    .join("\n");

  const radio = `Subject: New music for your show — ${title} (${artist})

Hi,

Please consider ${title} by ${artist} for your playlist / mix show.

${header}

One-liner: ${bio}

WAV + EPK available on request. Happy to send an instrumental or radio edit.

Thank you,
${epk.name}
`;

  const djPlay = `Subject: DJ promo — ${title} (${bpm} BPM)

Hi,

${title} is cleared for DJ use. WAV / MP3 promo attached or linked below.

${header}

Ask: a play in your next mix, radio show, or club set. Please shout the artist/label if you can.

${epk.name}
`;

  const djRemix = `Subject: Remix brief — ${title}

Hi,

We would like a remix of ${title} by ${artist}.

Brief:
- BPM: ${bpm} (or bring your own tempo)
- Keep the hook identifiable
- Genre lane: ${genre}${mood ? ` / ${mood}` : ""}
- Delivery: 24-bit WAV, + instrumental, + stems if we release it
- Rights: remix is work-for-hire / split TBC in writing before you start
- Deadline: [DATE]
- Fee: [£]

Original listen: ${stream}

${epk.name}
`;

  const playlist = `Subject: Playlist submit — ${title}

Hi,

Pitching ${title} by ${artist} for your list.

${header}

Why it fits: [one sentence about the playlist mood].
EPK: ${web || "Non-Stop public EPK"}

Thank you,
${epk.name}
`;

  const blog = `Subject: Premiere / coverage — ${title}

Hi,

${title} is available for premiere or write-up.

${header}

Story: ${bio}

Embeds and quotes ready. Embargo: [DATE / none].

${epk.name}
`;

  const sync = `Subject: Sync pitch — ${title}

Hi,

Submitting ${title} for the brief [BRIEF NAME / REF].

${header}
Duration: ${track?.duration || "[mm:ss]"}
Vocal: [instrumental / vocal / both]
Territory: ${loc}
Usage asked: [trailer / in-show / game / sport]

One-sheet + WAV on request. We can turn around a cutdown.

${epk.name}
`;

  const label = `Subject: Demo — ${title}

Hi A&R,

${title} — ${genre}. Exclusive demo, not shopped widely.

${header}

Previous: catalogue in Non-Stop / Amuse ISRC on file.
Ask: release / remix / DJ support.

${epk.name}
`;

  const groover = `${title} — ${artist}
${genre}${mood ? ` / ${mood}` : ""} · ${bpm} BPM · ${isrc}
Listen: ${stream}
Ask: play or remix. ${bio}
`;

  const invoice = `INVOICE
From: ${epk.name}
Address / VAT no: [ADD]
To: [CLIENT]
Invoice no: DR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001
Date: ${new Date().toISOString().slice(0, 10)}
Payment terms: 14 days
Bank: [SORT / ACC / IBAN]

Description                          Qty    Unit £    Total £
Master licence — ${title}            1      [FEE]     [FEE]
Publishing (if billed here)          1      [FEE]     [FEE]
VAT (if registered)                  —      —         [VAT]
TOTAL DUE                                     £[TOTAL]

ISRC: ${isrc}
Usage: [radio / DJ pool / sync / promo]
Territory: [UK / WW]
`;

  const expenses = `date,supplier,category,net_gbp,vat_gbp,total_gbp,paid_with,track_or_project,receipt,notes
2026-04-06,example plugin shop,software,99.00,19.80,118.80,business card,${title},yes,Waves / Logic licence
2026-04-07,studio hire,studio,150.00,0.00,150.00,bank,${title},yes,session
`;

  const saSheet = `tax_year,box_or_head,description,amount_gbp,source_in_non_stop
2025-26,Turnover,Master + publishing invoices,0,pipeline placements / promo orders
2025-26,Turnover,Dutcheyy Radio submission fees,0,station ledger
2025-26,Turnover,Streaming / Distro (Amuse),0,Amuse statements — paste
2025-26,Allowable expense,Software & plugins (business %),0,production receipts
2025-26,Allowable expense,Studio / mix / master,0,receipts
2025-26,Allowable expense,Promo (Groover, SubmitHub, ads),0,PPC + DJ desks
2025-26,Allowable expense,Website / domain,0,receipts
2025-26,Drawings,Not an expense — keep separate,0,bank
`;

  return [
    { id: "radio", name: "Radio / mix-show submit", group: "submit", ext: "txt", body: radio },
    { id: "dj-play", name: "DJ play / promo", group: "submit", ext: "txt", body: djPlay },
    { id: "dj-remix", name: "DJ remix brief", group: "submit", ext: "txt", body: djRemix },
    { id: "playlist", name: "Playlist curator", group: "submit", ext: "txt", body: playlist },
    { id: "blog", name: "Blog / premiere", group: "submit", ext: "txt", body: blog },
    { id: "sync", name: "Sync / supervisor", group: "submit", ext: "txt", body: sync },
    { id: "label", name: "Label demo", group: "submit", ext: "txt", body: label },
    { id: "groover", name: "Short credit pitch (Groover / SubmitHub)", group: "submit", ext: "txt", body: groover },
    { id: "invoice", name: "Master / licence invoice", group: "tax", ext: "txt", body: invoice },
    { id: "expenses", name: "Expense log (CSV)", group: "tax", ext: "csv", body: expenses },
    { id: "sa", name: "Self Assessment worksheet (CSV)", group: "tax", ext: "csv", body: saSheet },
  ];
}
