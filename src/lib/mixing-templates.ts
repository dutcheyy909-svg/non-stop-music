export type MixInsert = {
  slot: number;
  plugin: string;
  house: "Logic stock" | "Waves" | "Ableton stock" | "Native Instruments";
  setting: string;
};

export type MixChannel = {
  name: string;
  type: "Audio" | "Software Instrument" | "Aux" | "Stack";
  colour: string;
  output: string;
  instrument?: string;
  inserts: MixInsert[];
  sends: string;
};

export type MixingTemplate = {
  id: string;
  name: string;
  daw: string;
  sampleRate: string;
  bitDepth: string;
  notes: string;
  buses: string[];
  channels: MixChannel[];
};

const stock = (slot: number, plugin: string, setting: string): MixInsert => ({
  slot,
  plugin,
  house: "Logic stock",
  setting,
});

const waves = (slot: number, plugin: string, setting: string): MixInsert => ({
  slot,
  plugin,
  house: "Waves",
  setting,
});

export const logicEdmMixTemplate: MixingTemplate = {
  id: "logic-edm-waves",
  name: "Dutcheyy EDM — Logic Pro + Waves",
  daw: "Logic Pro",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Dark / driving electronic template. Create a new empty project, set 48 kHz, then add these tracks and inserts in order. Logic stock plugins are always on; Waves is the colour and glue. Leave mixbus peaks around −6 dBFS before the limiter so the AI Mastering suite targets still have headroom. Save as File → Save as Template… named Dutcheyy EDM Mix.",
  buses: [
    "Bus 1 — Drums (sum kick/snare/hats/perc)",
    "Bus 2 — Bass (sub + mid bass)",
    "Bus 3 — Music (leads, pads, stabs, FX beds)",
    "Bus 4 — Vocals (leads + chops + adlibs)",
    "Bus 5 — Atmosphere (risers, impacts, tails)",
    "Bus 6 — Parallel crush (drums send, pre-fader)",
    "Bus 7 — Parallel vocal (post-delay, pre-fader)",
    "Stereo Out — Mixbus",
  ],
  channels: [
    {
      name: "01 Kick",
      type: "Audio",
      colour: "Red",
      output: "Bus 1 Drums",
      sends: "Bus 6 crush −12 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 25 Hz, small bump 60–80 Hz, dip 300 Hz if boxy"),
        waves(2, "Waves Renaissance Bass", "Add 50–60 Hz weight, keep clip light"),
        stock(3, "Compressor", "Platinum, 4:1, slow attack, fast release, 2–3 dB GR"),
        waves(4, "Waves SSL G-Channel", "Mic + output trim, mild drive"),
      ],
    },
    {
      name: "02 Snare / clap",
      type: "Audio",
      colour: "Orange",
      output: "Bus 1 Drums",
      sends: "Bus 6 crush −18 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 90 Hz, presence 3–5 kHz"),
        waves(2, "Waves CLA-76", "All-buttons-in lightly for snap"),
        stock(3, "Enveloper", "Attack up if the sample is dull"),
      ],
    },
    {
      name: "03 Hats / tops",
      type: "Audio",
      colour: "Yellow",
      output: "Bus 1 Drums",
      sends: "Bus 5 atmosphere −inf by default; ride in breakdowns",
      inserts: [
        stock(1, "Channel EQ", "HPF 200 Hz, air shelf 10 kHz"),
        waves(2, "Waves C6", "Tame 6–8 kHz harshness on the wide band"),
        stock(3, "Stereo Spread", "Subtle; keep mono compatible"),
      ],
    },
    {
      name: "04 Perc / fills",
      type: "Audio",
      colour: "Yellow",
      output: "Bus 1 Drums",
      sends: "Bus 5 atmosphere −20 dB",
      inserts: [
        stock(1, "Channel EQ", "Carve vs snare"),
        stock(2, "Compressor", "Studio VCA, fast, 1–2 dB"),
      ],
    },
    {
      name: "05 Sub bass",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      sends: "None (keep mono)",
      inserts: [
        stock(1, "Gain", "Gain stage so peaks sit −12 dBFS"),
        stock(2, "Channel EQ", "HPF 28 Hz, LPF 90–120 Hz"),
        stock(3, "Utility → Direction Mixer", "Width 0 (mono)"),
        waves(4, "Waves Renaissance Bass", "Only if the sub disappears on small speakers"),
      ],
    },
    {
      name: "06 Mid bass",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      sends: "Bus 5 −24 dB for tails",
      inserts: [
        stock(1, "Channel EQ", "HPF 80 Hz, notch vs kick"),
        waves(2, "Waves SSL G-Channel", "Filter + dynam EQ"),
        stock(3, "Compressor", "Sidechain from Kick via Side Chain input"),
        waves(4, "Waves C6", "Hold 200–400 Hz when kick hits"),
      ],
    },
    {
      name: "07 Lead / stab",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Music",
      sends: "Bus 5 −12 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 120 Hz, dip 2–4 kHz if harsh"),
        waves(2, "Waves SSL G-Channel", "Drive + EQ"),
        waves(3, "Waves H-Delay", "1/8 or 1/4 dotted, filtered"),
        stock(4, "ChromaGlow", "Subtle saturation"),
      ],
    },
    {
      name: "08 Pads / FX beds",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Music",
      sends: "Bus 5 −6 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 180 Hz so the drop stays punchy"),
        stock(2, "ChromaVerb", "Small plate, 15–25% wet"),
        waves(3, "Waves S1 Stereo Imager", "Widen above 300 Hz only"),
      ],
    },
    {
      name: "09 Vocal lead",
      type: "Audio",
      colour: "Pink",
      output: "Bus 4 Vocals",
      sends: "Bus 7 parallel −6 dB; Bus 5 −18 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 80–100 Hz, de-ess dip 6–8 kHz"),
        waves(2, "Waves Renaissance Vox", "Gate + compress, 3–5 dB"),
        waves(3, "Waves CLA-2A", "Levelling, slow"),
        waves(4, "Waves Vocal Rider", "Automate less; then print rides"),
        stock(5, "Pitch Correction", "Natural, retune speed medium if needed"),
        waves(6, "Waves Doubler", "2-voice, low mix, high-pass the doubles"),
      ],
    },
    {
      name: "10 Vocal chops",
      type: "Audio",
      colour: "Pink",
      output: "Bus 4 Vocals",
      sends: "Bus 5 −8 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 150 Hz"),
        stock(2, "Tape Delay", "Synced 1/8, analog"),
        waves(3, "Waves H-Delay", "Throw for transitions"),
      ],
    },
    {
      name: "AUX Bus 1 Drums",
      type: "Aux",
      colour: "Red",
      output: "Stereo Out",
      sends: "Bus 6 already feeding crush",
      inserts: [
        waves(1, "Waves API 2500", "Glue, 2 dB GR"),
        stock(2, "Channel EQ", "Dip 400 Hz, shelf 8 kHz"),
        waves(3, "Waves NLS", "Hornet or Spike, mix 20–30%"),
      ],
    },
    {
      name: "AUX Bus 2 Bass",
      type: "Aux",
      colour: "Purple",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Linear Phase EQ", "Final kick vs bass pocket"),
        waves(2, "Waves C6", "Dynamic low-mid control"),
        stock(3, "Multimeter", "Watch correlation; keep sub mono"),
      ],
    },
    {
      name: "AUX Bus 3 Music",
      type: "Aux",
      colour: "Green",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Channel EQ", "HPF 100 Hz"),
        waves(2, "Waves SSL G-Channel", "Bus compression very light"),
      ],
    },
    {
      name: "AUX Bus 4 Vocals",
      type: "Aux",
      colour: "Pink",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves C6", "De-ess + presence"),
        stock(2, "Adaptive Limiter", "Ceiling −1 dB, gain 0 — safety only"),
      ],
    },
    {
      name: "AUX Bus 5 Atmosphere",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Space Designer", "Large hall or plate IR, 100% wet"),
        waves(2, "Waves H-Reverb", "Dark decay, HPF 200 Hz on the return"),
        stock(3, "Channel EQ", "LPF 8 kHz so FX do not steal the lead"),
      ],
    },
    {
      name: "AUX Bus 6 Parallel crush",
      type: "Aux",
      colour: "Orange",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Overdrive", "Drive until drums smear, then blend"),
        waves(2, "Waves L2 Ultramaximizer", "Aggressive, then pull aux fader to taste"),
        stock(3, "Channel EQ", "HPF 150 Hz so crush does not add rumble"),
      ],
    },
    {
      name: "AUX Bus 7 Parallel vocal",
      type: "Aux",
      colour: "Pink",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves CLA-76", "Fast, 6–8 dB GR"),
        stock(2, "Exciter", "High, mix low"),
      ],
    },
    {
      name: "Stereo Out Mixbus",
      type: "Aux",
      colour: "White",
      output: "Stereo Out",
      sends: "None — bounce here, then open AI Mastering suite",
      inserts: [
        stock(1, "Gain", "Set mix peaks ≈ −6 dBFS"),
        waves(2, "Waves NLS", "Buss, mix 15–25%"),
        waves(3, "Waves SSL G-Channel", "EQ only, compression off or 1 dB"),
        stock(4, "Multipressor", "Optional 0.5 dB on low band"),
        stock(5, "Linear Phase EQ", "Tiny tilt if the reference is brighter"),
        waves(6, "Waves S1 Stereo Imager", "Width modest; check mono"),
        stock(7, "Limiter", "Off while mixing; enable only for rough refs"),
        stock(8, "Multimeter", "LUFS + true peak vs /mastering destination"),
      ],
    },
  ],
};

