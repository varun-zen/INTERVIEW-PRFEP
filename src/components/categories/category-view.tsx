import { useMemo, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TopicCard } from "@/components/topics/topic-card"
import { useTopics } from "@/context/TopicsContext"
import { getFocusMonth, isMonthPast } from "@/lib/date"
import { computeStats, groupByCategory, groupByMonth } from "@/lib/stats"
import { CATEGORIES, MONTHS, type Category } from "@/types"

export function CategoryView() {
  const { topics } = useTopics()
  const byCategory = groupByCategory(topics)
  const categoriesWithTopics = CATEGORIES.filter(
    (c) => (byCategory.get(c)?.length ?? 0) > 0
  )

  const [selected, setSelected] = useState<Category>(categoriesWithTopics[0])
  const categoryTopics = byCategory.get(selected) ?? []
  const categoryStats = computeStats(categoryTopics)
  const byMonth = groupByMonth(categoryTopics)
  const monthsWithTopics = MONTHS.filter((m) => (byMonth.get(m)?.length ?? 0) > 0)

  const focus = getFocusMonth()
  const defaultOpen = useMemo(() => {
    return monthsWithTopics.includes(focus.month) ? [focus.month] : [monthsWithTopics[0]]
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={selected} onValueChange={(v) => setSelected(v as Category)}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {categoriesWithTopics.map((category) => {
              const stats = computeStats(byCategory.get(category) ?? [])
              return (
                <SelectItem key={category} value={category}>
                  {category}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {stats.done}/{stats.total}
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          <Progress value={categoryStats.percent} className="w-40" />
          <Badge variant="outline">
            {categoryStats.done}/{categoryStats.total} · {categoryStats.percent}%
          </Badge>
        </div>
      </div>

      <Accordion multiple defaultValue={defaultOpen} className="flex flex-col gap-2">
        {monthsWithTopics.map((month) => {
          const monthTopics = byMonth.get(month) ?? []
          const stats = computeStats(monthTopics)
          const isCurrent = month === focus.month && focus.state === "active"
          const isNextUp = month === focus.month && focus.state === "upcoming"
          const isBehind =
            stats.percent < 100 && isMonthPast(month) && !isCurrent
          return (
            <AccordionItem
              key={month}
              value={month}
              className="rounded-xl border px-4 not-last:border-b"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center gap-2 pr-2">
                  <span className="font-medium">{month}</span>
                  {isCurrent && (
                    <Badge className="bg-primary/10 text-primary">Current</Badge>
                  )}
                  {isNextUp && <Badge variant="secondary">Starts soon</Badge>}
                  {isBehind && (
                    <Badge variant="destructive">Behind schedule</Badge>
                  )}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {stats.done}/{stats.total} · {stats.percent}%
                  </span>
                  <Progress value={stats.percent} className="h-1.5 w-24" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2.5">
                  {monthTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
