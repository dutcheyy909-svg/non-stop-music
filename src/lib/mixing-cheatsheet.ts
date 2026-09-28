export type EqCheatRow = {
  band: string;
  hz: string;
  cutWhen: string;
  boostWhen: string;
  amount: string;
};

export const mixingCheatSheet: EqCheatRow[] = [
  {
    band: "Sub rumble",
    hz: "20–40 Hz",
    cutWhen: "Always high-pass anything that is not kick or sub. Cuts mud and saves headroom.",
    boostWhen: "Almost never. If the club needs more weight, add 30–40 Hz on kick or sub only, after the HPF.",
    amount: "Cut: 12–24 dB/oct HPF. Boost: 0–1 dB max.",
  },
  {
    band: "Sub / kick weight",
    hz: "40–80 Hz",
    cutWhen: "On hats, vocals, pads, FX. On bass if it masks the kick.",
    boostWhen: "Kick punch or sub fundamental. One element owns this band, the other ducks.",
    amount: "Boost 1–3 dB bell. Cut competing tracks 2–6 dB.",
  },
  {
    band: "Low-end pocket",
    hz: "80–120 Hz",
    cutWhen: "Kick if it is clicky-thin and bass is already full. Music bus HPF here on synths.",
    boostWhen: "Kick beater / body if the kick disappeared on small speakers.",
    amount: "Boost 1–2 dB. Cut 2–4 dB on the loser of kick vs bass.",
  },
  {
    band: "Mud",
    hz: "150–350 Hz",
    cutWhen: "Default move. Boxy kick, woolly bass, cloudy pads, chesty vocals.",
    boostWhen: "Rarely. Only a thin vocal that has no body, and only after the HPF.",
    amount: "Cut 2–5 dB wide. Boost ≤1.5 dB if you must.",
  },
  {
    band: "Box / honk",
    hz: "350–700 Hz",
    cutWhen: "Snare cardboard, guitar/synth honk, vocal ‘megaphone’.",
    boostWhen: "Almost never on a full mix. Prefer a different sample or tone.",
    amount: "Cut 2–4 dB. Sweep a narrow Q to find the honk.",
  },
  {
    band: "Low mids presence",
    hz: "700 Hz–1.5 kHz",
    cutWhen: "Nasal vocal, cheap synth, harsh piano. Also mixbus if it is shouting.",
    boostWhen: "Clarity on a lost vocal or snare that has no ‘note’.",
    amount: "Cut 1–3 dB. Boost 1–2 dB narrow.",
  },
  {
    band: "Attack / bite",
    hz: "2–4 kHz",
    cutWhen: "Harsh EDM leads, cymbals, esses starting to hurt. First place to cut before you add a de-esser.",
    boostWhen: "Kick click, snare crack, vocal diction — one at a time.",
    amount: "Cut 2–4 dB. Boost 1–2 dB.",
  },
  {
    band: "Presence / sizzle",
    hz: "4–8 kHz",
    cutWhen: "Hats and vocals fighting. De-ess 6–8 kHz. Cheap plugins live here.",
    boostWhen: "Air on a dull vocal after the cut. Snare wires.",
    amount: "Cut 2–5 dB dynamic if possible. Boost 1 dB shelf.",
  },
  {
    band: "Air",
    hz: "10–16 kHz",
    cutWhen: "If the master is already brittle or you hear hiss. LPF FX returns.",
    boostWhen: "After the mix is clean, a tiny high shelf on vocal or mixbus.",
    amount: "Boost 0.5–1.5 dB shelf. Cut only if it hurts.",
  },
  {
    band: "Stereo width",
    hz: "Below 120 Hz vs above 200 Hz",
    cutWhen: "Never spread the sub. Collapse bass to mono.",
    boostWhen: "Widen hats, pads, verbs above ~200 Hz only.",
    amount: "Width 0 under 120 Hz. Modest S1 / Stereo Spread above.",
  },
];

export const mixingCheatRules = [
  "Cut before you boost. If it is muddy, take mud out of the offender, do not add 10 kHz everywhere.",
  "One owner per band: kick or bass at 50 Hz, lead or hats at 8 kHz — not both at full level.",
  "Boost is for character after the cut. 1–2 dB is a mix move; 6 dB is a new sound.",
  "Check in mono after every width or air boost.",
  "Leave mixbus peaks around −6 dBFS, then use the AI Mastering suite for LUFS — do not EQ the master first.",
];