const live = (slot: number, plugin: string, setting: string): MixInsert => ({
  slot,
  plugin,
  house: "Ableton stock",
  setting,
});

export const logicStockEdmTemplate: MixingTemplate = {
  id: "logic-stock-edm",
  name: "Dutcheyy EDM — Logic stock only",
  daw: "Logic Pro",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Same bus map as the Waves template, but every insert is Logic stock so it opens on any Mac with Logic. Use File → New from Template for Apple’s Electronic starter, then replace routing with this card. Not a Sean Divine product.",
  buses: [
    "Bus 1 — Drums",
    "Bus 2 — Bass",
    "Bus 3 — Music",
    "Bus 4 — Vocals",
    "Bus 5 — FX return (ChromaVerb + Tape Delay)",
    "Stereo Out — Mixbus",
  ],
  channels: [
    {
      name: "Kick",
      type: "Audio",
      colour: "Red",
      output: "Bus 1 Drums",
      sends: "None",
      inserts: [
        stock(1, "Channel EQ", "HPF 25 Hz, bump 60 Hz"),
        stock(2, "Compressor", "Platinum, slow attack"),
        stock(3, "ChromaGlow", "Subtle tube"),
      ],
    },
    {
      name: "Bass stack",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      sends: "None",
      inserts: [
        stock(1, "Channel EQ", "HPF 30 Hz, LPF 120 Hz on sub track"),
        stock(2, "Compressor", "Sidechain from Kick"),
        stock(3, "Direction Mixer", "Sub mono"),
      ],
    },
    {
      name: "Lead / vocal",
      type: "Audio",
      colour: "Pink",
      output: "Bus 4 Vocals",
      sends: "Bus 5 −12 dB",
      inserts: [
        stock(1, "Channel EQ", "HPF 100 Hz"),
        stock(2, "DeEsser 2", "6–8 kHz"),
        stock(3, "Compressor", "Studio VCA, 3 dB GR"),
        stock(4, "Pitch Correction", "Natural"),
      ],
    },
    {
      name: "AUX Bus 5 FX",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "ChromaVerb", "100% wet, dark plate"),
        stock(2, "Tape Delay", "1/8 dotted, analog"),
        stock(3, "Channel EQ", "HPF 200 Hz, LPF 8 kHz"),
      ],
    },
    {
      name: "Stereo Out",
      type: "Aux",
      colour: "White",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Gain", "Peaks ≈ −6 dBFS"),
        stock(2, "Multipressor", "Light glue"),
        stock(3, "Adaptive Limiter", "Off until reference bounce"),
        stock(4, "Multimeter", "Check /mastering LUFS"),
      ],
    },
  ],
};

