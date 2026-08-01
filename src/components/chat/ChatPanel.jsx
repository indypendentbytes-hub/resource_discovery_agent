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
    <section className="agent-chat flex min-w-0 flex-col p-5 md:p-7 lg:p-8">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4A84B]">
          Guided navigation
        </p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#F5EDE0] md:text-2xl font-display">
          What are you trying to accomplish?
        </h3>
      </div>

      <div
        className="flex min-h-[240px] flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-black/15 p-4"
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
          className="agent-input min-w-0 flex-1"
          disabled={isSearching}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching || !draft.trim()}
          className="agent-submit"
        >
          {isSearching ? "Searching…" : "Find my path"}
        </button>
      </form>
    </section>
  );
}
