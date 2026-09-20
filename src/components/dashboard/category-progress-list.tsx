import { Progress } from "@/components/ui/progress"
import { computeStats, groupByCategory } from "@/lib/stats"
import { CATEGORIES, type Topic } from "@/types"

export function CategoryProgressList({ topics }: { topics: Topic[] }) {
  const grouped = groupByCategory(topics)

  return (
    <div className="flex flex-col gap-4">
      {CATEGORIES.map((category) => {
        const categoryTopics = grouped.get(category) ?? []
        if (categoryTopics.length === 0) return null
        const stats = computeStats(categoryTopics)
        return (
          <div key={category} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-medium">{category}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {stats.done}/{stats.total} · {stats.percent}%
              </span>
            </div>
            <Progress value={stats.percent} />
          </div>
        )
      })}
    </div>
  )
}
