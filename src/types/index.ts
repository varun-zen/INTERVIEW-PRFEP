export const CATEGORIES = [
  "DSA",
  "Core Java",
  "Spring & Backend",
  "Databases",
  "Kafka",
  "Redis",
  "System Design - HLD",
  "System Design - LLD",
  "Security & Observability",
  "AWS & DevOps",
  "Capstone Project",
  "Interview Prep",
] as const

export type Category = (typeof CATEGORIES)[number]

export const MONTHS = [
  "Oct 2026",
  "Nov 2026",
  "Dec 2026",
  "Jan 2027",
  "Feb 2027",
  "Mar 2027",
] as const

export type Month = (typeof MONTHS)[number]

export const STATUSES = ["not-started", "in-progress", "done"] as const
export type Status = (typeof STATUSES)[number]

export const PRIORITIES = ["low", "medium", "high"] as const
export type Priority = (typeof PRIORITIES)[number]

export interface Topic {
  id: string
  category: Category
  month: Month
  title: string
  status: Status
  notes: string
  priority: Priority
  resourceLink?: string
}

export interface ExportedData {
  version: number
  exportedAt: string
  topics: Topic[]
}
