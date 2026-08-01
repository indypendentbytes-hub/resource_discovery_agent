import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources, onResourceSelect }) {
  return (
    <aside className="agent-resources border-t border-black/10 p-5 md:p-7 lg:border-l lg:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#005588]">
            Recommended next steps
          </p>
          <h3 className="mt-2 text-xl font-black md:text-2xl">Your resource path</h3>
        </div>
        {resources.length > 0 && (
          <span className="rounded-[4px] bg-white px-2.5 py-1 text-xs font-bold border border-black/10">
            {resources.length}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed opacity-70">
        Matches appear here with context, preparation steps, and important
        verification notes.
      </p>

      <div className="mt-5 max-h-[370px] space-y-3 overflow-y-auto pr-1">
        {resources.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-black/20 bg-white/80 p-5">
            <p className="font-bold text-sm">Nothing to sort through yet.</p>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Ask one clear question to begin. Include your location and the
              main barrier you are facing.
            </p>
            <div className="mt-4 space-y-1.5 text-xs opacity-75">
              <p>“I need a place to cultivate food.”</p>
              <p>“I need emergency business funding.”</p>
              <p>“I need food assistance near 46218.”</p>
            </div>
          </div>
        ) : (
          resources.map((resource, index) => (
            <button
              type="button"
              key={resource.id || index}
              onClick={() => onResourceSelect?.(resource)}
              className="block w-full rounded-[4px] bg-white p-1 text-left border border-black/8 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00780F]/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C65A1E]"
            >
              <ResourceCard title={resource.title} details={resource.details} />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