export const logicStockVocalTemplate: MixingTemplate = {
  id: "logic-stock-vocal",
  name: "Dutcheyy vocal chain — Logic stock",
  daw: "Logic Pro",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Generic vocal insert order using only plugins that ship with Logic. For Sean Divine’s own session files, use his free tutorial download or buy Template One — this is not a reconstruction of his presets.",
  buses: ["Bus 1 — Vocal verb", "Bus 2 — Vocal delay", "Stereo Out"],
  channels: [
    {
      name: "Lead vocal",
      type: "Audio",
      colour: "Pink",
      output: "Stereo Out",
      sends: "Bus 1 −18 dB; Bus 2 −20 dB",
      inserts: [
        stock(1, "Gain", "Peaks −12 dBFS into the chain"),
        stock(2, "Channel EQ", "HPF 80 Hz, notch boxiness ~300 Hz"),
        stock(3, "DeEsser 2", "Listen mode, then 6–7 kHz"),
        stock(4, "Compressor", "Platinum, 3:1, 4 dB GR"),
        stock(5, "Compressor", "Vintage VCA, slower, 2 dB GR"),
        stock(6, "Channel EQ", "Air shelf 10 kHz if dull"),
        stock(7, "Limiter", "Safety −1 dB, not the sound"),
      ],
    },
    {
      name: "AUX verb",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [stock(1, "Space Designer", "Small plate IR, 100% wet"), stock(2, "Channel EQ", "HPF 250 Hz")],
    },
    {
      name: "AUX delay",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [stock(1, "Tape Delay", "1/8, feedback low"), stock(2, "Channel EQ", "Band-pass 400–4 kHz")],
    },
  ],
};

