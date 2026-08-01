import { useEffect, useState } from "react";

/**
 * Crossfade photo loop — real people across the local food system.
 * Images live in /public/hero/ (committed or deployed with the site).
 */
const SLIDES = [
  {
    src: "/hero/01-land-sunrise.jpg",
    alt: "Open land and rolling hills at sunrise",
    label: "Land",
  },
  {
    src: "/hero/02-tilling.jpg",
    alt: "Cultivator tilling soil with a walk-behind tiller",
    label: "Preparing ground",
  },
  {
    src: "/hero/03-harvest.jpg",
    alt: "Grower carrying a crate of fresh harvest",
    label: "Cultivators",
  },
  {
    src: "/hero/04-urban-garden.jpg",
    alt: "Urban grower with a wheelbarrow in a backyard garden",
    label: "Neighborhood land",
  },
  {
    src: "/hero/05-community.jpg",
    alt: "Neighbors working together tending plants",
    label: "Community",
  },
  {
    src: "/hero/06-greenhouse.jpg",
    alt: "Greenhouse production rows and harvest crates",
    label: "Production & logistics",
  },
];

const INTERVAL_MS = 4500;

export default function HeroIllustration() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState({});

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
      {SLIDES.map((slide, i) =>
        failed[i] ? null : (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`hero-slide ${i === index ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
          />
        ),
      )}

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
