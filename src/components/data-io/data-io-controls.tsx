import { Download, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTopics } from "@/context/TopicsContext"
import { exportTopicsFile, parseImportedFile } from "@/lib/storage"
import type { Topic } from "@/types"

export function DataIoControls() {
  const { topics, replaceAllTopics } = useTopics()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<Topic[] | null>(null)

  function handleExport() {
    exportTopicsFile(topics)
    toast.success("Backup exported", {
      description: `${topics.length} topics saved to a JSON file.`,
    })
  }

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    parseImportedFile(file)
      .then((imported) => setPendingImport(imported))
      .catch((err: Error) => {
        toast.error("Import failed", { description: err.message })
      })
  }

  function confirmImport() {
    if (!pendingImport) return
    replaceAllTopics(pendingImport)
    toast.success("Progress restored", {
      description: `${pendingImport.length} topics imported.`,
    })
    setPendingImport(null)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5"
        >
          <Upload className="size-3.5" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChosen}
        />
      </div>

      <Dialog
        open={pendingImport !== null}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace current progress?</DialogTitle>
            <DialogDescription>
              This will overwrite all {topics.length} topics currently saved in
              this browser with {pendingImport?.length ?? 0} topics from the
              imported file. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button onClick={confirmImport}>Import and overwrite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
