import { NextResponse } from "next/server";
import { opportunitiesFromCaptured, mergeOpportunities } from "@/lib/browse-ai";
import { readStore, updateStore } from "@/lib/store";

export async function POST(request: Request) {
  const secret = process.env.BROWSE_AI_WEBHOOK_SECRET;
  if (secret) {
    const sent = request.headers.get("authorization") || request.headers.get("x-browse-ai-secret") || "";
    if (sent.replace(/^Bearer\s+/i, "") !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const current = await readStore();
  const incoming = opportunitiesFromCaptured(
    body,
    current.tracks.flatMap((track) => track.tags),
  );
  if (incoming.length) {
    await updateStore((store) => ({
      ...store,
      opportunities: mergeOpportunities(store.opportunities, incoming),
    }));
  }
  return NextResponse.json({ ok: true, imported: incoming.length });
}
