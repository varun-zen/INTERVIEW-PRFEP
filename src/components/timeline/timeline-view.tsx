import { AlertTriangle, CheckCircle2, Circle, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTopics } from "@/context/TopicsContext"
import { isMonthActive, isMonthPast } from "@/lib/date"
import { computeStats, groupByMonth } from "@/lib/stats"
import { cn } from "@/lib/utils"
import { MONTHS } from "@/types"

type MonthState = "done" | "behind" | "active" | "upcoming"

function getMonthState(month: (typeof MONTHS)[number], percent: number): MonthState {
  if (percent === 100) return "done"
  if (isMonthPast(month)) return "behind"
  if (isMonthActive(month)) return "active"
  return "upcoming"
}

const STATE_CONFIG: Record<
  MonthState,
  { label: string; icon: typeof Circle; dot: string; text: string }
> = {
  done: {
    label: "Complete",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  behind: {
    label: "Behind schedule",
    icon: AlertTriangle,
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  active: {
    label: "In progress",
    icon: PlayCircle,
    dot: "bg-primary",
    text: "text-primary",
  },
  upcoming: {
    label: "Upcoming",
    icon: Circle,
    dot: "bg-muted-foreground/30",
    text: "text-muted-foreground",
  },
}

export function TimelineView() {
  const { topics } = useTopics()
  const byMonth = groupByMonth(topics)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Six-month roadmap, Oct 2026 through Mar 2027. Months already past with
        incomplete topics are flagged behind schedule.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {MONTHS.map((month) => {
          const monthTopics = byMonth.get(month) ?? []
          const stats = computeStats(monthTopics)
          const state = getMonthState(month, stats.percent)
          const config = STATE_CONFIG[state]
          const Icon = config.icon

          return (
            <div
              key={month}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4",
                state === "active" && "border-primary/50 ring-1 ring-primary/20",
                state === "behind" && "border-red-500/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className={cn("size-2 rounded-full", config.dot)} />
                  {month}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Icon className={cn("size-3.5", config.text)} />
                <span className={config.text}>{config.label}</span>
              </div>
              <Progress value={stats.percent} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {stats.done}/{stats.total} topics
                </span>
                <Badge variant="outline" className="tabular-nums">
                  {stats.percent}%
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
