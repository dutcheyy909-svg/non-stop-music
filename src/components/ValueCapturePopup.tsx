"use client";

import { useEffect, useState } from "react";
import { saveFanLead } from "@/lib/actions";

const STORAGE_KEY = "dutcheyy-value-gate";

export function ValueCapturePopup() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  function close(persist: boolean) {
    setOpen(false);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {
        /* ignore */
      }
    }
  }

  async function onSubmit(formData: FormData) {
    setError("");
    const result = await saveFanLead(formData);
    if (!result.ok) {
      setError(result.error || "Could not save.");
      return;
    }
    setDone(true);
    window.setTimeout(() => close(true), 1600);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-labelledby="value-gate-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-fuchsia-400/40 bg-[#120018] p-5 shadow-[0_0_60px_rgba(192,38,211,0.25)]"
      >
        {done ? (
          <p className="py-8 text-center text-lg font-semibold text-fuchsia-100">
            You are in. Open Studio → Production suite and Pitch → Dutcheyy Radio.
          </p>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.25em] text-fuchsia-300">DUTCHEYY RECORDS</p>
            <h2 id="value-gate-title" className="mt-1 text-2xl font-semibold">
              Free producer pack — stay in the OS
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Give your details (18+) and we unlock the mix cheat sheet, Logic / NI templates, mastering LUFS desk,
              and Dutcheyy Radio submission window. No need to leave the site.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              <li>Cut vs boost EQ cheat sheet</li>
              <li>Logic + Waves + Native Instruments recipes</li>
              <li>AI mastering destinations for Spotify / club</li>
            </ul>
            <form action={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-1">
                Name
                <input name="name" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
              </label>
              <label className="text-sm">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Age
                <input
                  name="age"
                  type="number"
                  min={18}
                  max={99}
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Country
                <input name="country" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                City / area
                <input name="city" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                I am a
                <select name="role" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
                  <option value="artist">Artist</option>
                  <option value="producer">Producer</option>
                  <option value="dj">DJ</option>
                  <option value="manager">Manager</option>
                  <option value="other">Something else</option>
                </select>
              </label>
              <label className="flex gap-2 text-xs text-zinc-400 sm:col-span-2">
                <input type="checkbox" name="consent" required className="mt-0.5" />
                I am 18 or over and agree Dutcheyy Records can email me about radio, templates and releases. You can
                ask to be deleted any time.
              </label>
              {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
                  Unlock the pack
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-400"
                  onClick={() => close(true)}
                >
                  Not now
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
