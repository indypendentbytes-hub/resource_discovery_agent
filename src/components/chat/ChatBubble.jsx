export default function ChatBubble({ sender, children }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser ? "bubble-user" : "bubble-agent"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
