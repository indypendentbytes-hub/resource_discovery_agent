import { useState } from "react";
import DiscoveryAgentLayout from "./components/layout/DiscoveryAgentLayout";
import HeroIllustration from "./components/HeroIllustration";
import RecognitionCard from "./components/RecognitionCard";
import { routeResources } from "./agent/routingEngine";
import { searchResources } from "./services/resourceSearch";

const CULTIVATOR_INTAKE_URL = "https://form.jotform.com/261957669272069";
const LAND_HOST_INTAKE_URL = "https://form.jotform.com/261957830963066";
const FACEBOOK_URL = "https://www.facebook.com/indypendentbytes/";
const LINKEDIN_URL = "https://www.linkedin.com/company/indypendent-bytes/";
const INSTAGRAM_URL = "https://www.instagram.com/indypendent.bytes/";

const initialMessages = [
  {
    sender: "assistant",
    text: "Welcome. Tell me what you are trying to accomplish, where you are, and any hard constraints.",
  },
];

const resourceGraph = [
  {
    id: "grower-example-farm",
    title: "Cultivator: Example Farm",
    details: "2 acres • mixed vegetables • organic-leaning",
    category: "growers",
    stages: ["Pre-revenue", "Early revenue", "Growth"],
    geography: "Haughville, Indianapolis",
    maxAcreage: 2,
    eligibilityConfirmed: true,
    confidence: 0.9,
    freshness: "verified",
    dateChecked: "2026-07-30",
    citation: "Sample governed resource record",
    friction: 0.25,
  },
  {
    id: "land-host-example-lot",
    title: "Land Host: Example Lot",
    details: "0.5 acre • water access • zoning status requires confirmation",
    category: "landHosts",
    stages: ["Idea", "Pre-revenue", "Early revenue"],
    geography: "Haughville, Indianapolis",
    maxAcreage: 0.5,
    eligibilityConfirmed: false,
    confidence: 0.72,
    freshness: "stale",
    dateChecked: "2026-06-15",
    citation: "Sample partner-submitted record",
    friction: 0.35,
  },
  {
    id: "business-training-example",
    title: "Business Readiness Training",
    details: "Planning, documentation readiness, and advisor preparation",
    category: "training",
    stages: ["Idea", "Pre-revenue", "Early revenue", "Pivoting", "Recovery"],
    geography: "Indianapolis",
    eligibilityConfirmed: true,
    confidence: 0.86,
    freshness: "verified",
    dateChecked: "2026-07-30",
    citation: "Sample governed training record",
    friction: 0.15,
  },
  {
    id: "logistics-example",
    title: "Local Logistics Coordination",
    details: "Delivery planning and transportation constraint review",
    category: "logistics",
    stages: ["Early revenue", "Growth", "Stabilizing"],
    geography: "Indianapolis",
    eligibilityConfirmed: false,
    confidence: 0.68,
    freshness: "uncertain",
    dateChecked: "2026-07-01",
    citation: "Sample unverified coordination record",
    friction: 0.4,
  },
];

