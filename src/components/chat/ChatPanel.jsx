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
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#005588]">
          Guided resource navigation
        </p>
        <h3 className="mt-2 text-xl font-black md:text-2xl">
          What are you trying to accomplish?
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70 md:text-base">
          Share your goal, location, and any barriers. The agent will organize
          relevant options and explain what to do next.
        </p>
      </div>

      <div
        className="flex min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto rounded-[4px] border border-black/10 bg-white p-4"
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
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="resource-question">
          Ask the Resource Discovery Agent
        </label>
        <input
          id="resource-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Example: I need land, training, or help starting a business"
          className="agent-input min-w-0 flex-1 px-4 py-3 text-sm"
          disabled={isSearching}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching || !draft.trim()}
          className="agent-submit px-5 py-3 text-sm"
        >
          {isSearching ? "Searching…" : "Find my path"}
        </button>
      </form>
    </section>
  );
}
