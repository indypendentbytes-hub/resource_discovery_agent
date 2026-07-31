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
    <section className="flex min-w-0 flex-col bg-[#f8f5ec] p-6 dark:bg-[#171717] md:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-ib-denim dark:text-ib-linen">
          Guided resource navigation
        </p>
        <h3 className="mt-2 text-2xl font-black md:text-3xl">
          What are you trying to accomplish?
        </h3>
        <p className="mt-2 max-w-2xl leading-7 opacity-70">
          Share your goal, location, and any barriers. The agent will organize relevant options and explain what to do next.
        </p>
      </div>

      <div
        className="flex min-h-[250px] flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#202020] md:p-5"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <ChatBubble key={`${message.sender}-${index}`} sender={message.sender}>
            {message.text}
          </ChatBubble>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="resource-question">
          Ask the Resource Discovery Agent
        </label>
        <input
          id="resource-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Example: I need land, training, or help starting a business"
          className="min-w-0 flex-1 rounded-xl border border-black/15 bg-white px-5 py-4 text-text-primaryLight outline-none transition placeholder:text-black/45 focus:border-ib-denim focus:ring-4 focus:ring-ib-denim/10 dark:border-white/15 dark:bg-[#202020] dark:text-text-primaryDark dark:placeholder:text-white/45"
        />
        <button
          type="submit"
          disabled={isSearching || !draft.trim()}
          className="rounded-xl bg-ib-denim px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSearching ? "Searching…" : "Find my path"}
        </button>
      </form>
    </section>
  );
}
