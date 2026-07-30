export default function StickerButton({ children, onClick, type = "button", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-full border-2 border-ib-denim bg-white px-4 py-2 text-text-primaryLight shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-ib-green/30 dark:bg-[#1E1E1E] dark:text-text-primaryDark"
      {...props}
    >
      {children}
    </button>
  );
}