export const abletonEdmTemplate: MixingTemplate = {
  id: "ableton-edm-stock",
  name: "Dutcheyy EDM — Ableton Live stock",
  daw: "Ableton Live",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Internet-standard electronic routing in Live: groups, return tracks, stock devices only. File → Save Live Set as Template after you build it.",
  buses: ["Group Drums", "Group Bass", "Group Music", "Return A Reverb", "Return B Delay", "Master"],
  channels: [
    {
      name: "Kick",
      type: "Audio",
      colour: "Red",
      output: "Group Drums",
      sends: "None",
      inserts: [
        live(1, "EQ Eight", "HPF 25 Hz"),
        live(2, "Compressor", "Slow attack, sidechain off"),
        live(3, "Saturator", "Soft, drive low"),
      ],
    },
    {
      name: "Bass",
      type: "Software Instrument",
      colour: "Purple",
      output: "Group Bass",
      sends: "None",
      inserts: [
        live(1, "EQ Eight", "HPF 30 Hz"),
        live(2, "Compressor", "Sidechain from Kick"),
        live(3, "Utility", "Bass mono below 120 Hz"),
      ],
    },
    {
      name: "Master",
      type: "Aux",
      colour: "White",
      output: "Master",
      sends: "None",
      inserts: [
        live(1, "Glue Compressor", "1–2 dB"),
        live(2, "EQ Eight", "Gentle tilt"),
        live(3, "Limiter", "Off while mixing"),
      ],
    },
  ],
};

const ni = (slot: number, plugin: string, setting: string): MixInsert => ({
  slot,
  plugin,
  house: "Native Instruments",
  setting,
});

export const niKompleteLogicTemplate: MixingTemplate = {
  id: "logic-ni-komplete-edm",
  name: "Dutcheyy EDM — Logic Pro + Native Instruments",
  daw: "Logic Pro (Komplete instruments)",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Software-instrument session: every sound source is Native Instruments (Kontakt, Battery, Massive X, Super 8, Reaktor, Guitar Rig, FM8). Logic stock does the mix. Load Komplete Kontrol or the individual plug-in on each track. Needs a licensed Komplete / Komplete Start set — Native Access, not a crack. Save as User Template: Dutcheyy NI Mix.",
  buses: [
    "Bus 1 — Drums (Battery)",
    "Bus 2 — Bass (Massive X / Super 8)",
    "Bus 3 — Music (Massive X, FM8, Kontakt)",
    "Bus 4 — Atmosphere (Reaktor / Guitar Rig)",
    "Bus 5 — Verb/delay returns",
    "Stereo Out — Mixbus",
  ],
  channels: [
    {
      name: "01 Battery drums",
      type: "Software Instrument",
      colour: "Red",
      output: "Bus 1 Drums",
      instrument: "Battery 4 — electronic kit, 16 pads (kick, snare, clap, hats, perc, ride)",
      sends: "Bus 5 −18 dB on hats/perc only",
      inserts: [
        ni(1, "Battery 4", "Factory / Komplete electronic kit; map C1 kick, D1 snare, F#1 hats"),
        stock(2, "Channel EQ", "HPF 25 Hz on the channel, dip 300 Hz if the kit is boxy"),
        stock(3, "Compressor", "Platinum, slow attack, 2 dB GR on the whole kit"),
      ],
    },
    {
      name: "02 Massive X sub",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      instrument: "Massive X — sine/wavetable sub, unison 1, mono",
      sends: "None",
      inserts: [
        ni(1, "Massive X", "Osc A sine or clean WT; filter lowpass; no extra FX in the synth"),
        stock(2, "Channel EQ", "HPF 28 Hz, LPF ~100 Hz"),
        stock(3, "Direction Mixer", "Width 0"),
        stock(4, "Compressor", "Sidechain from Battery kick"),
      ],
    },
    {
      name: "03 Massive X mid bass",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      instrument: "Massive X — growly WT, 2 voices, slight detune",
      sends: "Bus 5 −24 dB",
      inserts: [
        ni(1, "Massive X", "Performer on cutoff; noise off; FX: light drive only"),
        stock(2, "Channel EQ", "HPF 80 Hz so it does not fight the sub"),
        stock(3, "Compressor", "Sidechain from kick, 4:1"),
      ],
    },
    {
      name: "04 Super 8 analog lead",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Music",
      instrument: "Super 8 — dual osc analog lead / stab",
      sends: "Bus 5 −12 dB",
      inserts: [
        ni(1, "Super 8", "Saw + pulse, short env, unison 3–5"),
        stock(2, "Channel EQ", "HPF 150 Hz"),
        stock(3, "ChromaGlow", "Subtle"),
      ],
    },
    {
      name: "05 FM8 bells / stabs",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Music",
      instrument: "FM8 — metallic stab or bell for drops",
      sends: "Bus 5 −8 dB",
      inserts: [
        ni(1, "FM8", "Factory FM stab; shorten decay for EDM hits"),
        stock(2, "Channel EQ", "Notch harsh 2–4 kHz"),
      ],
    },
    {
      name: "06 Kontakt beds",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Music",
      instrument: "Kontakt — cinematic / texture library (factory or Komplete)",
      sends: "Bus 5 −6 dB",
      inserts: [
        ni(1, "Kontakt 8", "One patch: pads or riser atmospheres; 16-out if you split mics later"),
        stock(2, "Channel EQ", "HPF 180 Hz"),
        stock(3, "ChromaVerb", "15% wet if the patch is dry"),
      ],
    },
    {
      name: "07 Reaktor FX / Blocks",
      type: "Software Instrument",
      colour: "Blue",
      output: "Bus 4 Atmosphere",
      instrument: "Reaktor 6 — Blocks or factory ensemble for risers / glitch",
      sends: "Bus 5 −6 dB",
      inserts: [
        ni(1, "Reaktor 6", "Blocks: LFO → filter → delay; or factory grain/glitch ensemble"),
        stock(2, "Channel EQ", "LPF 10 kHz so FX do not sit on the lead"),
      ],
    },
    {
      name: "08 Guitar Rig colour",
      type: "Software Instrument",
      colour: "Orange",
      output: "Bus 4 Atmosphere",
      instrument: "Guitar Rig 7 — amp/drive on a mid-bass or stab send",
      sends: "None",
      inserts: [
        ni(1, "Guitar Rig 7", "Clean amp + cabinet, drive low; use as insert on a duplicate mid-bass if needed"),
        stock(2, "Channel EQ", "HPF 120 Hz, LPF 6 kHz"),
      ],
    },
    {
      name: "09 Komplete Kontrol (optional stack)",
      type: "Stack",
      colour: "White",
      output: "Stereo Out",
      instrument: "Komplete Kontrol — browse all of the above from one keyboard",
      sends: "None",
      inserts: [
        ni(1, "Komplete Kontrol", "Host Battery / Massive X / Kontakt instances; NKS macros for filter and decay"),
      ],
    },
    {
      name: "AUX Bus 5 FX",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        stock(1, "Space Designer", "Dark plate, 100% wet"),
        stock(2, "Tape Delay", "1/8 dotted"),
        stock(3, "Channel EQ", "HPF 200 Hz"),
      ],
    },
    {
      name: "AUX Bus 1 Drums",
      type: "Aux",
      colour: "Red",
      output: "Stereo Out",
      sends: "None",
      inserts: [stock(1, "Compressor", "Studio VCA glue 2 dB"), stock(2, "Channel EQ", "Shelf 8 kHz")],
    },
    {
      name: "Stereo Out Mixbus",
      type: "Aux",
      colour: "White",
      output: "Stereo Out",
      sends: "Then AI Mastering suite",
      inserts: [
        stock(1, "Gain", "Peaks ≈ −6 dBFS"),
        stock(2, "Multipressor", "Light"),
        stock(3, "Multimeter", "LUFS vs /mastering"),
      ],
    },
  ],
};

