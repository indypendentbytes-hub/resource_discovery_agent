import { useState } from "react";
import DiscoveryAgentLayout from "./components/layout/DiscoveryAgentLayout";
import RecognitionCard from "./components/RecognitionCard";
import BrandLogo from "./components/BrandLogo";
import HeroIllustration from "./components/HeroIllustration";
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
      {/* Header — logo mark, no competing CTA */}
      <header className="site-header sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#F3E9DD]">
            <BrandLogo className="h-8 w-8 shrink-0" />
            INDYpendent Bytes
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Primary">
            <a href="#how-it-works">How it works</a>
            <a href="#pathways">Get involved</a>
            <a href="#resource-agent">Find resources</a>
          </nav>
          <a href="#resource-agent" className="text-sm font-semibold text-[#F3E9DD]/80 hover:text-white md:hidden">
            Find resources
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="hero relative px-6 pt-8 pb-24 md:pt-12 md:pb-28">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C65A1E]">
              Shared Structure for a Stronger Local Food Economy
            </p>
            <h1 className="hero-title mt-2 font-display">
              Connecting people, land, resources, and local food opportunity.
            </h1>
            <p className="hero-sub mt-3 text-base leading-relaxed md:text-lg">
              Navigate support, activate underused land, prepare cultivators,
              and build clearer pathways into a coordinated regional food system.
            </p>
            <div className="hero-cta-row mt-5">
              <a href="#resource-agent" className="cta-pumpkin">
                Find resources
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={CULTIVATOR_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Cultivator intake
                <span className="cta-arrow" aria-hidden="true">→</span>
              </a>
              <a
                href={LAND_HOST_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Land host intake
                <span className="cta-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <HeroIllustration />
        </div>
      </section>

      {/* How it works — more air */}
      <section id="how-it-works" className="relative z-20 -mt-14 px-6">
        <div className="feature-strip mx-auto max-w-5xl px-6 py-12 md:px-14 md:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                ),
                title: "Continue with support",
                body: "Stay on a coordinated path linking land, growers, and local buyers.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="text-base font-semibold text-[#F3E9DD]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F3E9DD]/60">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section id="pathways" className="section-linen px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C65A1E]">
            Get involved
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-[#1A1A1A] md:text-4xl font-display">
            Three ways to begin.
          </h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a href="#resource-agent" className="nature-card card-green">
              <div className="card-icon">🌿</div>
              <h3 className="text-lg font-semibold">Resource Agent</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-85">
                Guided pathways to programs, training, funding, land, and business resources.
              </p>
              <span className="mt-4 text-sm font-semibold">Find resources →</span>
            </a>

            <a
              href={CULTIVATOR_INTAKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nature-card card-soil"
            >
              <div className="card-icon">🌱</div>
              <h3 className="text-lg font-semibold">Become a Cultivator</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-85">
                Share experience, goals, land access, and training needs.
              </p>
              <span className="mt-4 text-sm font-semibold">Start intake →</span>
            </a>

            <a
              href={LAND_HOST_INTAKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nature-card card-pumpkin sm:col-span-2 lg:col-span-1"
            >
              <div className="card-icon">🌾</div>
              <h3 className="text-lg font-semibold">Become a Land Host</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-90">
                Share available land, water, access, and interest in supporting production.
              </p>
              <span className="mt-4 text-sm font-semibold">Start intake →</span>
            </a>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="nature-card card-denim !min-h-[160px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">Who IB serves</p>
              <h3 className="mt-2 text-base font-semibold">Cultivators, land hosts, buyers &amp; partners</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-80">
                Growers seeking land or support, hosts with underused parcels, and organizations coordinating local food.
              </p>
            </div>

            <div className="nature-card card-soil !min-h-[160px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">What IB coordinates</p>
              <h3 className="mt-2 text-base font-semibold">People · land · resources · markets</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-80">
                Intake pathways, resource discovery, cluster mapping, and structured next steps — not a marketplace.
              </p>
            </div>

            <div className="nature-card card-linen !min-h-[160px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C65A1E]">What to expect</p>
              <h3 className="mt-2 text-base font-semibold">Clear steps, not a list of links</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-70">
                Every path ends with what to prepare, what happens next, and how to stay on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent */}
      <section id="resource-agent" className="px-6 py-20 md:py-28" style={{ background: "#0B3D1E" }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C65A1E]">
            Find the right next step
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-[#F3E9DD] md:text-4xl font-display">
            Resource Discovery Agent
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[#F3E9DD]/60">
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
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10 w-10" />
            <div>
              <p className="text-lg font-semibold tracking-tight text-[#F3E9DD]">INDYpendent Bytes</p>
              <p className="mt-0.5 text-sm text-[#F3E9DD]/45">
                Regional Food Systems Coordination Infrastructure
              </p>
            </div>
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

        {/* Compact Influential Women recognition badge */}
        <div className="relative z-10 mx-auto mt-10 flex max-w-6xl justify-center md:justify-end">
          <RecognitionCard />
        </div>

        <div className="relative z-10 mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-[#F3E9DD]/30 flex flex-col gap-1 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} INDYpendent Bytes</span>
          <span>Built for regional food system coordination</span>
        </div>
      </footer>
    </main>
  );
}
