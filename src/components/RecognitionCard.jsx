export default function RecognitionCard() {
  return (
    <div className="badge-outer text-center max-w-[200px]">
      <a
        href="https://influentialwomen.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src="https://cdn.bmapinc.com/configurations/config_68454009b3957.png"
          alt="Influential Women Badge"
          className="mx-auto block h-auto w-[180px]"
          width={180}
          height="auto"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="client-name mt-1.5 text-[15px] leading-snug" style={{ fontFamily: "Cambria, Times, serif" }}>
        <a
          href="https://influentialwomen.com/profile/alyssa-duff"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F3E9DD]/85 no-underline hover:underline"
        >
          Alyssa Duff
        </a>
      </div>
    </div>
  );
}
