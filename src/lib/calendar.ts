import type { Store } from "./types";

export type CalendarSource = "reminder" | "pitch" | "funding" | "brief";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  notes: string;
  href: string;
  source: CalendarSource;
  alarmHours: number;
  editable: boolean;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function isIsoDate(value: string) {
  return DATE_RE.test(value);
}

export function todayIso(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day + days);
  const next = new Date(utc);
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

export function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function shiftMonth(year: number, month: number, delta: number) {
  const utc = Date.UTC(year, month - 1 + delta, 1);
  const next = new Date(utc);
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
}

export function collectCalendarEvents(store: Store): CalendarEvent[] {
  const reminders = (store.calendarReminders ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    time: item.time,
    notes: item.notes,
    href: "/calendar",
    source: "reminder" as const,
    alarmHours: item.alarmHours || 24,
    editable: true,
  }));

  const pitches = (store.pitches ?? [])
    .filter((pitch) => isIsoDate(pitch.followUpAt) && pitch.status !== "passed")
    .map((pitch) => ({
      id: `pitch-${pitch.id}`,
      title: `Follow up: ${pitch.trackTitle} → ${pitch.targetName}`,
      date: pitch.followUpAt,
      time: "",
      notes: pitch.notes,
      href: "/pipeline",
      source: "pitch" as const,
      alarmHours: 24,
      editable: false,
    }));

  const funding = (store.fundingRounds ?? [])
    .filter((round) => isIsoDate(round.deadline) && round.status !== "closed")
    .map((round) => ({
      id: `fund-${round.id}`,
      title: `${round.funder}: ${round.programme}`,
      date: round.deadline,
      time: "",
      notes: `${round.amount}. ${round.fit}`,
      href: "/funding",
      source: "funding" as const,
      alarmHours: 48,
      editable: false,
    }));

  const briefs = (store.opportunities ?? [])
    .filter((item) => isIsoDate(item.deadline) && item.status !== "closed")
    .map((item) => ({
      id: `brief-${item.id}`,
      title: `Brief deadline: ${item.title}`,
      date: item.deadline,
      time: "",
      notes: `${item.source} · ${item.budget || "fee TBC"}`,
      href: "/opportunities",
      source: "brief" as const,
      alarmHours: 24,
      editable: false,
    }));

  return [...reminders, ...pitches, ...funding, ...briefs].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate) return byDate;
    return (a.time || "99:99").localeCompare(b.time || "99:99");
  });
}

export function upcomingEvents(events: CalendarEvent[], from = todayIso(), limit = 8) {
  return events.filter((event) => event.date >= from).slice(0, limit);
}

export function overdueEvents(events: CalendarEvent[], from = todayIso()) {
  return events.filter((event) => event.date < from);
}

export function googleTemplateUrl(event: CalendarEvent) {
  const dates = googleDateRange(event.date, event.time);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: [event.notes, event.href ? `Non-Stop: ${event.href}` : ""].filter(Boolean).join("\n"),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildMonthGrid(year: number, month: number, events: CalendarEvent[]) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const startWeekday = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<{ date: string; day: number | null; events: CalendarEvent[] }> = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ date: "", day: null, events: [] });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      date,
      day,
      events: events.filter((event) => event.date === date),
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: "", day: null, events: [] });
  }
  return { weekdays: WEEKDAYS, cells };
}

export function toIcs(events: CalendarEvent[]) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dutcheyy Records//Non-Stop//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Non-Stop reminders",
    "X-WR-TIMEZONE:Europe/London",
  ];
  for (const event of events) {
    lines.push(...eventToIcs(event, stamp));
  }
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function googleDateRange(date: string, time: string) {
  if (TIME_RE.test(time)) {
    const start = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
    const [hours, minutes] = time.split(":").map(Number);
    const endMinutes = hours * 60 + minutes + 60;
    const endH = String(Math.floor(endMinutes / 60) % 24).padStart(2, "0");
    const endM = String(endMinutes % 60).padStart(2, "0");
    const endDate = endMinutes >= 24 * 60 ? addDays(date, 1).replace(/-/g, "") : date.replace(/-/g, "");
    return `${start}/${endDate}T${endH}${endM}00`;
  }
  return `${date.replace(/-/g, "")}/${addDays(date, 1).replace(/-/g, "")}`;
}

function eventToIcs(event: CalendarEvent, stamp: string) {
  const uid = `${event.id}@non-stop.dutcheyy`;
  const alarm = Math.max(1, event.alarmHours || 24);
  const lines = ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${stamp}`, `SUMMARY:${icsText(event.title)}`];
  if (TIME_RE.test(event.time)) {
    const start = `${event.date.replace(/-/g, "")}T${event.time.replace(":", "")}00`;
    lines.push(`DTSTART;TZID=Europe/London:${start}`);
    lines.push(`DTEND;TZID=Europe/London:${googleDateRange(event.date, event.time).split("/")[1]}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${event.date.replace(/-/g, "")}`);
    lines.push(`DTEND;VALUE=DATE:${addDays(event.date, 1).replace(/-/g, "")}`);
  }
  if (event.notes) lines.push(`DESCRIPTION:${icsText(event.notes)}`);
  lines.push(
    "BEGIN:VALARM",
    `TRIGGER:-PT${alarm}H`,
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
  );
  return lines;
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
