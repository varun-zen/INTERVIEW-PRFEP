import { SEED_TOPICS } from "@/data/seed"
import type { ExportedData, Topic } from "@/types"

export const STORAGE_KEYS = {
  topics: "study-tracker:topics",
  theme: "study-tracker:theme",
  lastTab: "study-tracker:last-tab",
} as const

const EXPORT_VERSION = 1

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage unavailable or quota exceeded — fail silently, in-memory
    // state still works for the rest of the session.
  }
}

function isValidTopic(value: unknown): value is Topic {
  if (typeof value !== "object" || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === "string" &&
    typeof t.category === "string" &&
    typeof t.month === "string" &&
    typeof t.title === "string" &&
    typeof t.status === "string" &&
    typeof t.notes === "string" &&
    typeof t.priority === "string"
  )
}

/**
 * Loads topics from localStorage, merging in any seed topics that aren't
 * present yet (e.g. the roadmap grew) without ever discarding saved progress.
 */
export function loadTopics(): Topic[] {
  let stored: Topic[] = []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.topics)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        stored = parsed.filter(isValidTopic)
      }
    }
  } catch {
    stored = []
  }

  if (stored.length === 0) {
    return SEED_TOPICS
  }

  const knownIds = new Set(stored.map((t) => t.id))
  const missingFromSeed = SEED_TOPICS.filter((t) => !knownIds.has(t.id))
  return [...stored, ...missingFromSeed]
}

export function saveTopics(topics: Topic[]): void {
  writeJson(STORAGE_KEYS.topics, topics)
}

export function exportTopicsFile(topics: Topic[]): void {
  const payload: ExportedData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    topics,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const dateStamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `study-tracker-backup-${dateStamp}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function parseImportedFile(file: File): Promise<Topic[]> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }

  const candidate = Array.isArray(parsed)
    ? parsed
    : (parsed as Partial<ExportedData>)?.topics

  if (!Array.isArray(candidate)) {
    throw new Error("This doesn't look like a study tracker export.")
  }

  const topics = candidate.filter(isValidTopic)
  if (topics.length === 0) {
    throw new Error("No valid topics were found in that file.")
  }

  return topics
}
