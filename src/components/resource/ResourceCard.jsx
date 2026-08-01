export default function ResourceCard({ title, details }) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-[#F3E9DD] leading-snug">{title}</h3>
      {details && (
        <p className="mt-1.5 text-xs leading-relaxed text-[#F3E9DD]/55">{details}</p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#C65A1E]">
        Continue <span aria-hidden="true">→</span>
      </span>
    </div>
  );
}
