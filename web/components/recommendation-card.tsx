import { ArrowRight, CalendarCheck, CheckCircle2, CircleDollarSign, ExternalLink, ShieldCheck } from "lucide-react"
import type { Recommendation } from "@/lib/data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RecommendationCard({ resource }: { resource: Recommendation }) {
  return (
    <Card className="min-w-0 overflow-hidden border-border/80 shadow-none">
      <CardHeader className="gap-3 border-b bg-card">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>#{resource.rank} match</Badge>
          <Badge variant="outline">{resource.score}% fit</Badge>
          <Badge variant="secondary">{resource.category}</Badge>
        </div>
        <CardTitle className="text-balance text-xl">{resource.name}</CardTitle>
        <CardDescription className="text-pretty leading-relaxed">{resource.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Info icon={ShieldCheck} label="Why it matches" value={resource.match} />
          <Info icon={CircleDollarSign} label="Cost" value={resource.cost} />
          <Info icon={CheckCircle2} label="Eligibility" value={resource.eligibility} />
          <Info icon={CalendarCheck} label="Expected pace" value={resource.timeline} />
        </div>
        {resource.name === "BusinessApp.io" && (
          <div className="rounded-lg border bg-secondary/60 p-4">
            <p className="font-semibold">Three different signals—not one score</p>
            <dl className="mt-3 grid gap-3 text-sm md:grid-cols-3">
              <div><dt className="font-medium">Visibility</dt><dd className="mt-1 text-muted-foreground">How often people can find you: reach, impressions, search presence.</dd></div>
              <div><dt className="font-medium">Engagement</dt><dd className="mt-1 text-muted-foreground">How people interact: visits, time, clicks, repeat activity.</dd></div>
              <div><dt className="font-medium">Conversion</dt><dd className="mt-1 text-muted-foreground">Whether action follows: inquiries, bookings, purchases, sign-ups.</dd></div>
            </dl>
          </div>
        )}
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger>Evidence, tradeoffs, and citations</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-muted-foreground">
              <p><strong className="text-foreground">Why this option:</strong> {resource.difference}</p>
              <p><strong className="text-foreground">What remains uncertain:</strong> {resource.uncertainty}</p>
              <div className="flex flex-wrap gap-2"><Badge variant="outline">Evidence: {resource.evidence}</Badge><Badge variant="outline">{resource.verified}</Badge></div>
              <ul className="flex flex-col gap-2">
                {resource.citations.map((citation) => <li key={citation.label} className="flex items-start gap-2"><ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span><strong className="text-foreground">{citation.label}:</strong> {citation.source}</span></li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 border-t bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Completion measure</p><p className="mt-1 text-sm font-medium">{resource.outcome}</p></div>
        <Button type="button" className="h-auto max-w-full whitespace-normal text-left">{resource.nextStep}<ArrowRight data-icon="inline-end" /></Button>
      </CardFooter>
    </Card>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{value}</p></div></div>
}
