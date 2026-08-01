export default function RecognitionCard() {
  return (
    <section
      id="recognition"
      className="section-cream px-6 py-16 md:py-20"
      aria-labelledby="recognition-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 rounded-lg border border-[#D4CFC6] bg-[#F3E9DD] px-8 py-10 md:grid-cols-[1fr_1.1fr] md:gap-14 md:px-12 md:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C65A1E]">
              Recognition
            </p>
            <h2
              id="recognition-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-[#1A1A1A] md:text-3xl font-display"
            >
              Building visible, community-centered food-system infrastructure.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/65 md:text-base">
              INDYpendent Bytes has been recognized for practical coordination
              work that connects people, land, and opportunity across the region.
            </p>
          </div>
          <div>
            <img
              src="https://cdn.bmapinc.com/shareables/20046473/recognition-card/latest.png"
              alt="Recognition received by INDYpendent Bytes"
              className="mx-auto w-full max-w-sm h-auto rounded-lg shadow-lg"
              loading="lazy"
              width="400"
              height="400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
