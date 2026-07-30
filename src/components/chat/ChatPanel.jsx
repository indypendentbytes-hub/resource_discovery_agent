import ChatBubble from "./ChatBubble";

export default function ChatPanel({ messages }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto w-full md:w-2/3 pr-4">
      {messages.map((m, i) => (
        <ChatBubble key={i} sender={m.sender}>
          {m.text}
        </ChatBubble>
      ))}
    </div>
  );
}
