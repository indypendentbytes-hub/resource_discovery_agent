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
    <main className="min-h-screen">
      {/* Header */}
      <header className="site-header sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#F5EDE0]">
            <span className="brand-dot" aria-hidden="true" />
            INDYpendent Bytes
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Primary">
            <a href="#how-it-works">How it works</a>
            <a href="#pathways">Get involved</a>
            <a href="#resource-agent">Find resources</a>
          </nav>
          <a href="#resource-agent" className="cta-sand !py-2 !px-4 text-xs md:text-sm">
            Find resources
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="hero relative px-6 pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="leaf-cluster" aria-hidden="true">
          <div className="leaf leaf-1" />
          <div className="leaf leaf-2" />
          <div className="leaf leaf-3" />
          <div className="leaf leaf-4" />
          <div className="leaf leaf-5" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A84B]">
              Shared structure for a stronger local food economy
            </p>
            <h1 className="hero-title mt-5 font-display">
              Connecting people, land &amp; opportunity.
            </h1>
            <p className="hero-sub mt-6 text-base leading-relaxed md:text-lg">
              Navigate support, activate underused land, prepare cultivators,
              and build clearer pathways into a coordinated regional food system.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#resource-agent" className="cta-sand">
                Find resources
              </a>
              <a
                href={CULTIVATOR_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost-light"
              >
                Cultivator intake
              </a>
              <a
                href={LAND_HOST_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost-light"
              >
                Land host intake
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip — overlaps hero like the reference */}
      <section id="how-it-works" className="relative z-20 -mt-16 px-6">
        <div className="feature-strip mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                ),
                title: "Tell us what you need",
                body: "Use the agent or pick the intake path that matches your role.",
              },
              {
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Get routed correctly",
                body: "Receive relevant resources, preparation steps, or an IB pathway.",
              },
              {
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                ),
                title: "Move forward prepared",
                body: "Know what to expect, what to have ready, and what happens next.",
              },
              {
                icon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
                  </svg>
                ),
                title: "Stay connected",
                body: "Join a coordinated system linking land, growers, and local buyers.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="text-sm font-semibold text-[#F5EDE0]">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#F5EDE0]/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways — nature cards */}
      <section id="pathways" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A84B]">
            Get involved
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-[#F5EDE0] md:text-4xl font-display">
            Three ways to begin.
          </h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a href="#resource-agent" className="nature-card card-green">
              <div className="card-icon">🌿</div>
              <h3 className="text-lg font-semibold">Resource Agent</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-80">
                Guided pathways to programs, training, funding, land, and business resources.
              </p>
              <span className="mt-4 text-sm font-semibold opacity-90">Find resources →</span>
            </a>

            <a
              href={CULTIVATOR_INTAKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nature-card card-soil"
            >
              <div className="card-icon">🌱</div>
              <h3 className="text-lg font-semibold">Become a Cultivator</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-80">
                Share experience, goals, land access, and training needs.
              </p>
              <span className="mt-4 text-sm font-semibold opacity-90">Start intake →</span>
            </a>

            <a
              href={LAND_HOST_INTAKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nature-card card-sand sm:col-span-2 lg:col-span-1"
            >
              <div className="card-icon">🌾</div>
              <h3 className="text-lg font-semibold">Become a Land Host</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-75">
                Share available land, water, access, and interest in supporting production.
              </p>
              <span className="mt-4 text-sm font-semibold opacity-90">Start intake →</span>
            </a>
          </div>

          {/* Secondary row like reference photo + icon cards */}
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div
              className="nature-card !min-h-[180px] overflow-hidden !p-0"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5">
                <p className="text-sm font-semibold text-white">Regional coordination</p>
                <p className="mt-1 text-xs text-white/70">Land · people · local markets</p>
              </div>
            </div>

            <div className="nature-card card-soil !min-h-[180px]">
              <div className="card-icon">🍃</div>
              <h3 className="text-base font-semibold">Community first</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-75">
                Built for cultivators, hosts, and neighbors — not a marketplace.
              </p>
            </div>

            <div className="nature-card card-cream !min-h-[180px]">
              <div className="card-icon">⬡</div>
              <h3 className="text-base font-semibold">Clear next steps</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-70">
                Every path ends with what to prepare and what happens next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RecognitionCard />

      {/* Agent */}
      <section id="resource-agent" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A84B]">
            Find the right next step
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-[#F5EDE0] md:text-4xl font-display">
            Resource Discovery Agent
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[#F5EDE0]/60">
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
            <p className="text-lg font-semibold tracking-tight text-[#F5EDE0]">INDYpendent Bytes</p>
            <p className="mt-1 text-sm text-[#F5EDE0]/45">
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
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 pt-6 text-xs text-[#F5EDE0]/30 flex flex-col gap-1 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} INDYpendent Bytes</span>
          <span>Built for regional food system coordination</span>
        </div>
      </footer>
    </main>
  );
}
