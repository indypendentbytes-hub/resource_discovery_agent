import { useState } from "react";
import ChatBubble from "./ChatBubble";
import StickerButton from "../primitives/StickerButton";

export default function ChatPanel({ messages, onSend, isSearching = false }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (isSearching) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <section className="flex w-full flex-col gap-4 md:w-2/3 md:pr-4">
      <div className="flex max-h-[32rem] flex-col gap-4 overflow-y-auto pr-1" aria-live="polite">
        {messages.map((message, index) => (
          <ChatBubble key={`${message.sender}-${index}`} sender={message.sender}>
            {message.text}
          </ChatBubble>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="resource-question">
          Ask the Resource Discovery Agent
        </label>
        <input
          id="resource-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What resource or support do you need?"
          disabled={isSearching}
          className="min-w-0 flex-1 rounded-full border-2 border-ib-denim bg-white px-4 py-3 text-text-primaryLight outline-none focus:ring-4 focus:ring-ib-green/30 disabled:opacity-60 dark:bg-[#1E1E1E] dark:text-text-primaryDark"
        />
        <StickerButton type="submit" disabled={isSearching}>
          {isSearching ? "Checking…" : "Ask"}
        </StickerButton>
      </form>
    </section>
  );
}
