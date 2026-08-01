export default function StickerCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-[#E8E2D9] bg-white p-4 ${className}`}
    >
      {children}
    </div>
  );
}
