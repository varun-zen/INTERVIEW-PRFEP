import { ChevronDown, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { PriorityToggle, nextPriority } from "@/components/topics/priority-toggle"
import { StatusToggle } from "@/components/topics/status-toggle"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTopics } from "@/context/TopicsContext"
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback"
import { cn } from "@/lib/utils"
import type { Topic } from "@/types"

interface TopicCardProps {
  topic: Topic
  showCategory?: boolean
  showMonth?: boolean
}

export function TopicCard({ topic, showCategory, showMonth }: TopicCardProps) {
  const { updateTopic, cycleStatus } = useTopics()
  const [expanded, setExpanded] = useState(false)
  const [notesDraft, setNotesDraft] = useState(topic.notes)
  const [linkDraft, setLinkDraft] = useState(topic.resourceLink ?? "")

  useEffect(() => {
    setNotesDraft(topic.notes)
    setLinkDraft(topic.resourceLink ?? "")
    // Only resync when switching to a different topic (e.g. after import),
    // not on every parent re-render while the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id])

  const saveNotes = useDebouncedCallback((value: string) => {
    updateTopic(topic.id, { notes: value })
  }, 500)

  const saveLink = useDebouncedCallback((value: string) => {
    updateTopic(topic.id, { resourceLink: value.trim() || undefined })
  }, 500)

  const isDone = topic.status === "done"

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3.5 text-card-foreground transition-colors",
        isDone && "bg-muted/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <p
            className={cn(
              "text-sm leading-snug font-medium",
              isDone && "text-muted-foreground line-through"
            )}
          >
            {topic.title}
          </p>
          {(showCategory || showMonth) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {showCategory && (
                <Badge variant="secondary" className="text-[0.7rem]">
                  {topic.category}
                </Badge>
              )}
              {showMonth && (
                <Badge variant="outline" className="text-[0.7rem]">
                  {topic.month}
                </Badge>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse notes" : "Expand notes"}
          className="rounded-md p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusToggle status={topic.status} onCycle={() => cycleStatus(topic.id)} />
        <PriorityToggle
          priority={topic.priority}
          onCycle={() =>
            updateTopic(topic.id, { priority: nextPriority(topic.priority) })
          }
        />
        {!expanded && topic.resourceLink && (
          <a
            href={topic.resourceLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
          >
            <ExternalLink className="size-3" />
            Resource
          </a>
        )}
        {topic.notes && !expanded && (
          <span className="text-xs text-muted-foreground">Has notes</span>
        )}
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-3 border-t pt-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`link-${topic.id}`} className="text-xs text-muted-foreground">
              Resource link
            </Label>
            <Input
              id={`link-${topic.id}`}
              type="url"
              placeholder="https://..."
              value={linkDraft}
              onChange={(e) => {
                setLinkDraft(e.target.value)
                saveLink(e.target.value)
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`notes-${topic.id}`} className="text-xs text-muted-foreground">
              Notes / revision points
            </Label>
            <Textarea
              id={`notes-${topic.id}`}
              rows={4}
              placeholder="Key points to remember for revision..."
              value={notesDraft}
              onChange={(e) => {
                setNotesDraft(e.target.value)
                saveNotes(e.target.value)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
