export default function StickerButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 rounded-full border-2 border-ib-denim
        bg-white dark:bg-[#1E1E1E]
        text-text-primaryLight dark:text-text-primaryDark
        shadow-sm hover:shadow-lg hover:-translate-y-1 transition
      "
    >
      {children}
    </button>
  );
}
