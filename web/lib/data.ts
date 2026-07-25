export type Goal = {
  id: string
  title: string
  description: string
  icon: "compass" | "funding" | "plan" | "customers"
}

export type Recommendation = {
  rank: number
  name: string
  category: string
  score: number
  summary: string
  match: string
  difference: string
  status: string
  verified: string
  evidence: "Strong" | "Moderate"
  uncertainty: string
  cost: string
  eligibility: string
  nextStep: string
  timeline: string
  outcome: string
  citations: { label: string; source: string }[]
}

export const goals: Goal[] = [
  { id: "direction", title: "Find my next step", description: "I need help deciding what to work on first.", icon: "compass" },
  { id: "funding", title: "Prepare for funding", description: "I want capital guidance or lender readiness.", icon: "funding" },
  { id: "planning", title: "Strengthen my business", description: "I need planning, coaching, or operations support.", icon: "plan" },
  { id: "customers", title: "Reach more customers", description: "I want clearer marketing and better measurement.", icon: "customers" },
]

export const intakeQuestions = [
  {
    prompt: "Where are you in your business journey?",
    helper: "This changes which resources are practical right now.",
    options: ["Exploring an idea", "Planning to launch", "Operating under 2 years", "Operating 2+ years"],
  },
  {
    prompt: "What would make the biggest difference in the next 90 days?",
    helper: "Choose the outcome you most want to move forward.",
    options: ["A clear action plan", "Access to capital", "More customers", "Better systems"],
  },
  {
    prompt: "How much time can you set aside each week?",
    helper: "We will favor options that fit your capacity.",
    options: ["Under 2 hours", "2–5 hours", "5–10 hours", "Flexible"],
  },
  {
    prompt: "What support format works best for you?",
    helper: "You can change this later.",
    options: ["One-to-one guidance", "Self-paced tools", "Group learning", "No preference"],
  },
]

export const recommendations: Recommendation[] = [
  {
    rank: 1,
    name: "Small Business Development Center Advising",
    category: "One-to-one guidance",
    score: 94,
    summary: "No-cost advising to turn your immediate goal into an achievable plan.",
    match: "A strong first step when you need tailored decisions before committing time or money to a program.",
    difference: "Unlike a course, an advisor can help sequence your specific priorities and refer you onward when you are ready.",
    status: "Rolling intake — confirm locally",
    verified: "Mock record checked Jul 18, 2026",
    evidence: "Strong",
    uncertainty: "Advisor availability, local service area, and appointment timing require confirmation.",
    cost: "No cost for core advising",
    eligibility: "Typically serves aspiring and current small-business owners; local rules may vary.",
    nextStep: "Request an introductory advising session.",
    timeline: "Estimated 1–3 weeks to first meeting",
    outcome: "A prioritized 90-day action plan",
    citations: [
      { label: "Program overview", source: "Mock official provider record" },
      { label: "Service model", source: "Mock governed source catalog" },
    ],
  },
  {
    rank: 2,
    name: "BusinessApp.io",
    category: "Freemium analytics",
    score: 88,
    summary: "A freemium workspace for understanding how people find, use, and act on your digital presence.",
    match: "Useful when customer growth is a priority and you need a simple measurement baseline before increasing marketing spend.",
    difference: "This is a measurement tool, not advising or guaranteed customer acquisition. It separates three kinds of signals so activity is not mistaken for results.",
    status: "Sample listing — verify product terms",
    verified: "Mock record checked Jul 12, 2026",
    evidence: "Moderate",
    uncertainty: "Current plan limits, integrations, pricing, and data practices must be reviewed on the provider site.",
    cost: "Freemium; paid features may apply",
    eligibility: "Best for owners with an active website or digital listing and access to their analytics accounts.",
    nextStep: "Connect one owned channel and record a two-week baseline.",
    timeline: "About 30 minutes to set up; 2 weeks for baseline",
    outcome: "A baseline across visibility, engagement, and conversion",
    citations: [
      { label: "Sample product profile", source: "Mock provider record — not live verified" },
      { label: "Analytics definitions", source: "Mock INDYpendent Bytes guidance" },
    ],
  },
  {
    rank: 3,
    name: "SCORE Business Mentoring",
    category: "Ongoing mentorship",
    score: 81,
    summary: "Volunteer mentoring for recurring business questions and longer-term accountability.",
    match: "A practical follow-on once your immediate plan is defined and you want periodic perspective from an experienced mentor.",
    difference: "Mentoring supports reflection and accountability; it does not replace licensed legal, tax, or lending advice.",
    status: "Rolling requests — mentor match varies",
    verified: "Mock record checked Jul 8, 2026",
    evidence: "Strong",
    uncertainty: "Mentor expertise, matching time, and local or virtual availability require confirmation.",
    cost: "No cost",
    eligibility: "Generally open to aspiring and current entrepreneurs.",
    nextStep: "Draft three questions before requesting a mentor.",
    timeline: "Estimated 1–4 weeks for a match",
    outcome: "A recurring accountability cadence",
    citations: [{ label: "Mentoring overview", source: "Mock official organization record" }],
  },
]

export const checklist = [
  "Write your primary 90-day goal in one sentence",
  "Gather your latest revenue and expense snapshot",
  "List the three decisions currently blocking progress",
  "Confirm your weekly time and budget constraints",
  "Prepare questions about eligibility, timing, and obligations",
]
