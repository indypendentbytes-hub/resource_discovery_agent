import { useEffect, useState, useRef } from "react";

/**
 * Crossfade photo loop — optimized for LCP / Speed Insights.
 * - Only the active slide is in the DOM at full priority
 * - Autoplay starts after first paint + short delay
 * - Prefetch only the next slide, not the whole set
 */
const SLIDES = [
  {
    src: "https://i.imgur.com/UgXbG6Xh.jpeg",
    alt: "Open land and rolling hills at sunrise",
    label: "Land",
  },
  {
    src: "https://i.imgur.com/sGjs98ih.jpeg",
    alt: "Cultivator tilling soil with a walk-behind tiller",
    label: "Preparing ground",
  },
  {
    src: "https://i.imgur.com/5U7S7UYh.jpeg",
    alt: "Grower carrying a crate of fresh harvest",
    label: "Cultivators",
  },
  {
    src: "https://i.imgur.com/MIumY3Wh.jpeg",
    alt: "Urban grower with a wheelbarrow in a backyard garden",
    label: "Neighborhood land",
  },
  {
    src: "https://i.imgur.com/tnpPJ4ih.jpeg",
    alt: "Workers loading crates of produce onto a delivery truck",
    label: "Production & logistics",
  },
];

const INTERVAL_MS = 5500;
const AUTOPLAY_DELAY_MS = 2500;

function prefetch(src) {
  if (!src || typeof window === "undefined") return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export default function HeroIllustration() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [autoplayReady, setAutoplayReady] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const prefetched = useRef(new Set([SLIDES[0].src]));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Don't start carousel until after first paint — protects LCP
  useEffect(() => {
    const start = () => setAutoplayReady(true);
    let idleId;
    let timeoutId;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: AUTOPLAY_DELAY_MS });
    } else {
      timeoutId = window.setTimeout(start, AUTOPLAY_DELAY_MS);
    }

    return () => {
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!autoplayReady || reducedMotion || SLIDES.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoplayReady, reducedMotion]);

  // Prefetch only the next slide after first image has loaded
  useEffect(() => {
    if (!firstLoaded) return;
    const next = (index + 1) % SLIDES.length;
    const nextSrc = SLIDES[next].src;
    if (!prefetched.current.has(nextSrc)) {
      prefetched.current.add(nextSrc);
      prefetch(nextSrc);
    }
  }, [index, firstLoaded]);

  function goTo(i) {
    setIndex(i);
    const nextSrc = SLIDES[(i + 1) % SLIDES.length].src;
    if (!prefetched.current.has(nextSrc)) {
      prefetched.current.add(nextSrc);
      prefetch(nextSrc);
    }
  }

  const active = SLIDES[index];

  return (
    <div
      className="hero-media hero-photo-loop"
      aria-label="Photos of people and places across the local food system"
    >
      {/* Single active image keeps DOM light and LCP focused */}
      <img
        key={active.src}
        src={active.src}
        alt={active.alt}
        className="hero-slide is-active"
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={index === 0 ? "high" : "auto"}
        width={640}
        height={480}
        sizes="(max-width: 768px) 100vw, 560px"
        onLoad={() => {
          if (index === 0) setFirstLoaded(true);
        }}
      />

      <div className="hero-slide-caption">
        <span className="hero-slide-label">{active.label}</span>
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
