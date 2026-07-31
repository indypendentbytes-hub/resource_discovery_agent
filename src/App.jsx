import { useState } from "react";
import DiscoveryAgentLayout from "./components/layout/DiscoveryAgentLayout";
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
    <main className="min-h-screen bg-ib-linen text-text-primaryLight dark:bg-[#121212] dark:text-text-primaryDark">
      <header className="border-b border-black/10 bg-ib-linen/95 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-[#121212]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <a href="#top" className="font-black tracking-tight">
            INDYpendent Bytes
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold md:flex" aria-label="Primary navigation">
            <a href="#how-it-works" className="hover:underline">How it works</a>
            <a href="#pathways" className="hover:underline">Get involved</a>
            <a href="#resource-agent" className="hover:underline">Find resources</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
          </nav>
        </div>
      </header>

      <section id="top" className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">
              Shared Structure for a Stronger Local Food Economy
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] md:text-7xl">
              Connecting people, land, resources, and local food opportunity.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 opacity-85 md:text-xl">
              INDYpendent Bytes helps communities navigate support, activate underused land, prepare cultivators, and build clearer pathways into a coordinated regional food system.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#resource-agent"
                className="rounded-full bg-ib-denim px-6 py-3 font-bold text-white transition hover:opacity-90"
              >
                Find resources
              </a>
              <a
                href={CULTIVATOR_INTAKE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-current px-6 py-3 font-bold transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                Become a cultivator
              </a>
              <a
                href={LAND_HOST_INTAKE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-current px-6 py-3 font-bold transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                Become a land host
              </a>
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-8 shadow-sm dark:bg-white/5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-black">Choose the path that fits your goal.</h2>
            <div className="mt-6 space-y-5 text-base leading-7 opacity-85">
              <p><strong>Need help finding support?</strong> Use the Resource Discovery Agent.</p>
              <p><strong>Want to cultivate food?</strong> Complete the cultivator interest form.</p>
              <p><strong>Have land that could support production?</strong> Complete the land host intake.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-4 py-16 dark:bg-white/5">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">How it works</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black md:text-5xl">
            One public entry point. Clear next steps.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Tell us what you need", "Use the agent or select the intake path that matches your role."],
              ["2", "Get routed correctly", "Receive relevant information, resources, preparation steps, or an IB intake pathway."],
              ["3", "Move forward prepared", "Understand what to expect, what to have ready, and what happens next."],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-3xl border border-black/10 p-7 dark:border-white/10">
                <p className="text-4xl font-black text-ib-denim dark:text-ib-linen">{number}</p>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 opacity-80">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pathways" className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">Get involved</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Three ways to begin.</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pathways.map((pathway) => (
              <article key={pathway.title} className="flex min-h-[340px] flex-col rounded-3xl bg-white p-8 shadow-sm dark:bg-white/5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-ib-denim dark:text-ib-linen">
                  {pathway.eyebrow}
                </p>
                <h3 className="mt-4 text-3xl font-black">{pathway.title}</h3>
                <p className="mt-4 flex-1 leading-7 opacity-80">{pathway.description}</p>
                <a
                  href={pathway.href}
                  target={pathway.external ? "_blank" : undefined}
                  rel={pathway.external ? "noreferrer" : undefined}
                  className="mt-8 inline-flex w-fit rounded-full bg-ib-denim px-5 py-3 font-bold text-white transition hover:opacity-90"
                >
                  {pathway.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RecognitionCard />

      <section id="resource-agent" className="border-t border-black/10 px-4 py-16 dark:border-white/10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">
            INDYpendent Bytes
          </p>
          <h2 className="mb-4 text-4xl font-black md:text-6xl">Resource Discovery Agent</h2>
          <p className="mb-8 max-w-3xl text-lg leading-8 opacity-80">
            Tell the agent what you are trying to accomplish, where you are located, and what constraints you are facing. It will help organize relevant options and next steps instead of giving you a list of disconnected links.
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

      <footer className="border-t border-black/10 px-4 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-black">INDYpendent Bytes</p>
            <p className="mt-1 text-sm opacity-70">Regional Food Systems Coordination Infrastructure</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <a href={CULTIVATOR_INTAKE_URL} target="_blank" rel="noreferrer" className="hover:underline">Cultivator intake</a>
            <a href={LAND_HOST_INTAKE_URL} target="_blank" rel="noreferrer" className="hover:underline">Land host intake</a>
            <a href="#resource-agent" className="hover:underline">Resource Discovery Agent</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