export const logicWavesMultiInstrumentTemplate: MixingTemplate = {
  id: "logic-waves-multi-instrument",
  name: "Dutcheyy Multi-Instrument — Logic Pro + Waves",
  daw: "Logic Pro",
  sampleRate: "48 kHz",
  bitDepth: "24-bit",
  notes:
    "Full-session mix chain for many instruments at once (drums, bass, keys, guitars, strings, brass, pads, lead). Every channel uses a Waves SSL G-Channel first so gain, HPF and EQ stay consistent, then a colour compressor. Buses glue families before the mixbus. Licensed Waves only (Gold / SSL 4000 Collection is enough for this card). Save as User Template: Dutcheyy Waves Multi-Inst.",
  buses: [
    "Bus 1 — Drums (kick, snare, hats, rooms, perc)",
    "Bus 2 — Bass (DI + amp / synth bass)",
    "Bus 3 — Keys (piano, Rhodes, organ, synths)",
    "Bus 4 — Guitars (clean, crunch, lead)",
    "Bus 5 — Orchestra (strings, brass, woodwinds)",
    "Bus 6 — Vocals / lead line (optional)",
    "Bus 7 — Parallel crush (drums + guitars, pre-fader)",
    "Bus 8 — Plate / hall (music + vocals)",
    "Bus 9 — Slap / delay throws",
    "Stereo Out — Mixbus",
  ],
  channels: [
    {
      name: "01 Kick",
      type: "Audio",
      colour: "Red",
      output: "Bus 1 Drums",
      sends: "Bus 7 crush −14 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 25 Hz, bell +2 at 60–80 Hz, dip 300 Hz, dyn 2 dB"),
        waves(2, "Waves Renaissance Bass", "50 Hz harmonic, mix low so the sample stays clean"),
        waves(3, "Waves CLA-76", "Blue, slow attack, fast release, 2–3 dB GR"),
      ],
    },
    {
      name: "02 Snare",
      type: "Audio",
      colour: "Orange",
      output: "Bus 1 Drums",
      sends: "Bus 7 −18 dB; Bus 8 −24 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 90 Hz, +3 at 200 Hz body, +2 at 5 kHz crack"),
        waves(2, "Waves CLA-76", "All-buttons-in lightly for snap"),
        waves(3, "Waves Kramer Tape", "15 ips, record +2, mix 25%"),
      ],
    },
    {
      name: "03 Hats / overheads / perc",
      type: "Audio",
      colour: "Yellow",
      output: "Bus 1 Drums",
      sends: "Bus 8 −inf default",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 200 Hz, air shelf 10 kHz"),
        waves(2, "Waves C6", "Wide band dip 6–8 kHz if cymbals spit"),
        waves(3, "Waves S1 Stereo Imager", "Ohats only; keep kick/snare centre"),
      ],
    },
    {
      name: "04 Bass DI",
      type: "Audio",
      colour: "Purple",
      output: "Bus 2 Bass",
      sends: "None (keep mono)",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 30 Hz, LPF 5 kHz, dip vs kick at 60 Hz"),
        waves(2, "Waves Renaissance Bass", "Only if small speakers lose the note"),
        waves(3, "Waves Renaissance Compressor", "Opto, 4:1, 2–4 dB, slow attack"),
      ],
    },
    {
      name: "05 Bass amp / synth bass",
      type: "Software Instrument",
      colour: "Purple",
      output: "Bus 2 Bass",
      instrument: "Amped DI duplicate or Massive / Serum / Super 8 mid-bass",
      sends: "Bus 8 −24 dB for tails only",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 80 Hz so it does not fight DI sub"),
        waves(2, "Waves GTR3 Stomp / NLS", "Light drive; skip if the synth already saturates"),
        waves(3, "Waves C6", "Hold 200–400 Hz when kick hits (sidechain listen)"),
      ],
    },
    {
      name: "06 Piano / keys",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Keys",
      instrument: "Logic Piano, Kontakt, or Rhodes",
      sends: "Bus 8 −12 dB; Bus 9 −inf",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 80 Hz, dip 300 Hz mud, +1.5 presence 3 kHz"),
        waves(2, "Waves Renaissance EQ", "Shelf −1.5 at 8 kHz if the piano is brittle"),
        waves(3, "Waves CLA-2A", "Peak reduction 2–3 dB, keep the player’s dynamics"),
        waves(4, "Waves Kramer Tape", "7.5 ips on Rhodes / organ for glue"),
      ],
    },
    {
      name: "07 Synth pads / layers",
      type: "Software Instrument",
      colour: "Green",
      output: "Bus 3 Keys",
      instrument: "Pads, stabs, FX beds",
      sends: "Bus 8 −8 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 150 Hz so drums and bass stay punchy"),
        waves(2, "Waves C6", "Tame 2–4 kHz if several layers stack"),
        waves(3, "Waves S1 Stereo Imager", "Widen above 250 Hz; check mono"),
      ],
    },
    {
      name: "08 Clean guitar",
      type: "Audio",
      colour: "Orange",
      output: "Bus 4 Guitars",
      sends: "Bus 8 −18 dB; Bus 9 1/8 slap −20 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 90 Hz, notch 1–1.5 kHz box, shelf 8 kHz"),
        waves(2, "Waves GTR3 Stomp", "Compressor + mild chorus; keep cab off if already miked"),
        waves(3, "Waves Renaissance Vox", "Light gate + 2 dB GR to sit under keys"),
      ],
    },
    {
      name: "09 Crunch / lead guitar",
      type: "Audio",
      colour: "Orange",
      output: "Bus 4 Guitars",
      sends: "Bus 7 crush −20 dB; Bus 9 throws",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 120 Hz, dip 400 Hz, presence 2.5–4 kHz"),
        waves(2, "Waves GTR3 Amp", "British / US crunch, cab IR if DI"),
        waves(3, "Waves CLA-76", "Fast attack to control chugs, 3 dB GR"),
        waves(4, "Waves Doubler", "Lead only, 2-voice, high-pass doubles at 200 Hz"),
      ],
    },
    {
      name: "10 Strings",
      type: "Software Instrument",
      colour: "Blue",
      output: "Bus 5 Orchestra",
      instrument: "Kontakt / Session Strings / live ensemble",
      sends: "Bus 8 −6 dB hall",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 100 Hz, gentle 200 Hz body, air 10 kHz"),
        waves(2, "Waves C6", "De-harsh 2–5 kHz on loud ostinatos"),
        waves(3, "Waves Renaissance Reverb", "Small chamber 10% wet if the patch is dry"),
      ],
    },
    {
      name: "11 Brass / winds",
      type: "Software Instrument",
      colour: "Blue",
      output: "Bus 5 Orchestra",
      instrument: "Brass hits, horns, woodwinds",
      sends: "Bus 8 −10 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 120 Hz, bite 2 kHz, dip 500 Hz honk"),
        waves(2, "Waves API 2500", "Soft knee, 2 dB GR so stabs do not jump the mix"),
        waves(3, "Waves Kramer HLS", "Mild transformer colour"),
      ],
    },
    {
      name: "12 Lead / motif (inst or vox)",
      type: "Audio",
      colour: "Pink",
      output: "Bus 6 Vocals",
      sends: "Bus 8 −18 dB; Bus 9 −12 dB",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 80–120 Hz, presence 5 kHz"),
        waves(2, "Waves Renaissance Vox", "3–5 dB GR"),
        waves(3, "Waves CLA-2A", "Levelling, slow"),
        waves(4, "Waves Doubler", "Instrument leads: 15% mix; vocals: 10%"),
        waves(5, "Waves H-Delay", "1/8 or 1/4 dotted, analog, HPF 250 Hz on the delay"),
      ],
    },
    {
      name: "AUX Bus 1 Drums",
      type: "Aux",
      colour: "Red",
      output: "Stereo Out",
      sends: "Already feeding Bus 7",
      inserts: [
        waves(1, "Waves API 2500", "Glue, 2 dB GR, punch on"),
        waves(2, "Waves SSL G-Equalizer", "Dip 400 Hz, shelf 8 kHz"),
        waves(3, "Waves NLS", "Hornet or Spike, mix 25%"),
      ],
    },
    {
      name: "AUX Bus 2 Bass",
      type: "Aux",
      colour: "Purple",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves SSL G-Channel", "Check mono; dip vs kick again if needed"),
        waves(2, "Waves Renaissance Compressor", "1–2 dB to lock DI + amp"),
      ],
    },
    {
      name: "AUX Bus 3 Keys",
      type: "Aux",
      colour: "Green",
      output: "Stereo Out",
      sends: "Bus 8 −6 dB if the family is dry",
      inserts: [
        waves(1, "Waves SSL G-Equalizer", "HPF 80 Hz, dip 250 Hz so guitars have space"),
        waves(2, "Waves C6", "Hold competing mids when the lead plays"),
      ],
    },
    {
      name: "AUX Bus 4 Guitars",
      type: "Aux",
      colour: "Orange",
      output: "Stereo Out",
      sends: "Bus 7 −inf unless the bed is thin",
      inserts: [
        waves(1, "Waves SSL G-Channel", "HPF 100 Hz, dip 1 kHz vs keys"),
        waves(2, "Waves API 2500", "Soft, 1–2 dB GR"),
      ],
    },
    {
      name: "AUX Bus 5 Orchestra",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "Bus 8 already on sources; keep this bus drier",
      inserts: [
        waves(1, "Waves SSL G-Equalizer", "HPF 90 Hz, air 12 kHz"),
        waves(2, "Waves S1 Stereo Imager", "Modest width; check arrangement vs keys"),
      ],
    },
    {
      name: "AUX Bus 7 Parallel crush",
      type: "Aux",
      colour: "Red",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves CLA-76", "All-buttons-in, slam, then blend under drums/guitars"),
        waves(2, "Waves SSL G-Channel", "HPF 120 Hz so crush does not add rumble"),
      ],
    },
    {
      name: "AUX Bus 8 Plate / hall",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves H-Reverb / Renaissance Reverb", "Plate 1.4–1.8 s for music, 100% wet"),
        waves(2, "Waves SSL G-Channel", "HPF 200 Hz, LPF 8 kHz so tails stay dark"),
      ],
    },
    {
      name: "AUX Bus 9 Delay throws",
      type: "Aux",
      colour: "Blue",
      output: "Stereo Out",
      sends: "None",
      inserts: [
        waves(1, "Waves H-Delay", "1/8 dotted analog, ping-pong for leads"),
        waves(2, "Waves C6", "Duck the delay when the dry lead is in"),
      ],
    },
    {
      name: "Stereo Out Mixbus",
      type: "Aux",
      colour: "White",
      output: "Stereo Out",
      sends: "Then AI Mastering suite — do not slam L2 here",
      inserts: [
        waves(1, "Waves NLS Buss", "Spike, drive until it kisses, mix 40%"),
        waves(2, "Waves SSL G-Master Buss Compressor", "2:1 or 4:1, Auto release, 1–2 dB GR"),
        waves(3, "Waves C6", "Wide band catch 200–400 Hz mud and 3–5 kHz fizz"),
        waves(4, "Waves L2 Ultramaximizer", "Ceiling −1 dBTP, threshold only for peaks — leave −6 dBFS average for mastering"),
      ],
    },
  ],
};

