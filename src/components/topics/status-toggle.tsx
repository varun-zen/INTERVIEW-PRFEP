import { CheckCircle2, Circle, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Status } from "@/types"

export const STATUS_CONFIG: Record<
  Status,
  { label: string; icon: typeof Circle; className: string }
> = {
  "not-started": {
    label: "Not started",
    icon: Circle,
    className: "text-muted-foreground",
  },
  "in-progress": {
    label: "In progress",
    icon: CircleDot,
    className: "text-blue-600 dark:text-blue-400",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
  },
}

export function StatusToggle({
  status,
  onCycle,
  className,
}: {
  status: Status
  onCycle: () => void
  className?: string
}) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCycle}
      className={cn("gap-1.5 transition-colors", config.className, className)}
      title="Click to change status"
    >
      <Icon className="size-3.5" />
      {config.label}
    </Button>
  )
}
