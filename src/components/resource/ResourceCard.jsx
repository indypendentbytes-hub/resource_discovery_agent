import StickerCard from "../primitives/StickerCard";
import StickerButton from "../primitives/StickerButton";

export default function ResourceCard({ title, details, onSelect }) {
  return (
    <StickerCard>
      <div className="relative z-10">
        <h3 className="mb-1 font-bold">{title}</h3>
        <p className="mb-4 opacity-90">{details}</p>
        <StickerButton onClick={onSelect} aria-label={`View ${title}`}>
          View
        </StickerButton>
      </div>
    </StickerCard>
  );
}
