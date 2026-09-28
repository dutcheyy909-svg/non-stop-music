import Link from "next/link";
import { addCalendarReminder, deleteCalendarReminder } from "@/lib/actions";
import { Panel } from "@/components/Ui";
import {
  buildMonthGrid,
  collectCalendarEvents,
  googleTemplateUrl,
  monthLabel,
  shiftMonth,
  todayIso,
  upcomingEvents,
} from "@/lib/calendar";
import { readStore } from "@/lib/store";

const fieldClass = "mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const store = await readStore();
  const events = collectCalendarEvents(store);
  const today = todayIso();
  const parsed = /^\d{4}-\d{2}$/.test(monthParam || "") ? monthParam!.split("-").map(Number) : today.split("-").map(Number);
  const year = parsed[0];
  const month = parsed[1];
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const grid = buildMonthGrid(year, month, events);
  const upcoming = upcomingEvents(events, today, 12);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">BUSINESS</p>
        <h1 className="mt-1 text-3xl font-semibold">Reminder calendar</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Pitch follow-ups, funding deadlines, and briefs land here. Add your own dates, then push them into Google
          Calendar so the phone reminder fires. Live two-way Google login needs a Google Cloud OAuth client — until
          that is set, download the .ics and import it (Google Calendar → Settings → Import & export).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/api/calendar/ics"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
          >
            Download .ics for Google
          </a>
          <a
            href="https://calendar.google.com/calendar/u/0/r"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm"
          >
            Open Google Calendar
          </a>
          <a
            href="https://calendar.google.com/calendar/u/0/r/settings/export"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300"
          >
            Google import desk
          </a>
        </div>
      </div>

      <Panel title="Add a reminder">
        <form action={addCalendarReminder} className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <label className="text-sm lg:col-span-2">
            What
            <input name="title" required placeholder="Follow up BBC Introducing" className={fieldClass} />
          </label>
          <label className="text-sm">
            Date
            <input name="date" type="date" required defaultValue={today} className={fieldClass} />
          </label>
          <label className="text-sm">
            Time (optional)
            <input name="time" type="time" className={fieldClass} />
          </label>
          <label className="text-sm">
            Ping hours before
            <input name="alarmHours" type="number" min={1} max={168} defaultValue={24} className={fieldClass} />
          </label>
          <label className="text-sm lg:col-span-6">
            Notes
            <input name="notes" placeholder="EPK + track, confirm email" className={fieldClass} />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500 lg:col-span-6">
            Save on this calendar
          </button>
        </form>
      </Panel>

      <Panel
        title={monthLabel(year, month)}
        action={
          <div className="flex gap-3 text-sm">
            <Link
              href={`/calendar?month=${String(prev.year)}-${String(prev.month).padStart(2, "0")}`}
              className="text-fuchsia-300 underline"
            >
              Previous
            </Link>
            <Link href="/calendar" className="text-zinc-400 underline">
              Today
            </Link>
            <Link
              href={`/calendar?month=${String(next.year)}-${String(next.month).padStart(2, "0")}`}
              className="text-fuchsia-300 underline"
            >
              Next
            </Link>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          {grid.weekdays.map((day) => (
            <div key={day} className="bg-fuchsia-950/70 px-2 py-2 text-center text-[10px] tracking-[0.16em] text-fuchsia-200">
              {day}
            </div>
          ))}
          {grid.cells.map((cell, index) => (
            <div
              key={`${cell.date || "empty"}-${index}`}
              className={`min-h-[110px] bg-black/70 p-2 ${cell.date === today ? "ring-1 ring-inset ring-fuchsia-400/70" : ""}`}
            >
              {cell.day ? <p className="text-xs text-zinc-500">{cell.day}</p> : null}
              <ul className="mt-1 space-y-1">
                {cell.events.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <a href={googleTemplateUrl(event)} target="_blank" rel="noreferrer" className="block truncate text-[11px] text-fuchsia-200 hover:underline">
                      {event.time ? `${event.time} ` : ""}
                      {event.title}
                    </a>
                  </li>
                ))}
                {cell.events.length > 3 ? (
                  <li className="text-[11px] text-zinc-500">+{cell.events.length - 3} more</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Upcoming — add each one to Google">
        {upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((event) => (
              <li key={event.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 p-3">
                <div>
                  <p className="text-xs text-fuchsia-300">
                    {event.date}
                    {event.time ? ` · ${event.time}` : ""} · {event.source}
                  </p>
                  <p className="font-medium">{event.title}</p>
                  {event.notes ? <p className="mt-1 text-sm text-zinc-400">{event.notes}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={googleTemplateUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm hover:bg-fuchsia-500"
                  >
                    Add to Google
                  </a>
                  <Link href={event.href} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm">
                    Open in Non-Stop
                  </Link>
                  {event.editable ? (
                    <form action={deleteCalendarReminder}>
                      <input type="hidden" name="id" value={event.id} />
                      <button className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-400">
                        Remove
                      </button>
                    </form>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">Nothing dated from today — add a reminder or log a pitch so a follow-up appears.</p>
        )}
      </Panel>
    </div>
  );
}
