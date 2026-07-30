export default function StickerCard({ children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-xl border-2 border-ib-denim bg-white p-5 text-text-primaryLight shadow-sticker dark:bg-[#1E1E1E] dark:text-text-primaryDark ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-soil opacity-15 mix-blend-multiply" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
