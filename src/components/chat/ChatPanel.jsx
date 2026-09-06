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

  const visibleMessages = messages.slice(-4);

  return (
    <section className="agent-chat-core">
      <div className="agent-chat-copy">
        <p className="agent-chat-kicker">Resource Discovery Agent</p>
        <h3>What are you trying to accomplish?</h3>
        <p>
          Start with the goal. RDA will surface the actors, dependencies, and
          resources only when they become relevant to the path.
        </p>
      </div>

      {messages.length > 1 && (
        <div className="agent-chat-transcript" aria-live="polite">
          {visibleMessages.map((message, index) => (
            <ChatBubble key={`${message.sender}-${index}`} sender={message.sender}>
              {message.text}
            </ChatBubble>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="agent-conversation-bar">
        <label className="sr-only" htmlFor="resource-question">
          Ask the Resource Discovery Agent
        </label>
        <input
          id="resource-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tell RDA what you need, what changed, or what constraint just appeared…"
          className="agent-conversation-input"
          disabled={isSearching}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSearching || !draft.trim()}
          className="agent-conversation-submit"
          aria-label={isSearching ? "Evaluating path" : "Send"}
        >
          {isSearching ? "…" : "↑"}
        </button>
      </form>

      <p className="agent-chat-note">
        RDA evaluates possibilities privately. Named organizations should appear
        only after they are sufficiently validated for the path.
      </p>
    </section>
  );
}
