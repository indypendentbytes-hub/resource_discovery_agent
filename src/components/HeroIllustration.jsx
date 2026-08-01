export default function HeroIllustration() {
  return (
    <div className="hero-media" aria-label="Illustration of connected local food-system pathways">
      <svg viewBox="0 0 640 440" role="img" aria-labelledby="hero-illustration-title hero-illustration-desc">
        <title id="hero-illustration-title">Connected local food economy</title>
        <desc id="hero-illustration-desc">
          A branded illustration showing land, cultivation, community resources, logistics, and local buyers connected through INDYpendent Bytes.
        </desc>

        <rect x="18" y="18" width="604" height="404" rx="24" fill="#F9F4CB" stroke="#D4CFC6" strokeWidth="2" />
        <path d="M76 332C156 270 206 298 282 248C362 195 438 220 563 132" fill="none" stroke="#005588" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 12" className="hero-route" />

        <g className="hero-float hero-float-one">
          <rect x="52" y="66" width="178" height="112" rx="14" fill="#FFFFFF" stroke="#00780F" strokeWidth="3" />
          <circle cx="92" cy="108" r="20" fill="#00780F" />
          <path d="M87 112c12-24 32-16 29-3-3 13-17 18-29 3Z" fill="#F9F4CB" />
          <text x="124" y="105" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1A1A1A">Cultivators</text>
          <text x="124" y="130" fontFamily="Arial, sans-serif" fontSize="13" fill="#4A4A4A">skills + production</text>
        </g>

        <g className="hero-float hero-float-two">
          <rect x="390" y="58" width="188" height="116" rx="14" fill="#FFFFFF" stroke="#C65A1E" strokeWidth="3" />
          <path d="M430 122h36V92h-36v30Zm8-42h20v12h-20V80Z" fill="#C65A1E" />
          <text x="478" y="103" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1A1A1A">Local buyers</text>
          <text x="478" y="128" fontFamily="Arial, sans-serif" fontSize="13" fill="#4A4A4A">clear demand</text>
        </g>

        <g className="hero-float hero-float-three">
          <rect x="66" y="270" width="188" height="106" rx="14" fill="#FFFFFF" stroke="#005588" strokeWidth="3" />
          <path d="M105 328c0-19 15-34 34-34s34 15 34 34" fill="none" stroke="#005588" strokeWidth="7" strokeLinecap="round" />
          <circle cx="139" cy="293" r="9" fill="#005588" />
          <text x="182" y="315" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1A1A1A">Resources</text>
          <text x="182" y="340" fontFamily="Arial, sans-serif" fontSize="13" fill="#4A4A4A">guided access</text>
        </g>

        <g className="hero-float hero-float-four">
          <rect x="386" y="278" width="190" height="100" rx="14" fill="#FFFFFF" stroke="#00780F" strokeWidth="3" />
          <path d="M420 322h48l-10-19h-38v19Zm8 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm32 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" fill="#00780F" />
          <text x="486" y="318" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1A1A1A">Logistics</text>
          <text x="486" y="343" fontFamily="Arial, sans-serif" fontSize="13" fill="#4A4A4A">coordinated flow</text>
        </g>

        <g className="hero-core">
          <circle cx="320" cy="220" r="68" fill="#00780F" />
          <circle cx="320" cy="220" r="54" fill="#F3E9DD" stroke="#FFFFFF" strokeWidth="3" />
          <text x="320" y="211" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="#005588">INDYpendent</text>
          <text x="320" y="239" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="#005588">Bytes</text>
        </g>

        <circle cx="276" cy="248" r="8" fill="#C65A1E" className="hero-pulse" />
        <circle cx="389" cy="184" r="7" fill="#00780F" className="hero-pulse hero-pulse-delay" />
      </svg>
    </div>
  );
}
