import { useEffect, useState, useRef } from "react";

/**
 * Crossfade photo loop — real people across the local food system.
 * Progressive loading: only the active + next slide download bandwidth.
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
    src: "https://i.imgur.com/Xr4K9EV.jpeg",
    alt: "Greenhouse production rows and harvest crates",
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
  // Track which slide indices are allowed to load
  const [ready, setReady] = useState(() => new Set([0]));
  const prefetched = useRef(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Advance slides
  useEffect(() => {
    if (reducedMotion || SLIDES.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Progressive load: current + next only
  useEffect(() => {
    const next = (index + 1) % SLIDES.length;
    setReady((prev) => {
      if (prev.has(index) && prev.has(next)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(index);
      nextSet.add(next);
      return nextSet;
    });

    // Prefetch next in background without blocking
    const nextSrc = SLIDES[next]?.src;
    if (nextSrc && !prefetched.current.has(nextSrc)) {
      prefetched.current.add(nextSrc);
      prefetch(nextSrc);
    }
  }, [index]);

  // Warm the first image immediately (LCP candidate)
  useEffect(() => {
    const first = SLIDES[0]?.src;
    if (first && !prefetched.current.has(first)) {
      prefetched.current.add(first);
      prefetch(first);
    }
  }, []);

  function goTo(i) {
    setIndex(i);
    setReady((prev) => {
      const nextSet = new Set(prev);
      nextSet.add(i);
      nextSet.add((i + 1) % SLIDES.length);
      return nextSet;
    });
  }

  return (
    <div
      className="hero-media hero-photo-loop"
      aria-label="Photos of people and places across the local food system"
    >
      {SLIDES.map((slide, i) => {
        const isActive = i === index;
        const shouldLoad = ready.has(i);

        return (
          <img
            key={slide.src}
            src={shouldLoad ? slide.src : undefined}
            alt={isActive ? slide.alt : ""}
            className={`hero-slide ${isActive ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
            width={900}
            height={675}
            // Keep layout reserved even before src resolves
            style={shouldLoad ? undefined : { visibility: "hidden" }}
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
