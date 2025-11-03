import { differenceInCalendarDays, addDays, format, parseISO } from "date-fns";

export function parse(d: string) {
  return parseISO(d);
}

export function daysBetween(a: string | Date, b: string | Date) {
  return Math.abs(differenceInCalendarDays(
    typeof a === "string" ? parseISO(a) : a,
    typeof b === "string" ? parseISO(b) : b
  ));
}

export function dayAdd(date: string | Date, days: number) {
  const base = typeof date === "string" ? parseISO(date) : date;
  return addDays(base, days);
}

export function formatDay(date: string | Date) {
  const base = typeof date === "string" ? parseISO(date) : date;
  return format(base, "yyyy-MM-dd");
}

export function displayLabel(date: string | Date) {
  const base = typeof date === "string" ? parseISO(date) : date;
  return format(base, "MMM d");
}
