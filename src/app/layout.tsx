import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dutcheyy Records — Levitate",
  description: "Sync licensing, radio, catalogue and A&R operating system.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
