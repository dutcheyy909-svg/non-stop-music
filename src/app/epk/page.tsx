import { BrandLockup } from "@/components/BrandLockup";
import { saveEpk } from "@/lib/actions";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function EpkPage() {
  const { epk, tracks } = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">EPK</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Panel title="Public face">
          <div className="flex justify-center">
            <BrandLockup size={220} />
          </div>
          <p className="mt-4 text-center text-sm text-zinc-400">{epk.shortBio}</p>
        </Panel>
        <Panel title="Edit press kit">
          <form action={saveEpk} className="grid gap-3">
            <input name="name" defaultValue={epk.name} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <input name="location" defaultValue={epk.location} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <input name="genres" defaultValue={epk.genres} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <textarea name="shortBio" defaultValue={epk.shortBio} rows={3} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <textarea name="longBio" defaultValue={epk.longBio} rows={5} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <input name="website" placeholder="Website" defaultValue={epk.website} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <input name="spotify" placeholder="Spotify" defaultValue={epk.spotify} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <input name="instagram" placeholder="Instagram" defaultValue={epk.instagram} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2" />
            <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium">Save EPK</button>
          </form>
        </Panel>
      </div>
      <Panel title="Featured catalogue">
        <ul className="text-sm text-zinc-300">
          {tracks.map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
