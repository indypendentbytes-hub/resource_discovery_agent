import { useEffect, useState, useRef } from "react";

/**
 * Crossfade photo loop — real people across the local food system.
 * Progressive loading: first slide eager; next slide prefetched ahead of time.
 */
const SLIDES = [
  {
    src: "https://i.imgur.com/UgXbG6X.jpeg",
    alt: "Open land and rolling hills at sunrise",
    label: "Land",
  },
  {
    src: "https://i.imgur.com/sGjs98i.jpeg",
    alt: "Cultivator tilling soil with a walk-behind tiller",
    label: "Preparing ground",
  },
  {
    src: "https://i.imgur.com/5U7S7UY.jpeg",
    alt: "Grower carrying a crate of fresh harvest",
    label: "Cultivators",
  },
  {
    src: "https://i.imgur.com/MIumY3W.jpeg",
    alt: "Urban grower with a wheelbarrow in a backyard garden",
    label: "Neighborhood land",
  },
  {
    src: "https://i.imgur.com/tnpPJ4i.jpeg",
    alt: "Workers loading crates of produce onto a delivery truck",
    label: "Production & logistics",
  },
];

const INTERVAL_MS = 4500;

function prefetch(src) {
  if (!src || typeof window === "undefined") return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export default function HeroIllustration() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const prefetched = useRef(new Set([SLIDES[0].src]));

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

  // Ensure current + next are loaded; prefetch next
  useEffect(() => {
    const next = (index + 1) % SLIDES.length;
    setLoaded((prev) => {
      if (prev.has(index) && prev.has(next)) return prev;
      const s = new Set(prev);
      s.add(index);
      s.add(next);
      return s;
    });
    const nextSrc = SLIDES[next].src;
    if (!prefetched.current.has(nextSrc)) {
      prefetched.current.add(nextSrc);
      prefetch(nextSrc);
    }
  }, [index]);

  function goTo(i) {
    setIndex(i);
    setLoaded((prev) => {
      const s = new Set(prev);
      s.add(i);
      s.add((i + 1) % SLIDES.length);
      return s;
    });
  }

  return (
    <div
      className="hero-media hero-photo-loop"
      aria-label="Photos of people and places across the local food system"
    >
      {SLIDES.map((slide, i) => {
        const isActive = i === index;
        const shouldShow = loaded.has(i);

        return (
          <img
            key={slide.src}
            src={shouldShow ? slide.src : undefined}
            alt={isActive ? slide.alt : ""}
            className={`hero-slide ${isActive ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
            width={900}
            height={675}
          />
        );
      })}

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
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
