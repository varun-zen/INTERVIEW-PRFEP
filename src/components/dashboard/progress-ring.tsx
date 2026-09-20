import { cn } from "@/lib/utils"

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
  sublabel?: string
}

export function ProgressRing({
  percent,
  size = 140,
  strokeWidth = 12,
  className,
  label,
  sublabel,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">{clamped}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
        {sublabel && (
          <span className="text-[0.65rem] text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
