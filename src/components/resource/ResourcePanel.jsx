import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources, onResourceSelect }) {
  return (
    <aside className="border-t border-[#E8E2D9] bg-white p-5 md:p-6 lg:border-l lg:border-t-0 lg:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005588]">
            Next steps
          </p>
          <h3
            className="mt-1.5 text-xl font-semibold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your path
          </h3>
        </div>
        {resources.length > 0 && (
          <span className="rounded-full bg-[#00780F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00780F]">
            {resources.length}
          </span>
        )}
      </div>

      <div className="mt-5 max-h-[380px] space-y-2.5 overflow-y-auto">
        {resources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D4CFC6] bg-[#FAF8F4] p-5">
            <p className="text-sm font-semibold text-[#1A1A1A]">
              Nothing here yet
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#1A1A1A]/55">
              Share a goal, location, and any barriers. Matches will appear here.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-[#1A1A1A]/50">
              <li>“I need a place to cultivate food.”</li>
              <li>“I need business funding near 46218.”</li>
              <li>“I want to host land for growers.”</li>
            </ul>
          </div>
        ) : (
          resources.map((resource, index) => (
            <button
              type="button"
              key={resource.id || index}
              onClick={() => onResourceSelect?.(resource)}
              className="block w-full rounded-xl border border-[#E8E2D9] bg-[#FAF8F4] text-left transition hover:border-[#00780F]/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C65A1E]"
            >
              <ResourceCard title={resource.title} details={resource.details} />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
