"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, BarChart3, CircleDollarSign, Compass, Lightbulb, MapPin, MessageCircle, Route, SearchCheck, Sparkles, Target } from "lucide-react"
import { goals, intakeQuestions, recommendations } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { PrepTracker } from "@/components/prep-tracker"
import { RecommendationCard } from "@/components/recommendation-card"
import { SafetyNote } from "@/components/safety-note"

type Stage = "welcome" | "goal" | "intake" | "results"
const goalIcons = { compass: Compass, funding: CircleDollarSign, plan: Lightbulb, customers: BarChart3 }

export function ResourceJourney() {
  const [stage, setStage] = useState<Stage>("welcome")
  const [goal, setGoal] = useState("")
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [note, setNote] = useState("")

  const restart = () => { setStage("welcome"); setGoal(""); setQuestion(0); setAnswers([]); setNote("") }
  const chooseAnswer = (answer: string) => setAnswers((current) => current.map((value, index) => index === question ? answer : value).concat(current.length <= question ? [answer] : []))
  const stagePercent = stage === "welcome" ? 0 : stage === "goal" ? 20 : stage === "intake" ? 30 + ((question + 1) / intakeQuestions.length) * 50 : 100

  return (
    <main>
      {stage !== "welcome" && (
        <div className="border-b bg-card/80">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">Your pathway</span>
            <Progress value={stagePercent} aria-label={`Journey ${Math.round(stagePercent)}% complete`} />
            <span className="text-xs font-semibold tabular-nums">{Math.round(stagePercent)}%</span>
          </div>
        </div>
      )}

      {stage === "welcome" && (
        <section className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl flex-col justify-center gap-12 px-4 py-16 md:px-8 lg:flex-row lg:items-center">
          <div className="flex max-w-2xl flex-1 flex-col items-start gap-6">
            <Badge variant="secondary"><Sparkles aria-hidden="true" /> Guided business support</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">Turn scattered resources into a clear next step.</h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">Tell us where you want to go. We&apos;ll help you compare support options, understand the tradeoffs, and prepare to take action.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => setStage("goal")}>Find my next step<ArrowRight data-icon="inline-end" /></Button>
              <Button size="lg" variant="outline" disabled>View saved pathway</Button>
            </div>
            <p className="text-sm text-muted-foreground">About 3 minutes · No account required · Prototype data</p>
          </div>
          <Card className="w-full max-w-md shadow-none">
            <CardHeader><CardTitle>More than a list of links</CardTitle><CardDescription>Each pathway is designed to help you decide and act.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-5">
              {[{ icon: Target, title: "Fit first", text: "Recommendations connect to your stage, goal, and constraints." }, { icon: SearchCheck, title: "Evidence visible", text: "See verification dates, uncertainty, cost, eligibility, and sources." }, { icon: Route, title: "Action ready", text: "Know what to prepare, ask, expect, and measure next." }].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon className="size-4" aria-hidden="true" /></div><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div></div>)}
            </CardContent>
          </Card>
        </section>
      )}

      {stage === "goal" && (
        <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-8 flex flex-col gap-3"><Badge variant="outline">Step 1 of 2</Badge><h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">What would you like help with?</h1><p className="text-muted-foreground">Choose the closest fit. There are no wrong answers.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((item) => { const Icon = goalIcons[item.icon]; const selected = goal === item.id; return <button key={item.id} type="button" onClick={() => setGoal(item.id)} aria-pressed={selected} className={cn("flex min-h-40 flex-col items-start gap-4 rounded-xl border bg-card p-6 text-left transition-all hover:border-primary/60 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-ring", selected && "border-primary bg-secondary/60 ring-2 ring-primary/20")}><div className="flex size-10 items-center justify-center rounded-lg bg-secondary"><Icon className="size-5" aria-hidden="true" /></div><div><span className="font-semibold">{item.title}</span><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p></div></button> })}
            <button type="button" onClick={() => setGoal("unsure")} aria-pressed={goal === "unsure"} className={cn("flex min-h-28 items-center gap-4 rounded-xl border bg-card p-6 text-left transition-all hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring sm:col-span-2", goal === "unsure" && "border-primary bg-secondary/60 ring-2 ring-primary/20")}><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><MessageCircle className="size-5" aria-hidden="true" /></div><div><span className="font-semibold">I&apos;m not sure yet</span><p className="mt-1 text-sm text-muted-foreground">Help me narrow it down with a few practical questions.</p></div></button>
          </div>
          <div className="mt-8 flex items-center justify-between gap-3"><Button variant="ghost" onClick={() => setStage("welcome")}><ArrowLeft data-icon="inline-start" />Back</Button><Button disabled={!goal} onClick={() => setStage("intake")}>Continue<ArrowRight data-icon="inline-end" /></Button></div>
        </section>
      )}

      {stage === "intake" && (
        <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
          <Card className="shadow-none">
            <CardHeader><div className="flex items-center justify-between gap-3"><Badge variant="outline">Question {question + 1} of {intakeQuestions.length}</Badge><span className="text-sm text-muted-foreground">Step 2 of 2</span></div><CardTitle className="text-balance text-2xl md:text-3xl">{intakeQuestions[question].prompt}</CardTitle><CardDescription>{intakeQuestions[question].helper}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {intakeQuestions[question].options.map((option) => <button type="button" key={option} aria-pressed={answers[question] === option} onClick={() => chooseAnswer(option)} className={cn("rounded-lg border bg-background px-4 py-4 text-left text-sm font-medium transition-colors hover:border-primary/60 hover:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-ring", answers[question] === option && "border-primary bg-secondary ring-2 ring-primary/20")}>{option}</button>)}
              {question === intakeQuestions.length - 1 && <div className="mt-3"><label htmlFor="context-note" className="mb-2 block text-sm font-medium">Anything else we should consider? <span className="font-normal text-muted-foreground">Optional</span></label><Textarea id="context-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="For example: location, schedule, accessibility, language, or budget constraints" /></div>}
              <div className="mt-4 flex items-center justify-between gap-3"><Button variant="ghost" onClick={() => question === 0 ? setStage("goal") : setQuestion((q) => q - 1)}><ArrowLeft data-icon="inline-start" />Back</Button><Button disabled={!answers[question]} onClick={() => question === intakeQuestions.length - 1 ? setStage("results") : setQuestion((q) => q + 1)}>{question === intakeQuestions.length - 1 ? "See my pathway" : "Continue"}<ArrowRight data-icon="inline-end" /></Button></div>
            </CardContent>
          </Card>
        </section>
      )}

      {stage === "results" && (
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-3xl"><Badge variant="secondary"><MapPin aria-hidden="true" /> Personalized mock pathway</Badge><h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">Your best next steps, in order.</h1><p className="mt-3 text-pretty leading-relaxed text-muted-foreground">Ranked by likely fit—not popularity. Details are mock-backed and must be confirmed with each provider before you act.</p></div><Button variant="outline" onClick={restart}>Start over</Button></div>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex min-w-0 flex-col gap-5">{recommendations.map((resource) => <RecommendationCard key={resource.name} resource={resource} />)}</div>
            <aside className="flex flex-col gap-5 lg:sticky lg:top-6"><PrepTracker /><SafetyNote /><Card className="shadow-none"><CardHeader><CardTitle className="text-base">Saved pathway</CardTitle><CardDescription>History and saved recommendations will appear here in a future release.</CardDescription></CardHeader></Card></aside>
          </div>
        </section>
      )}
    </main>
  )
}
