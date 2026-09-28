"use client";

import Link from "next/link";
import { useState } from "react";
import { buyPromoPackage } from "@/lib/actions";
import { gbp } from "@/lib/dutcheyy-radio";
import { promoPackages, promoTabs, type PromoTab } from "@/lib/promo-packages";

export function DealTabs({ loggedIn }: { loggedIn: boolean }) {
  const [tab, setTab] = useState<PromoTab>("radio");
  const packs = promoPackages.filter((item) => item.tab === tab);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {promoTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === item.id ? "bg-fuchsia-600 text-white" : "border border-fuchsia-400/40 text-zinc-300"
            }`}
          >
            <span className={`menu-mark ${tab === item.id ? "is-on" : ""}`}>{item.label}</span>
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-zinc-400">
        All three tabs stay on this page: Radio, Spotify submissions, and Blogs. Logged-in users land here after sign-in.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {packs.map((pack) => (
          <article key={pack.id} className="rounded-2xl border border-fuchsia-400/25 bg-black/40 p-5">
            <h3 className="text-lg font-semibold">{pack.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-fuchsia-200">{gbp(pack.priceGbp)}</p>
            <p className="mt-2 text-sm text-zinc-400">{pack.blurb}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {pack.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {loggedIn ? (
                <form action={buyPromoPackage}>
                  <input type="hidden" name="packageId" value={pack.id} />
                  <button className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500">
                    Book this pack
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
                >
                  Log in to book
                </Link>
              )}
              <Link href={pack.deskHref} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
                Open desk
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
