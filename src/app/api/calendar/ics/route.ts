import { NextResponse } from "next/server";
import { collectCalendarEvents, toIcs } from "@/lib/calendar";
import { readStore } from "@/lib/store";

export async function GET() {
  const store = await readStore();
  const ics = toIcs(collectCalendarEvents(store));
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="non-stop-reminders.ics"',
      "Cache-Control": "no-store",
    },
  });
}
