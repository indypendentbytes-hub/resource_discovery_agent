import { useState } from "react";
import DiscoveryAgentLayout from "./components/layout/DiscoveryAgentLayout";

const initialMessages = [
  { sender: "assistant", text: "Welcome to Resource Discovery. Tell me what kind of support you need." },
];

const initialResources = [
  { title: "Grower: Example Farm", details: "2 acres • mixed veg • organic-leaning" },
  { title: "Land Host: Example Lot", details: "0.5 acre • water access • zoning OK" },
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [resources] = useState(initialResources);

  function handleSend(text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setMessages((current) => [
      ...current,
      { sender: "user", text: cleanText },
      {
        sender: "assistant",
        text: "I’m checking matching resource categories. This demo currently uses sample records; live search will connect here next.",
      },
    ]);
  }

  function handleResourceSelect(resource) {
    setMessages((current) => [
      ...current,
      {
        sender: "assistant",
        text: `${resource.title}: ${resource.details}. Next, verify availability, eligibility, contact route, and what to prepare before engagement.`,
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-ib-linen px-4 py-8 dark:bg-[#121212]">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">
          INDYpendent Bytes
        </p>
        <h1 className="mb-6 text-4xl font-black text-text-primaryLight dark:text-text-primaryDark md:text-6xl">
          Resource Discovery Agent
        </h1>
        <DiscoveryAgentLayout
          messages={messages}
          resources={resources}
          onSend={handleSend}
          onResourceSelect={handleResourceSelect}
        />
      </div>
    </main>
  );
}
