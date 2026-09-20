import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PRIORITIES, type Priority } from "@/types"

export const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  low: {
    label: "Low",
    className:
      "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  },
  high: {
    label: "High",
    className: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-300",
  },
}

export function PriorityToggle({
  priority,
  onCycle,
  className,
}: {
  priority: Priority
  onCycle: () => void
  className?: string
}) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <button
      type="button"
      onClick={onCycle}
      title="Click to change priority"
      className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Badge
        variant="outline"
        className={cn("cursor-pointer border-transparent", config.className, className)}
      >
        {config.label} priority
      </Badge>
    </button>
  )
}

export function nextPriority(priority: Priority): Priority {
  const index = PRIORITIES.indexOf(priority)
  return PRIORITIES[(index + 1) % PRIORITIES.length]
}
