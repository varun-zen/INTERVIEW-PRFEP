import { CategoryProgressList } from "@/components/dashboard/category-progress-list"
import { ProgressRing } from "@/components/dashboard/progress-ring"
import { ThisMonthFocus } from "@/components/dashboard/this-month-focus"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTopics } from "@/context/TopicsContext"
import { computeStats } from "@/lib/stats"

export function Dashboard() {
  const { topics } = useTopics()
  const stats = computeStats(topics)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ProgressRing percent={stats.percent} sublabel="complete" />
            <div className="grid w-full grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col gap-0.5 rounded-lg border p-2">
                <span className="text-lg font-semibold tabular-nums">
                  {stats.done}
                </span>
                <span className="text-muted-foreground">Done</span>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg border p-2">
                <span className="text-lg font-semibold tabular-nums">
                  {stats.inProgress}
                </span>
                <span className="text-muted-foreground">In progress</span>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg border p-2">
                <span className="text-lg font-semibold tabular-nums">
                  {stats.notStarted}
                </span>
                <span className="text-muted-foreground">Not started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ThisMonthFocus />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress by category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryProgressList topics={topics} />
        </CardContent>
      </Card>
    </div>
  )
}
