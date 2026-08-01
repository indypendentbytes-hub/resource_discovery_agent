export default function RecognitionCard() {
  return (
    <section
      id="recognition"
      className="bg-white px-4 py-12 md:py-14"
      aria-labelledby="recognition-heading"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="section-eyebrow justify-center">Recognition</p>
        <h2
          id="recognition-heading"
          className="mt-3 text-2xl font-black md:text-3xl max-w-2xl mx-auto"
        >
          Building visible, community-centered food-system infrastructure.
        </h2>
        <div className="mx-auto mt-8 max-w-[520px]">
          <img
            src="https://cdn.bmapinc.com/shareables/20046473/recognition-card/latest.png"
            alt="Recognition received by INDYpendent Bytes"
            className="w-full h-auto rounded-[4px] border border-[#D4CFC6] shadow-sm"
            loading="lazy"
            width="520"
            height="520"
          />
        </div>
      </div>
    </section>
  );
}
