"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLockup } from "./BrandLockup";
import { ValueCapturePopup } from "./ValueCapturePopup";
import { logoutUser } from "@/lib/actions";

const menus = [
  {
    label: "Home",
    items: [{ href: "/", label: "Dashboard" }],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/catalog", label: "Catalogue Vault" },
      { href: "/metadata", label: "Metadata Centre" },
      { href: "/epk", label: "EPK" },
      { href: "/epk/public", label: "Public EPK" },
    ],
  },
  {
    label: "Pitch",
    items: [
      { href: "/outreach", label: "Outreach desk" },
      { href: "/radio", label: "Radio" },
      { href: "/station", label: "Dutcheyy Radio" },
      { href: "/promote", label: "Promotion" },
      { href: "/deals", label: "Package deals" },
      { href: "/playlists", label: "Playlist Intelligence" },
      { href: "/djs", label: "DJ submissions" },
      { href: "/spark", label: "Non-Stop Spark" },
      { href: "/analyser", label: "Playlist analyser" },
      { href: "/blogs", label: "EDM Blogs" },
      { href: "/crm", label: "CRM" },
    ],
  },
  {
    label: "Sync",
    items: [
      { href: "/sync-assistant", label: "Sync assistant" },
      { href: "/opportunities", label: "Opportunity Finder" },
      { href: "/pipeline", label: "Sync Pipeline" },
      { href: "/libraries", label: "Libraries" },
    ],
  },
  {
    label: "Connect",
    items: [
      { href: "/metadata", label: "Amuse — ISRC / UPC / pre-release" },
      { href: "/pipeline", label: "That Pitch placements" },
      { href: "/data", label: "Data Management" },
    ],
  },
  {
    label: "Studio",
    items: [
      { href: "/production", label: "Production suite" },
      { href: "/spark", label: "Non-Stop Spark" },
      { href: "/analyser", label: "Playlist analyser" },
      { href: "/vendors", label: "Vendor upload" },
      { href: "/vendors/review", label: "Vendor approvals" },
      { href: "/mastering", label: "AI Mastering suite" },
      { href: "/catalog", label: "Catalogue Vault" },
      { href: "/metadata", label: "Metadata Centre" },
    ],
  },
  {
    label: "Tools 4 Music",
    items: [
      { href: "/tools4music", label: "All desks" },
      { href: "/tools4music#royalties", label: "Royalty calculators" },
      { href: "/tools4music#studio", label: "Studio tools" },
      { href: "/tools4music#names", label: "Name generators" },
      { href: "/tools4music#directories", label: "Directories" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/business", label: "Business tools" },
      { href: "/anr", label: "A&R Business" },
      { href: "/funding", label: "Funding" },
      { href: "/engine", label: "AI Engine" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  children,
  sessionName,
}: {
  children: React.ReactNode;
  sessionName?: string | null;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_#3b0764_0%,_#07010d_42%,_#020006_100%)] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-30 mix-blend-screen bg-[url('/brand/logo-seal.jpg')] bg-[length:42%] bg-right-top bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-screen bg-[url('/brand/logo-portrait.jpg')] bg-cover bg-center blur-3xl" />
      <div className="relative min-h-full">
        <header className="sticky top-0 z-50 border-b border-fuchsia-500/30 bg-black/80 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-2 md:px-6">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <BrandLockup size={44} />
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.28em] text-fuchsia-300">DUTCHEYY RECORDS</p>
                <p className="truncate text-sm font-semibold leading-tight">Non-Stop</p>
              </div>
            </Link>
            <p className="hidden text-[10px] tracking-[0.22em] text-fuchsia-200/80 lg:block">
              INDEPENDENT · GLOBAL · FUTURE FOCUSED
            </p>
            <div className="flex items-center gap-2">
              <Link href="/vendors" className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-medium hover:bg-fuchsia-500">
                Vendor
              </Link>
              {sessionName ? (
                <>
                  <Link href="/deals" className="hidden rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm sm:inline">
                    Deals
                  </Link>
                  <form action={logoutUser}>
                    <button type="submit" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="rounded-lg border border-fuchsia-400/40 px-3 py-1.5 text-sm">
                  Log in
                </Link>
              )}
              <button
                type="button"
                className="rounded-lg border border-fuchsia-400/40 px-3 py-1.5 text-sm md:hidden"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          <nav className="hidden border-t border-fuchsia-500/20 md:flex md:flex-wrap md:items-stretch">
            {menus.map((menu) => {
              const active = menu.items.some((item) => isActive(pathname, item.href));
              const open = openMenu === menu.label;
              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    className={`flex h-10 items-center px-4 text-sm ${
                      active || open ? "text-white" : "text-zinc-300 hover:text-white"
                    }`}
                    onClick={() => setOpenMenu(open ? null : menu.label)}
                  >
                    <span className={`menu-mark ${active || open ? "is-on" : ""}`}>{menu.label}</span>
                  </button>
                  {open ? (
                    <div className="absolute left-0 top-full z-50 min-w-[240px] border border-fuchsia-500/30 bg-black/95 py-1 shadow-2xl shadow-fuchsia-950/40">
                      {menu.items.map((item) => (
                        <Link
                          key={`${menu.label}-${item.href}-${item.label}`}
                          href={item.href}
                          className={`block px-4 py-2 text-sm ${
                            isActive(pathname, item.href) ? "text-white" : "text-zinc-200 hover:text-white"
                          }`}
                        >
                          <span className={`menu-mark ${isActive(pathname, item.href) ? "is-on" : ""}`}>
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          {mobileOpen ? (
            <nav className="max-h-[70vh] overflow-y-auto border-t border-fuchsia-500/20 bg-black/95 px-3 py-3 md:hidden">
              {menus.map((menu) => (
                <div key={menu.label} className="mb-3">
                  <p className="px-2 pb-1 text-[10px] tracking-[0.2em] text-fuchsia-300">{menu.label}</p>
                  {menu.items.map((item) => (
                    <Link
                      key={`m-${menu.label}-${item.href}-${item.label}`}
                      href={item.href}
                      className={`block rounded-lg px-3 py-2 text-sm ${
                        isActive(pathname, item.href) ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      <span className={`menu-mark ${isActive(pathname, item.href) ? "is-on" : ""}`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          ) : null}
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">{children}</main>
        <ValueCapturePopup />
      </div>
    </div>
  );
}
