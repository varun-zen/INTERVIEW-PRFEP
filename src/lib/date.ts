import { MONTHS, type Month } from "@/types"

const MONTH_START: Record<Month, Date> = {
  "Oct 2026": new Date(2026, 9, 1),
  "Nov 2026": new Date(2026, 10, 1),
  "Dec 2026": new Date(2026, 11, 1),
  "Jan 2027": new Date(2027, 0, 1),
  "Feb 2027": new Date(2027, 1, 1),
  "Mar 2027": new Date(2027, 2, 1),
}

function monthEnd(month: Month): Date {
  const start = MONTH_START[month]
  return new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999)
}

export type FocusState = "upcoming" | "active" | "past"

export interface FocusMonth {
  month: Month
  state: FocusState
  daysUntilStart?: number
  daysRemaining?: number
}

export function getFocusMonth(today: Date = new Date()): FocusMonth {
  const first = MONTHS[0]
  const last = MONTHS[MONTHS.length - 1]

  if (today < MONTH_START[first]) {
    const daysUntilStart = Math.ceil(
      (MONTH_START[first].getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { month: first, state: "upcoming", daysUntilStart }
  }

  if (today > monthEnd(last)) {
    return { month: last, state: "past" }
  }

  for (const month of MONTHS) {
    if (today >= MONTH_START[month] && today <= monthEnd(month)) {
      const daysRemaining = Math.ceil(
        (monthEnd(month).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      return { month, state: "active", daysRemaining }
    }
  }

  return { month: first, state: "upcoming" }
}

export function isMonthPast(month: Month, today: Date = new Date()): boolean {
  return today > monthEnd(month)
}

export function isMonthActive(month: Month, today: Date = new Date()): boolean {
  return today >= MONTH_START[month] && today <= monthEnd(month)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Number of calendar days in the real month a roadmap Month label refers to. */
export function calendarMonthLength(month: Month): number {
  const start = MONTH_START[month]
  return new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
}
