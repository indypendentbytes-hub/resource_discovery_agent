import { useEffect, useState } from "react";

/**
 * Crossfade photo loop — real people across the local food system.
 *
 * Photos provided by INDYpendent Bytes. Additional slides will be added
 * as files land in /public/hero/ or via continued uploads.
 */
const SLIDES = [
  {
    src: "https://i.imgur.com/UgXbG6X.jpeg",
    alt: "Open land and rolling hills at sunrise",
    label: "Land",
  },
  {
    src: "https://i.imgur.com/Xr4K9EV.jpeg",
    alt: "Greenhouse production rows and harvest crates",
    label: "Production & logistics",
  },
  // Remaining user photos — add when available:
  // 02-tilling, 03-harvest, 04-urban-garden, 05-community
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
    if (reducedMotion || SLIDES.length < 2) return undefined;
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
