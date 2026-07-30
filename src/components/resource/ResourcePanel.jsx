import SoilPanel from "../primitives/SoilPanel";
import HeaderSticker from "../primitives/HeaderSticker";
import DenimDivider from "../primitives/DenimDivider";
import ResourceCard from "./ResourceCard";

export default function ResourcePanel({ resources }) {
  return (
    <div className="w-full md:w-1/3 overflow-y-auto">
      <HeaderSticker>Resource Panel</HeaderSticker>
      <DenimDivider />

      <SoilPanel>
        {resources.length === 0 && (
          <div className="opacity-70">No filters applied yet. Choose a category to begin.</div>
        )}

        {resources.map((r, i) => (
          <ResourceCard key={i} title={r.title} details={r.details} />
        ))}
      </SoilPanel>
    </div>
  );
}
