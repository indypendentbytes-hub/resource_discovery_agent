import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources, onResourceSelect }) {
  return (
    <aside className="agent-resources border-t border-[#D4CFC6] p-5 md:p-7 lg:border-l lg:border-t-0 lg:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C65A1E]">
            Next steps
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#1A1A1A] font-display">
            Your path
          </h3>
        </div>
        {resources.length > 0 && (
          <span className="rounded-full bg-[#00780F]/12 px-2.5 py-0.5 text-xs font-semibold text-[#00780F]">
            {resources.length}
          </span>
        )}
      </div>

      <div className="mt-5 max-h-[380px] space-y-2.5 overflow-y-auto">
        {resources.length === 0 ? (
          <div className="rounded-lg border border-[#D4CFC6] bg-white p-5">
            <p className="text-sm font-semibold text-[#1A1A1A]">How this works</p>
            <ol className="mt-4 space-y-3 text-sm text-[#1A1A1A]/70">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00780F] text-xs font-bold text-white">1</span>
                <span>Describe your goal, location, and any constraints.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#005588] text-xs font-bold text-white">2</span>
                <span>Review matched pathways and resource options.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C65A1E] text-xs font-bold text-white">3</span>
                <span>Prepare for the next step with clear expectations.</span>
              </li>
            </ol>
            <p className="mt-4 text-xs text-[#1A1A1A]/45">
              Try: “I need land near Indianapolis” or “I want to host a grower.”
            </p>
          </div>
        ) : (
          resources.map((resource, index) => (
            <button
              type="button"
              key={resource.id || index}
              onClick={() => onResourceSelect?.(resource)}
              className="resource-item block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C65A1E]"
            >
              <ResourceCard title={resource.title} details={resource.details} />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
