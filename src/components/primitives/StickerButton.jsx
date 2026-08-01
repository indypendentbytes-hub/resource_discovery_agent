export default function StickerButton({
  children,
  onClick,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#00780F] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#00660D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65A1E]"
      {...props}
    >
      {children}
    </button>
  );
}
