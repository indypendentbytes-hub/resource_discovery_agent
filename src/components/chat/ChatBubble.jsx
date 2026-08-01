export default function ChatBubble({ sender, children }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-[#00780F] text-white rounded-br-md"
            : "bg-white text-[#1A1A1A] border border-[#E8E2D9] rounded-bl-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
