export default function RecognitionCard() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-white/5" aria-labelledby="recognition-heading">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-bold uppercase tracking-[0.18em] text-ib-denim dark:text-ib-linen">
          Recognition
        </p>
        <h2 id="recognition-heading" className="mt-3 text-3xl font-black md:text-4xl">
          Building visible, community-centered food-system infrastructure.
        </h2>
        <div className="mx-auto mt-8 max-w-[600px] text-center">
          <img
            src="https://cdn.bmapinc.com/shareables/20046473/recognition-card/latest.png"
            alt="Recognition Card"
            width="100%"
            className="rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
