import { Scale, ShieldAlert } from "lucide-react"

export function SafetyNote() {
  return (
    <aside className="rounded-xl border bg-card p-5" aria-labelledby="safety-title">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 id="safety-title" className="font-semibold">Know when to bring in a professional</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">This prototype can help you prepare questions and compare options. It cannot make legal, tax, lending, licensing, food-safety, or compliance determinations.</p>
          <p className="flex items-start gap-2 text-sm font-medium"><Scale className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Confirm consequential decisions with the relevant qualified professional or program representative.</p>
        </div>
      </div>
    </aside>
  )
}