export const mixingTemplates = [
  logicEdmMixTemplate,
  logicWavesMultiInstrumentTemplate,
  logicStockEdmTemplate,
  logicStockVocalTemplate,
  abletonEdmTemplate,
  niKompleteLogicTemplate,
];

export type WebTemplateLink = {
  id: string;
  name: string;
  kind: "paid-official" | "free-official";
  vendor: string;
  daw: string;
  notes: string;
  url: string;
};

export const internetTemplateLinks: WebTemplateLink[] = [
  {
    id: "sd-shop",
    name: "Sean Divine shop (all templates & chains)",
    kind: "paid-official",
    vendor: "Sean Divine",
    daw: "Logic / Cubase / Pro Tools",
    notes: "Official store. Do not use leaked or cracked copies.",
    url: "https://seandivine.com/shop/",
  },
  {
    id: "sd-one",
    name: "Template One (stock plugins)",
    kind: "paid-official",
    vendor: "Sean Divine",
    daw: "Logic Pro, Cubase, Pro Tools",
    notes: "$34.99 on his site. Hip hop / R&B / pop / EDM session template.",
    url: "https://seandivine.com/downloads/divine-mixing-template-one/",
  },
  {
    id: "sd-waves",
    name: "Waves Template",
    kind: "paid-official",
    vendor: "Sean Divine",
    daw: "Logic Pro, Cubase, Pro Tools",
    notes: "Needs a licensed Waves Gold + SSL 4000 set. Buy the template + your Waves licence.",
    url: "https://seandivine.com/downloads/divine-mixing-waves-template/",
  },
  {
    id: "sd-ssl",
    name: "SSL Native Template",
    kind: "paid-official",
    vendor: "Sean Divine",
    daw: "Logic Pro",
    notes: "Needs SSL Native Channel Strip 2 + Bus Compressor 2.",
    url: "https://seandivine.com/downloads/divine-mixing-ssl-native-template/",
  },
  {
    id: "sd-stock-vox",
    name: "Mixing hip hop vocals with stock plugins (free session)",
    kind: "free-official",
    vendor: "Sean Divine",
    daw: "Logic Pro",
    notes: "He gives this tutorial session away on his site. Unlock on the page — not Template One.",
    url: "https://seandivine.com/mixing-hip-hop-vocals-stock-plugins/",
  },
  {
    id: "sd-fab",
    name: "Mixing rap vocals — free FabFilter presets",
    kind: "free-official",
    vendor: "Sean Divine",
    daw: "Any DAW with FabFilter",
    notes: "Official free preset pack from the tutorial series.",
    url: "https://seandivine.com/mixing-rap-vocals-free-fabfilter-presets/",
  },
  {
    id: "sd-rnb",
    name: "Pop R&B vocal chain tutorial (free StudioRack preset)",
    kind: "free-official",
    vendor: "Sean Divine",
    daw: "Logic + Waves StudioRack",
    notes: "Free tutorial download; Platinum + F6 required for that preset.",
    url: "https://seandivine.com/pop-rnb-vocal-chain-tutorial-series/",
  },
  {
    id: "ni-komplete",
    name: "Native Instruments Komplete (official)",
    kind: "paid-official",
    vendor: "Native Instruments",
    daw: "Logic / Live / Maschine",
    notes: "Buy and install via Native Access. The Dutcheyy NI mix recipe is in the production suite.",
    url: "https://www.native-instruments.com/en/products/komplete/bundles/komplete-15/",
  },
  {
    id: "apple-logic-templates",
    name: "Logic Pro built-in templates",
    kind: "free-official",
    vendor: "Apple",
    daw: "Logic Pro",
    notes: "File → New from Template (Electronic, Hip Hop, Songwriter). Already on your Mac with Logic.",
    url: "https://support.apple.com/guide/logicpro/create-projects-from-templates-lgcpb1a1ea0e/mac",
  },
];

