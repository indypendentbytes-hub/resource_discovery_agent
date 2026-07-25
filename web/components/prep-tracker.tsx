"use client"

import { useMemo, useState } from "react"
import { checklist } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function PrepTracker() {
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false))
  const completed = done.filter(Boolean).length
  const percent = useMemo(() => Math.round((completed / checklist.length) * 100), [completed])

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Preparation checklist</CardTitle>
          <Badge variant={percent === 100 ? "default" : "secondary"}>{completed}/{checklist.length} ready</Badge>
        </div>
        <CardDescription>Get these ready before you reach out. Progress is tracked locally for this session only.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={percent} aria-label={`Preparation ${percent}% complete`} />
        <ul className="flex flex-col gap-1">
          {checklist.map((item, index) => {
            const id = `prep-${index}`
            return (
              <li key={item}>
                <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/60">
                  <Checkbox id={id} checked={done[index]} onCheckedChange={(value) => setDone((prev) => prev.map((v, i) => (i === index ? value === true : v)))} className="mt-0.5" />
                  <span className={done[index] ? "text-sm text-muted-foreground line-through" : "text-sm"}>{item}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
