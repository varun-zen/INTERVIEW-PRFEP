import { PriorityToggle, nextPriority } from "@/components/topics/priority-toggle"
import { StatusToggle } from "@/components/topics/status-toggle"
import { useTopics } from "@/context/TopicsContext"
import type { DateRange } from "@/lib/schedule"
import { formatDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Topic } from "@/types"

export function ScheduledTopicRow({
  topic,
  range,
}: {
  topic: Topic
  range: DateRange | undefined
}) {
  const { cycleStatus, updateTopic } = useTopics()
  const isDone = topic.status === "done"

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3",
        isDone && "bg-muted/40"
      )}
    >
      <p
        className={cn(
          "text-sm leading-snug font-medium",
          isDone && "text-muted-foreground line-through"
        )}
      >
        {topic.title}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <StatusToggle status={topic.status} onCycle={() => cycleStatus(topic.id)} />
        <PriorityToggle
          priority={topic.priority}
          onCycle={() =>
            updateTopic(topic.id, { priority: nextPriority(topic.priority) })
          }
        />
      </div>

      {range && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Start: {formatDate(range.start)}</span>
          <span>Complete by: {formatDate(range.end)}</span>
        </div>
      )}

      {topic.notes && (
        <p className="border-t pt-2 text-xs whitespace-pre-wrap text-muted-foreground">
          {topic.notes}
        </p>
      )}
    </div>
  )
}
