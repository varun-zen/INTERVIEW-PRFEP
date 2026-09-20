import { CalendarClock } from "lucide-react"
import { StatusToggle } from "@/components/topics/status-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTopics } from "@/context/TopicsContext"
import { getFocusMonth } from "@/lib/date"
import { computeStats } from "@/lib/stats"

export function ThisMonthFocus() {
  const { topics, cycleStatus } = useTopics()
  const focus = getFocusMonth()
  const monthTopics = topics.filter((t) => t.month === focus.month)
  const stats = computeStats(monthTopics)

  const subtitle =
    focus.state === "upcoming"
      ? `Starts in ${focus.daysUntilStart} day${focus.daysUntilStart === 1 ? "" : "s"}`
      : focus.state === "past"
        ? "Final month of the roadmap"
        : `${focus.daysRemaining} day${focus.daysRemaining === 1 ? "" : "s"} remaining`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          This month's focus — {focus.month}
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{subtitle}</span>
          <Badge variant="outline">
            {stats.done}/{stats.total} done ({stats.percent}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {monthTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No topics scheduled for this month.
          </p>
        ) : (
          <ScrollArea className="h-72 pr-3">
            <div className="flex flex-col gap-2">
              {monthTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-snug">
                      {topic.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {topic.category}
                    </span>
                  </div>
                  <StatusToggle
                    status={topic.status}
                    onCycle={() => cycleStatus(topic.id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