const pathways = [
  {
    eyebrow: "Everyone",
    title: "Resource Discovery Agent",
    description:
      "Describe a goal and get a guided path to programs, training, funding, land, and business resources — with clear next steps.",
    href: "#resource-agent",
    label: "Find resources",
  },
  {
    eyebrow: "Growers",
    title: "Become a Cultivator",
    description:
      "Share experience, goals, land access, and training needs. We help you prepare and connect into the coordinated system.",
    href: CULTIVATOR_INTAKE_URL,
    label: "Start intake",
    external: true,
  },
  {
    eyebrow: "Landowners",
    title: "Become a Land Host",
    description:
      "Share available land, water, access, and interest in supporting local production through a structured arrangement.",
    href: LAND_HOST_INTAKE_URL,
    label: "Start intake",
    external: true,
  },
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [resources, setResources] = useState([]);
  const [routingState, setRoutingState] = useState("empty");
  const [routingSummary, setRoutingSummary] = useState(
    "No matches yet. Start with one goal or constraint.",
  );
  const [isSearching, setIsSearching] = useState(false);

  async function handleSend(text) {
    const cleanText = text.trim();
    if (!cleanText || isSearching) return;

    const localResult = routeResources(cleanText, resourceGraph);
    setResources(localResult.recommendations);
    setRoutingState("loading");
    setRoutingSummary(
      "Checking governed matches, official program sources, eligibility, availability, and freshness.",
    );
    setIsSearching(true);

    setMessages((current) => [
      ...current,
      { sender: "user", text: cleanText },
      {
        sender: "assistant",
        text: "I found initial catalog matches. Verifying current program details now.",
      },
    ]);

    try {
      const liveResult = await searchResources({
        query: cleanText,
        routingSummary: localResult.summary,
        candidates: localResult.recommendations,
      });

      setRoutingState(localResult.state === "empty" ? "verified" : localResult.state);
      setRoutingSummary(
        `Live verification completed ${new Date(liveResult.checkedAt).toLocaleString()}.`,
      );
      setMessages((current) => [
        ...current.slice(0, -1),
        { sender: "assistant", text: liveResult.answer },
      ]);
    } catch (error) {
      const fallbackText = localResult.question
        ? `${localResult.summary} ${localResult.question}`
        : localResult.summary;

      setRoutingState(localResult.state);
      setRoutingSummary(
        "Local routing completed, but live verification is currently unavailable.",
      );
      setMessages((current) => [
        ...current.slice(0, -1),
        {
          sender: "assistant",
          text: `${fallbackText}\n\nLive verification notice: ${error.message}`,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleResourceSelect(resource) {
    const score = Math.round(resource.routingScore * 100);
    setMessages((current) => [
      ...current,
      {
        sender: "assistant",
        text: `${resource.title} ranked at ${score}%. Freshness: ${resource.freshness}. Confidence: ${Math.round(resource.confidence * 100)}%. Checked ${resource.dateChecked}. Next step: confirm eligibility and the official engagement route before acting.`,
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1A1A1A]">
      {/* Header — glass, minimal */}
      <header className="site-header sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="brand flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <span className="brand-dot" aria-hidden="true" />
            INDYpendent Bytes
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Primary">
            <a href="#how-it-works">How it works</a>
            <a href="#pathways">Get involved</a>
            <a href="#resource-agent">Find resources</a>
          </nav>
          <a href="#resource-agent" className="cta cta-primary !py-2 !px-4 text-xs md:text-sm">
            Find resources
          </a>
        </div>
      </header>

      {/* Hero — bold type, open space */}
      <section id="top" className="px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C65A1E]">
              Shared structure for a stronger local food economy
            </p>
            <h1 className="mt-5 text-[#1A1A1A]">
              Connecting people, land, resources &amp; opportunity.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#1A1A1A]/65 md:text-lg">
              Navigate support, activate underused land, prepare cultivators, and
              build clearer pathways into a coordinated regional food system.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#resource-agent" className="cta cta-primary">
                Find resources
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={CULTIVATOR_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta-ghost"
              >
                Cultivator intake
              </a>
              <a
                href={LAND_HOST_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta-ghost"
              >
                Land host intake
              </a>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[#E8E2D9] bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00780F]">
            How it works
          </p>
          <h2
            className="mt-3 max-w-lg text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One entry point. Clear next steps.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Tell us what you need", "Use the agent or pick the intake path that matches your role."],
              ["02", "Get routed correctly", "Receive relevant resources, preparation steps, or an IB pathway."],
              ["03", "Move forward prepared", "Know what to expect, what to have ready, and what happens next."],
            ].map(([num, title, body]) => (
              <article key={num} className="step-card">
                <span className="step-num">{num}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section id="pathways" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#005588]">
            Get involved
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three ways to begin.
          </h2>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {pathways.map((p) => (
              <article key={p.title} className="pathway-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C65A1E]">
                  {p.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1A1A1A]/60">
                  {p.description}
                </p>
                <a
                  href={p.href}
                  target={p.external ? "_blank" : undefined}
                  rel={p.external ? "noopener noreferrer" : undefined}
                  className="pathway-link"
                >
                  {p.label}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RecognitionCard />

      {/* Agent */}
      <section id="resource-agent" className="border-t border-[#E8E2D9] bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C65A1E]">
            Find the right next step
          </p>
          <h2
            className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Resource Discovery Agent
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1A1A1A]/60">
            Share a goal, location, and constraints. The agent organizes relevant
            options and next steps — not a dump of links.
          </p>
          <div className="mt-12">
            <DiscoveryAgentLayout
              messages={messages}
              resources={resources}
              routingState={routingState}
              routingSummary={routingSummary}
              onSend={handleSend}
              onResourceSelect={handleResourceSelect}
              isSearching={isSearching}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight">INDYpendent Bytes</p>
            <p className="mt-1 text-sm text-white/50">
              Regional Food Systems Coordination Infrastructure
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href={CULTIVATOR_INTAKE_URL} target="_blank" rel="noopener noreferrer">Cultivator intake</a>
            <a href={LAND_HOST_INTAKE_URL} target="_blank" rel="noopener noreferrer">Land host intake</a>
            <a href="#resource-agent">Resource Agent</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40 flex flex-col gap-1 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} INDYpendent Bytes</span>
          <span>Built for regional food system coordination</span>
        </div>
      </footer>
    </main>
  );
}
