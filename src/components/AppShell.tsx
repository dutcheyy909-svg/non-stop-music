"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLockup } from "./BrandLockup";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/outreach", label: "Outreach desk" },
  { href: "/opportunities", label: "Opportunity Finder" },
  { href: "/pipeline", label: "Sync Pipeline" },
  { href: "/anr", label: "A&R Business" },
  { href: "/catalog", label: "Catalogue Vault" },
  { href: "/crm", label: "CRM" },
  { href: "/engine", label: "AI Engine" },
  { href: "/metadata", label: "Metadata Centre" },
  { href: "/data", label: "Data Management" },
  { href: "/epk", label: "EPK" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_#3b0764_0%,_#07010d_42%,_#020006_100%)] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-30 mix-blend-screen bg-[url('/brand/logo-seal.jpg')] bg-[length:42%] bg-right-top bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-screen bg-[url('/brand/logo-portrait.jpg')] bg-cover bg-center blur-3xl" />
      <div className="relative mx-auto flex min-h-full max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-fuchsia-500/20 bg-black/50 p-5 md:block">
          <Link href="/" className="flex items-center gap-3">
            <BrandLockup size={64} />
            <div>
              <p className="text-[10px] tracking-[0.28em] text-fuchsia-300">EST. 2026</p>
              <p className="font-semibold leading-tight">DUTCHEYY</p>
              <p className="text-xs text-fuchsia-200/80">Levitate × Non-Stop</p>
            </div>
          </Link>
          <nav className="mt-8 space-y-1 text-sm">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 ${
                    active
                      ? "bg-fuchsia-500/20 text-white ring-1 ring-fuchsia-400/40"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-fuchsia-500/20 bg-black/40 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center gap-3 md:hidden">
              <BrandLockup size={40} />
              <span className="font-semibold">Levitate</span>
            </div>
            <p className="hidden text-xs tracking-[0.2em] text-fuchsia-200/80 md:block">
              INDEPENDENT · GLOBAL · FUTURE FOCUSED
            </p>
            <BrandLockup size={44} />
          </header>
          <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
