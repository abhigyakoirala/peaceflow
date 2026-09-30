export type Flow = "Light" | "Medium" | "Heavy";
export type Period = {
  id: string;
  start: string;
  end: string;
  flow: Flow;
  symptoms: string[];
};
export type Entry = {
  id: string;
  date: string;
  title: string;
  body: string;
  mood: string;
};
export type Data = {
  version: 1;
  periods: Period[];
  entries: Entry[];
  saved: string[];
  welcomed: boolean;
};
export const emptyData = (): Data => ({
  version: 1,
  periods: [],
  entries: [],
  saved: [],
  welcomed: false,
});
const DAY = 86400000;
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export function dayNumber(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error("Use YYYY-MM-DD for dates.");
  const n = Date.parse(`${value}T12:00:00Z`);
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0, 10) !== value)
    throw new Error("Enter a real calendar date.");
  return Math.floor(n / DAY);
}
export const addDays = (value: string, days: number) =>
  new Date((dayNumber(value) + days) * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) =>
  dayNumber(b) - dayNumber(a);
export const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export function validatePeriod(
  period: Period,
  periods: Period[],
  now = today(),
): string | null {
  try {
    dayNumber(period.start);
    dayNumber(period.end);
    if (period.start > now || period.end > now)
      return "Record dates up to today. Future dates are estimates, not records.";
    if (period.end < period.start)
      return "The end date must be on or after the start date.";
    if (
      periods.some(
        (p) =>
          p.id !== period.id && period.start <= p.end && period.end >= p.start,
      )
    )
      return "These dates overlap an existing period. Edit that record instead.";
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return Math.round(
    sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2,
  );
}
export function prediction(periods: Period[], now = today()) {
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  const last = sorted.at(-1);
  const intervals = sorted
    .slice(1)
    .map((p, i) => daysBetween(sorted[i].start, p.start))
    .slice(-6);
  const cycleDay = last ? daysBetween(last.start, now) + 1 : null;
  // Never silently discard unusual intervals: they can indicate missed logs or variable cycles.
  if (!last || intervals.length < 2)
    return {
      cycleDay,
      next: null,
      typical: null,
      range: null,
      reason: "Log at least 3 period start dates to see a personal estimate.",
    };
  const typical = median(intervals);
  if (intervals.some((n) => n < 15 || n > 90))
    return {
      cycleDay,
      next: null,
      typical: null,
      range: null,
      reason:
        "Your recorded dates vary widely. Review the history; an estimate would be unreliable.",
    };
  const spread = Math.max(...intervals) - Math.min(...intervals);
  const next = addDays(last.start, typical);
  const range = [
    addDays(last.start, Math.min(...intervals)),
    addDays(last.start, Math.max(...intervals)),
  ];
  return {
    cycleDay,
    next,
    typical,
    range,
    reason:
      next < now
        ? "The estimated date has passed. Log a new period when it starts; dates can vary."
        : spread > 7
          ? "Your recorded cycles vary. Treat this as a rough guide."
          : `Based on ${intervals.length} recorded cycle intervals. Dates can vary.`,
  };
}
export function parseData(raw: string): Data {
  const d = JSON.parse(raw);
  if (
    d?.version !== 1 ||
    !Array.isArray(d.periods) ||
    !Array.isArray(d.entries) ||
    !Array.isArray(d.saved) ||
    typeof d.welcomed !== "boolean"
  )
    throw new Error(
      "Stored data could not be read. It has not been overwritten.",
    );
  for (const p of d.periods) {
    if (
      typeof p.id !== "string" ||
      !["Light", "Medium", "Heavy"].includes(p.flow) ||
      !Array.isArray(p.symptoms) ||
      !p.symptoms.every((s: unknown) => typeof s === "string")
    )
      throw new Error("Invalid period record.");
    dayNumber(p.start);
    dayNumber(p.end);
    if (p.end < p.start) throw new Error("Invalid period dates.");
  }
  for (const e of d.entries) {
    if (
      !["id", "date", "title", "body", "mood"].every(
        (k) => typeof e[k] === "string",
      )
    )
      throw new Error("Invalid journal record.");
    dayNumber(e.date);
  }
  if (!d.saved.every((s: unknown) => typeof s === "string"))
    throw new Error("Invalid saved posts.");
  return d;
}
