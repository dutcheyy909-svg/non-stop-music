import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { readSession } from "@/lib/session";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dutcheyy Records — Non-Stop",
  description: "Sync licensing, radio, catalogue and A&R operating system.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await readSession();
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AppShell sessionName={session?.name}>{children}</AppShell>
      </body>
    </html>
  );
}
