import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { loadTopics, saveTopics } from "@/lib/storage"
import { STATUSES, type Status, type Topic } from "@/types"

interface TopicsContextValue {
  topics: Topic[]
  updateTopic: (id: string, patch: Partial<Topic>) => void
  cycleStatus: (id: string) => void
  replaceAllTopics: (topics: Topic[]) => void
}

const TopicsContext = createContext<TopicsContextValue | null>(null)

const SAVE_DEBOUNCE_MS = 500

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(() => loadTopics())
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      saveTopics(topics)
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [topics])

  // Flush any pending save immediately on unmount/tab close.
  useEffect(() => {
    const flush = () => saveTopics(topics)
    window.addEventListener("beforeunload", flush)
    return () => window.removeEventListener("beforeunload", flush)
  }, [topics])

  const updateTopic = useCallback((id: string, patch: Partial<Topic>) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    )
  }, [])

  const cycleStatus = useCallback((id: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const currentIndex = STATUSES.indexOf(t.status)
        const next: Status = STATUSES[(currentIndex + 1) % STATUSES.length]
        return { ...t, status: next }
      })
    )
  }, [])

  const replaceAllTopics = useCallback((next: Topic[]) => {
    setTopics(next)
    saveTopics(next)
  }, [])

  const value = useMemo(
    () => ({ topics, updateTopic, cycleStatus, replaceAllTopics }),
    [topics, updateTopic, cycleStatus, replaceAllTopics]
  )

  return (
    <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>
  )
}

export function useTopics(): TopicsContextValue {
  const ctx = useContext(TopicsContext)
  if (!ctx) throw new Error("useTopics must be used within a TopicsProvider")
  return ctx
}
