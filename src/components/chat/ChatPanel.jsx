import { useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatPanel({ messages, onSend, isSearching }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanDraft = draft.trim();
    if (!cleanDraft || isSearching) return;
    onSend(cleanDraft);
    setDraft("");
  }

  return (
    <section className="flex min-w-0 flex-col bg-[#FAF8F4] p-5 md:p-6 lg:p-8">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C65A1E]">
          Guided navigation
        </p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#1A1A1A] md:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          What are you trying to accomplish?
        </h3>
      </div>

      <div
        className="flex min-h-[240px] flex-1 flex-col gap-3 overflow-y-auto rounded-xl bg-[#F3E9DD]/50 p-4"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <ChatBubble key={`${message.sender}-${index}`} sender={message.sender}>
            {message.text}
          </ChatBubble>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center"
      >
        <label className="sr-only" htmlFor="resource-question">
          Ask the Resource Discovery Agent
        </label>
        <input
          id="resource-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="e.g. I need land access near Indianapolis…"
          className="min-w-0 flex-1 rounded-xl border border-[#E8E2D9] bg-white px-4 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none transition focus:border-[#00780F] focus:ring-2 focus:ring-[#00780F]/15"
          disabled={isSearching}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching || !draft.trim()}
          className="rounded-xl bg-[#00780F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#00660D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSearching ? "Searching…" : "Find my path"}
        </button>
      </form>
    </section>
  );
}
