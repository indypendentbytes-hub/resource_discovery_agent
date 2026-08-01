import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources, onResourceSelect }) {
  return (
    <aside className="agent-resources border-t border-white/10 p-5 md:p-7 lg:border-l lg:border-t-0 lg:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4A84B]">
            Next steps
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#F5EDE0] font-display">
            Your path
          </h3>
        </div>
        {resources.length > 0 && (
          <span className="rounded-full bg-[#D4A84B]/20 px-2.5 py-0.5 text-xs font-semibold text-[#D4A84B]">
            {resources.length}
          </span>
        )}
      </div>

      <div className="mt-5 max-h-[380px] space-y-2.5 overflow-y-auto">
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-5">
            <p className="text-sm font-semibold text-[#F5EDE0]">Nothing here yet</p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#F5EDE0]/50">
              Share a goal, location, and any barriers. Matches will appear here.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-[#F5EDE0]/40">
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
              className="resource-item block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A84B]"
            >
              <ResourceCard title={resource.title} details={resource.details} />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