export function mixingTemplateMarkdown(template: MixingTemplate) {
  const lines = [
    `# ${template.name}`,
    "",
    `${template.daw} · ${template.sampleRate} · ${template.bitDepth}`,
    "",
    template.notes,
    "",
    "## Buses",
    ...template.buses.map((bus) => `- ${bus}`),
    "",
    "## Channels",
  ];
  for (const channel of template.channels) {
    lines.push(
      "",
      `### ${channel.name}`,
      `- Type: ${channel.type}`,
      `- Instrument: ${channel.instrument || "—"}`,
      `- Colour: ${channel.colour}`,
      `- Output: ${channel.output}`,
      `- Sends: ${channel.sends}`,
      "- Inserts:",
      ...channel.inserts.map(
        (insert) => `  ${insert.slot}. [${insert.house}] ${insert.plugin} — ${insert.setting}`,
      ),
    );
  }
  lines.push(
    "",
    "## Save in Logic Pro",
    "1. File → New (Empty Project), 48 kHz.",
    "2. Create the audio / instrument / aux tracks above.",
    "3. Options → Audio → I/O Labels if you want Bus 1–7 named.",
    "4. File → Save as Template… → User Templates → Dutcheyy EDM Mix.",
    "5. After the mix, apply a destination on Studio → AI Mastering suite.",
    "",
  );
  return lines.join("\n");
}
