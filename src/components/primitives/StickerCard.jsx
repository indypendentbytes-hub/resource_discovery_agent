export default function StickerCard({ children }) {
  return (
    <div className="
      relative bg-white dark:bg-[#1E1E1E]
      text-text-primaryLight dark:text-text-primaryDark
      rounded-xl border-2 border-ib-denim shadow-sticker p-5
    ">
      <div className="absolute inset-0 bg-soil opacity-15 mix-blend-multiply pointer-events-none"></div>
      {children}
    </div>
  );
}
