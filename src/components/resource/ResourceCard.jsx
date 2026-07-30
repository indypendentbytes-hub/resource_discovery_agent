import StickerCard from "../primitives/StickerCard";

export default function ResourceCard({ title, details }) {
  return (
    <StickerCard>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="opacity-90">{details}</p>
    </StickerCard>
  );
}
