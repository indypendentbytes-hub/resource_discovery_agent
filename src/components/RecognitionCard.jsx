export default function RecognitionCard() {
  return (
    <section id="recognition" className="px-6 py-20 md:py-28" aria-labelledby="recognition-heading">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div className="order-2 md:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C65A1E]">
              Recognition
            </p>
            <h2
              id="recognition-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-[#1A1A1A] md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Building visible, community-centered food-system infrastructure.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/65 md:text-base">
              INDYpendent Bytes has been recognized for practical coordination
              work that connects people, land, and opportunity across the region.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://cdn.bmapinc.com/shareables/20046473/recognition-card/latest.png"
              alt="Recognition received by INDYpendent Bytes"
              className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-[0_12px_40px_rgba(26,26,26,0.1)]"
              loading="lazy"
              width="480"
              height="480"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
