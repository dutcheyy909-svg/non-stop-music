import { BrandLockup } from "@/components/BrandLockup";
import { readStore } from "@/lib/store";

export default async function PublicEpkPage() {
  const { epk, tracks } = await readStore();
  return (
    <div className="mx-auto max-w-xl space-y-6 py-8 text-center">
      <div className="flex justify-center">
        <BrandLockup size={180} />
      </div>
      <h1 className="text-3xl font-semibold">{epk.name}</h1>
      <p className="text-fuchsia-200">{epk.genres} · {epk.location}</p>
      <p className="text-zinc-300">{epk.longBio}</p>
      <ul className="text-left text-sm">
        {tracks.map((t) => (
          <li key={t.id} className="border-b border-white/10 py-2">
            {t.title} — {t.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
