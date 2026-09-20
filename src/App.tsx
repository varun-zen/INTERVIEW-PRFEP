import { CalendarRange, LayoutDashboard, ListChecks, Search } from "lucide-react"
import { DataIoControls } from "@/components/data-io/data-io-controls"
import { CategoryView } from "@/components/categories/category-view"
import { Dashboard } from "@/components/dashboard/dashboard"
import { SearchFilter } from "@/components/search/search-filter"
import { ThemeToggle } from "@/components/theme-toggle"
import { TimelineView } from "@/components/timeline/timeline-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { STORAGE_KEYS } from "@/lib/storage"

type TabValue = "dashboard" | "categories" | "timeline" | "search"

function App() {
  const [tab, setTab] = useLocalStorage<TabValue>(STORAGE_KEYS.lastTab, "dashboard")

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Interview Prep Tracker
            </h1>
            <p className="text-xs text-muted-foreground">
              Java backend → product company · targeting March 2027
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataIoControls />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList className="mb-6 grid w-full grid-cols-2 sm:inline-flex sm:w-fit">
            <TabsTrigger value="dashboard" className="gap-1.5">
              <LayoutDashboard className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-1.5">
              <ListChecks className="size-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5">
              <CalendarRange className="size-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-1.5">
              <Search className="size-4" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="categories">
            <CategoryView />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineView />
          </TabsContent>
          <TabsContent value="search">
            <SearchFilter />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
