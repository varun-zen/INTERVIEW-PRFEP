import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { ScheduledTopicRow } from "@/components/dashboard/scheduled-topic-row"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/lib/date"
import { computeTopicSchedule, getScheduleRange } from "@/lib/schedule"
import { computeStats, groupByCategory, groupByMonth } from "@/lib/stats"
import { cn } from "@/lib/utils"
import { CATEGORIES, MONTHS, type Topic } from "@/types"

export function CategoryProgressList({ topics }: { topics: Topic[] }) {
  const grouped = groupByCategory(topics)
  const schedule = useMemo(() => computeTopicSchedule(topics), [topics])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(category: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {CATEGORIES.map((category) => {
        const categoryTopics = grouped.get(category) ?? []
        if (categoryTopics.length === 0) return null
        const stats = computeStats(categoryTopics)
        const isOpen = expanded.has(category)
        const range = getScheduleRange(schedule, categoryTopics)
        const byMonth = groupByMonth(categoryTopics)
        const monthsWithTopics = MONTHS.filter(
          (m) => (byMonth.get(m)?.length ?? 0) > 0
        )

        return (
          <div key={category} className="rounded-lg border">
            <button
              type="button"
              onClick={() => toggle(category)}
              className="flex w-full flex-col gap-1.5 p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                  {category}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {stats.done}/{stats.total} · {stats.percent}%
                </span>
              </div>
              <Progress value={stats.percent} className="ml-6" />
              {range && (
                <span className="ml-6 text-xs text-muted-foreground">
                  {formatDate(range.start)} → {formatDate(range.end)}
                </span>
              )}
            </button>

            {isOpen && (
              <div className="border-t p-3">
                <ScrollArea className="h-96 pr-3">
                  <div className="flex flex-col gap-4">
                    {monthsWithTopics.map((month) => (
                      <div key={month} className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {month}
                        </span>
                        <div className="flex flex-col gap-2">
                          {(byMonth.get(month) ?? []).map((topic) => (
                            <ScheduledTopicRow
                              key={topic.id}
                              topic={topic}
                              range={schedule.get(topic.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
