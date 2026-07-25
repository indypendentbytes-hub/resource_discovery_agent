import { CircleHelp, LockKeyhole, Sprout } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-foreground bg-foreground text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground" aria-hidden="true">
              <Sprout className="size-5" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">Resource Discovery</p>
              <p className="text-xs text-primary-foreground/70">by INDYpendent Bytes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <LockKeyhole aria-hidden="true" /> Mock data only
            </Badge>
            <Button variant="ghost" size="sm" disabled title="Help center coming soon" className="text-primary-foreground">
              <CircleHelp data-icon="inline-start" /> Help
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-foreground bg-foreground text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-primary-foreground/70 md:flex-row md:items-center md:justify-between md:px-8">
          <p>Guidance for informed progress—not a guarantee of eligibility or results.</p>
          <p>Prototype experience · No information is saved</p>
        </div>
      </footer>
    </div>
  )
}
