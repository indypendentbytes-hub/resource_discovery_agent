import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources, onResourceSelect }) {
  return (
    <aside className="border-t border-black/10 bg-[#eef2e8] p-6 dark:border-white/10 dark:bg-[#20251f] md:p-8 lg:border-l lg:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ib-denim dark:text-ib-linen">
            Recommended next steps
          </p>
          <h3 className="mt-2 text-2xl font-black">Your resource path</h3>
        </div>
        {resources.length > 0 && (
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black shadow-sm dark:bg-white/10">
            {resources.length}
          </span>
        )}
      </div>

      <p className="mt-3 leading-7 opacity-70">
        Matches appear here with context, preparation steps, and important verification notes.
      </p>

      <div className="mt-6 max-h-[390px] space-y-4 overflow-y-auto pr-1">
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-6 dark:border-white/20 dark:bg-white/5">
            <p className="font-black">Nothing to sort through yet.</p>
            <p className="mt-2 leading-7 opacity-70">
              Ask one clear question to begin. Include your location and the main barrier you are facing.
            </p>
            <div className="mt-5 space-y-2 text-sm opacity-75">
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
              className="block w-full rounded-2xl bg-white p-1 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"
            >
              <ResourceCard title={resource.title} details={resource.details} />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
