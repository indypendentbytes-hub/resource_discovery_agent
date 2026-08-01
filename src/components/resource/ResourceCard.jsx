export default function ResourceCard({ title, details }) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug">
        {title}
      </h3>
      {details && (
        <p className="mt-1.5 text-xs leading-relaxed text-[#1A1A1A]/60">
          {details}
        </p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#C65A1E]">
        Continue
        <span aria-hidden="true">→</span>
      </span>
    </div>
  );
}
