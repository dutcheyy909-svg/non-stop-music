"use client";

import { useEffect } from "react";
import { logPpcEvent } from "@/lib/actions";

export function PpcLink({
  href,
  label,
  page = "/production",
}: {
  href: string;
  label: string;
  page?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-fuchsia-300 underline decoration-fuchsia-500/40"
      onClick={() => {
        const data = new FormData();
        data.set("kind", "click");
        data.set("page", page);
        data.set("href", href);
        data.set("label", label);
        void logPpcEvent(data);
      }}
    >
      {label}
    </a>
  );
}

export function PpcPageHit({ page }: { page: string }) {
  useEffect(() => {
    const data = new FormData();
    data.set("kind", "pageview");
    data.set("page", page);
    data.set("href", page);
    data.set("label", "page");
    void logPpcEvent(data);
  }, [page]);
  return null;
}

export function PpcAdSlot() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return (
      <div className="rounded-xl border border-dashed border-fuchsia-400/30 bg-black/40 px-4 py-6 text-center text-sm text-zinc-400">
        PPC ad slot — set <code className="text-fuchsia-200">NEXT_PUBLIC_ADSENSE_CLIENT</code> to load Google Ads.
        Clicks on shop / plugin links are already logged as pay-per-click events.
      </div>
    );
  }
  return (
    <ins
      className="adsbygoogle block min-h-[90px]"
      data-ad-client={client}
      data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || ""}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
