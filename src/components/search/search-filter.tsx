import { Search, X } from "lucide-react"
import { useMemo, useState } from "react"
import { TopicCard } from "@/components/topics/topic-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTopics } from "@/context/TopicsContext"
import { STATUS_LABEL } from "@/lib/stats"
import { CATEGORIES, MONTHS, PRIORITIES, STATUSES } from "@/types"

const ALL = "all"

export function SearchFilter() {
  const { topics } = useTopics()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>(ALL)
  const [category, setCategory] = useState<string>(ALL)
  const [month, setMonth] = useState<string>(ALL)
  const [priority, setPriority] = useState<string>(ALL)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return topics.filter((t) => {
      if (status !== ALL && t.status !== status) return false
      if (category !== ALL && t.category !== category) return false
      if (month !== ALL && t.month !== month) return false
      if (priority !== ALL && t.priority !== priority) return false
      if (q) {
        const haystack = `${t.title} ${t.notes}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [topics, query, status, category, month, priority])

  const hasActiveFilters =
    query || status !== ALL || category !== ALL || month !== ALL || priority !== ALL

  function clearFilters() {
    setQuery("")
    setStatus(ALL)
    setCategory(ALL)
    setMonth(ALL)
    setPriority(ALL)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topic titles and notes..."
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v ?? ALL)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={(v) => setCategory(v ?? ALL)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={(v) => setMonth(v ?? ALL)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All months</SelectItem>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(v) => setPriority(v ?? ALL)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} topic{results.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {results.map((topic) => (
          <TopicCard key={topic.id} topic={topic} showCategory showMonth />
        ))}
        {results.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No topics match your filters.
          </p>
        )}
      </div>
    </div>
  )
}
