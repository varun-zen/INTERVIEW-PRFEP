import { calendarMonthLength } from "@/lib/date"
import { groupByMonth } from "@/lib/stats"
import { MONTHS, type Category, type Month, type Topic } from "@/types"

/**
 * The plan's day-by-day schedule is anchored to a fixed calendar date rather
 * than "tomorrow relative to whenever the app is opened" — otherwise the
 * schedule would perpetually drift forward by a day on every visit.
 */
export const PLAN_START_DATE = new Date(2026, 8, 21)

export interface DateRange {
  start: Date
  end: Date
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

interface MonthWindow {
  month: Month
  start: Date
  end: Date
  lengthDays: number
}

function buildMonthWindows(): MonthWindow[] {
  const windows: MonthWindow[] = []
  let cursor = PLAN_START_DATE
  for (const month of MONTHS) {
    const lengthDays = calendarMonthLength(month)
    const start = cursor
    const end = addDays(start, lengthDays - 1)
    windows.push({ month, start, end, lengthDays })
    cursor = addDays(end, 1)
  }
  return windows
}

/**
 * Computes a realistic start/complete-by date for every topic. Each roadmap
 * month keeps its original calendar length but the whole plan is shifted to
 * start at PLAN_START_DATE. Categories scheduled in the same month run in
 * parallel (matching how the roadmap groups them), with that category's
 * topics evenly spaced across the window.
 */
export function computeTopicSchedule(topics: Topic[]): Map<string, DateRange> {
  const schedule = new Map<string, DateRange>()
  const windows = buildMonthWindows()
  const byMonth = groupByMonth(topics)

  for (const window of windows) {
    const monthTopics = byMonth.get(window.month) ?? []
    const byCategory = new Map<Category, Topic[]>()
    for (const topic of monthTopics) {
      const list = byCategory.get(topic.category) ?? []
      list.push(topic)
      byCategory.set(topic.category, list)
    }

    for (const categoryTopics of byCategory.values()) {
      const n = categoryTopics.length
      categoryTopics.forEach((topic, i) => {
        const startOffset = Math.floor((i * window.lengthDays) / n)
        const endOffset = Math.max(
          startOffset,
          Math.floor(((i + 1) * window.lengthDays) / n) - 1
        )
        schedule.set(topic.id, {
          start: addDays(window.start, startOffset),
          end: addDays(window.start, endOffset),
        })
      })
    }
  }

  return schedule
}

export function getScheduleRange(
  schedule: Map<string, DateRange>,
  topics: Topic[]
): DateRange | null {
  let start: Date | null = null
  let end: Date | null = null
  for (const topic of topics) {
    const range = schedule.get(topic.id)
    if (!range) continue
    if (!start || range.start < start) start = range.start
    if (!end || range.end > end) end = range.end
  }
  if (!start || !end) return null
  return { start, end }
}
