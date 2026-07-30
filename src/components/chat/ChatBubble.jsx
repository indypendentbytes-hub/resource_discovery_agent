import StickerCard from "../primitives/StickerCard";

export default function ChatBubble({ sender, children }) {
  const borderColor =
    sender === "user" ? "border-l-4 border-ib-denim" : "border-l-4 border-ib-green";

  return (
    <StickerCard>
      <div className={`${borderColor} pl-3`}>
        {children}
      </div>
    </StickerCard>
  );
}
