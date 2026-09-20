import type { Category, Month, Status, Topic } from "@/types"

export interface ProgressStats {
  total: number
  done: number
  inProgress: number
  notStarted: number
  percent: number
}

export function computeStats(topics: Topic[]): ProgressStats {
  const total = topics.length
  const done = topics.filter((t) => t.status === "done").length
  const inProgress = topics.filter((t) => t.status === "in-progress").length
  const notStarted = total - done - inProgress
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return { total, done, inProgress, notStarted, percent }
}

export function groupByCategory(topics: Topic[]): Map<Category, Topic[]> {
  const map = new Map<Category, Topic[]>()
  for (const topic of topics) {
    const list = map.get(topic.category) ?? []
    list.push(topic)
    map.set(topic.category, list)
  }
  return map
}

export function groupByMonth(topics: Topic[]): Map<Month, Topic[]> {
  const map = new Map<Month, Topic[]>()
  for (const topic of topics) {
    const list = map.get(topic.month) ?? []
    list.push(topic)
    map.set(topic.month, list)
  }
  return map
}

export const STATUS_LABEL: Record<Status, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  done: "Done",
}
