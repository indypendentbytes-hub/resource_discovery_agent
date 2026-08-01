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
    text: "Welcome to Resource Discovery. Tell me what you are trying to accomplish, your location, and any hard constraints.",
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
    eyebrow: "Find support",
    title: "Use the Resource Discovery Agent",
    description:
      "Describe what you are trying to accomplish and get a guided path to relevant programs, training, funding, food access, land, and business resources.",
    href: "#resource-agent",
    label: "Find resources",
  },
  {
    eyebrow: "Build your pathway",
    title: "Become an IB Cultivator",
    description:
      "Tell us about your experience, goals, land access, training needs, and interest in participating in a coordinated local food system.",
    href: CULTIVATOR_INTAKE_URL,
    label: "Start cultivator intake",
    external: true,
  },
  {
    eyebrow: "Activate local land",
    title: "Become a Land Host",
    description:
      "Share information about available land, water, access, and your interest in supporting a local cultivator through a structured arrangement.",
    href: LAND_HOST_INTAKE_URL,
    label: "Start land host intake",
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
        text: "I found the initial catalog matches. I’m verifying current program details and authoritative sources now.",
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
    <main className="min-h-screen bg-ib-linen text-text-primaryLight">
      <header className="site-header sticky top-0 z-50 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight sm:text-base"
          >
            <span className="brand-marker" aria-hidden="true" />
            INDYpendent Bytes
          </a>
          <nav
            className="hidden items-center gap-7 text-sm font-semibold md:flex"
            aria-label="Primary navigation"
          >
            <a href="#how-it-works">How it works</a>
            <a href="#pathways">Get involved</a>
            <a href="#resource-agent">Find resources</a>
          </nav>
          <a
            href="#resource-agent"
            className="text-sm font-semibold md:hidden"
          >
            Find resources
          </a>
        </div>
      </header>

      <section id="top" className="px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="hero-copy">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#C65A1E] sm:text-sm">
              Shared Structure for a Stronger Local Food Economy
            </p>
            <h1>
              Connecting people, land, resources, and local food opportunity.
            </h1>

            <div className="hero-actions mt-6 grid gap-3 sm:grid-cols-3">
              <a href="#resource-agent" className="action-button action-primary">
                <span className="action-kicker">Need support?</span>
                <span className="action-label">Find resources</span>
                <span className="action-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href={CULTIVATOR_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button action-secondary"
              >
                <span className="action-kicker">Want to cultivate?</span>
                <span className="action-label">Start cultivator intake</span>
                <span className="action-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href={LAND_HOST_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button action-secondary"
              >
                <span className="action-kicker">Have land?</span>
                <span className="action-label">Start land host intake</span>
                <span className="action-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed opacity-80 sm:text-lg">
              INDYpendent Bytes helps communities navigate support, activate
              underused land, prepare cultivators, and build clearer pathways
              into a coordinated regional food system.
            </p>
          </div>

          <HeroIllustration />
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="section-eyebrow">How it works</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-black md:text-3xl">
            One public entry point. Clear next steps.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "1",
                "Tell us what you need",
                "Use the agent or select the intake path that matches your role.",
              ],
              [
                "2",
                "Get routed correctly",
                "Receive relevant information, resources, preparation steps, or an IB intake pathway.",
              ],
              [
                "3",
                "Move forward prepared",
                "Understand what to expect, what to have ready, and what happens next.",
              ],
            ].map(([number, title, description]) => (
              <article
                key={number}
                className="motion-card border border-black/10 bg-white p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#00780F] text-sm font-bold text-white">
                  {number}
                </span>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pathways" className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="section-eyebrow">Get involved</p>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">
            Three ways to begin.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {pathways.map((pathway) => (
              <article
                key={pathway.title}
                className="motion-card flex min-h-[260px] flex-col p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#005588]">
                  {pathway.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-black">{pathway.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed opacity-75">
                  {pathway.description}
                </p>
                <a
                  href={pathway.href}
                  target={pathway.external ? "_blank" : undefined}
                  rel={pathway.external ? "noopener noreferrer" : undefined}
                  className="pathway-button mt-6 inline-flex w-fit items-center gap-2 px-5 py-2.5 text-sm font-bold text-white"
                >
                  {pathway.label}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RecognitionCard />

      <section id="resource-agent" className="border-t border-black/10 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="section-eyebrow mb-2">Find the right next step</p>
          <h2 className="mb-3 text-2xl font-black md:text-3xl">
            Resource Discovery Agent
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed opacity-80">
            Tell the agent what you are trying to accomplish, where you are
            located, and what constraints you are facing. It will help organize
            relevant options and next steps instead of giving you a list of
            disconnected links.
          </p>
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
      </section>

      <footer className="site-footer px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <p className="font-black text-lg">INDYpendent Bytes</p>
            <p className="mt-1 text-sm opacity-75">
              Regional Food Systems Coordination Infrastructure
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a href={CULTIVATOR_INTAKE_URL} target="_blank" rel="noopener noreferrer">
              Cultivator intake
            </a>
            <a href={LAND_HOST_INTAKE_URL} target="_blank" rel="noopener noreferrer">
              Land host intake
            </a>
            <a href="#resource-agent">Resource Discovery Agent</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-white/15 pt-5 text-xs opacity-60 flex flex-col sm:flex-row sm:justify-between gap-2">
          <span>© {new Date().getFullYear()} INDYpendent Bytes</span>
          <span>Built for regional food system coordination</span>
        </div>
      </footer>
    </main>
  );
}
