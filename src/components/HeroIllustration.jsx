import { useEffect, useState } from "react";

/**
 * Crossfade photo loop — real people across the local food system.
 * Images: community gardens, growers, markets, shared land.
 */
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
    alt: "Community garden with raised beds and growing vegetables",
    label: "Community gardens",
  },
  {
    src: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=900&q=80",
    alt: "Grower harvesting fresh produce in a field",
    label: "Cultivators at work",
  },
  {
    src: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80",
    alt: "Fresh vegetables at a local market stall",
    label: "Local markets",
  },
  {
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80",
    alt: "Hands planting seedlings in soil",
    label: "Shared land",
  },
  {
    src: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&q=80",
    alt: "People working together in a community garden",
    label: "Neighbors coordinating",
  },
  {
    src: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4a6?w=900&q=80",
    alt: "Tractor and farmland at sunrise",
    label: "Regional production",
  },
];

const INTERVAL_MS = 4500;

export default function HeroIllustration() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div
      className="hero-media hero-photo-loop"
      aria-label="Photos of people and places across the local food system"
    >
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`hero-slide ${i === index ? "is-active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      <div className="hero-slide-caption">
        <span className="hero-slide-label">{SLIDES[index].label}</span>
        <div className="hero-slide-dots" role="tablist" aria-label="Photo slides">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slide.label}
              className={`hero-dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
