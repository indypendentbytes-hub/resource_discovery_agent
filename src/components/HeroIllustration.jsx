/**
 * System map: people · land · resources · buyers · logistics
 * connected through the IB coordination hub.
 */
export default function HeroIllustration() {
  return (
    <div
      className="hero-media"
      aria-label="Illustration of connected local food-system pathways"
    >
      <svg
        viewBox="0 0 640 440"
        role="img"
        aria-labelledby="hero-illustration-title hero-illustration-desc"
      >
        <title id="hero-illustration-title">Connected local food economy</title>
        <desc id="hero-illustration-desc">
          Land, cultivators, resources, logistics, and local buyers connected
          through INDYpendent Bytes coordination infrastructure.
        </desc>

        {/* Linen panel */}
        <rect
          x="12"
          y="12"
          width="616"
          height="416"
          rx="16"
          fill="#F3E9DD"
          stroke="#D4CFC6"
          strokeWidth="2"
        />

        {/* Soft soil path */}
        <path
          d="M40 380 Q180 300 320 220 Q460 140 600 80"
          fill="none"
          stroke="#5C4033"
          strokeWidth="3"
          strokeOpacity="0.15"
          strokeDasharray="6 10"
        />

        {/* Connection routes — denim dashed */}
        <path
          d="M160 140 Q240 180 320 220"
          fill="none"
          stroke="#005588"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="hero-route"
        />
        <path
          d="M480 130 Q400 170 320 220"
          fill="none"
          stroke="#005588"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="hero-route"
        />
        <path
          d="M150 310 Q230 270 320 220"
          fill="none"
          stroke="#005588"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="hero-route"
        />
        <path
          d="M490 310 Q410 270 320 220"
          fill="none"
          stroke="#005588"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="hero-route"
        />

        {/* Cultivators — green */}
        <g className="hero-float-one">
          <rect x="48" y="70" width="170" height="100" rx="8" fill="#FFFFFF" stroke="#00780F" strokeWidth="2.5" />
          <circle cx="88" cy="120" r="18" fill="#00780F" />
          <path d="M82 124c10-20 28-14 26-2s-14 16-26 2Z" fill="#F9F4CB" />
          <text x="116" y="112" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#1A1A1A">Cultivators</text>
          <text x="116" y="132" fontFamily="system-ui,sans-serif" fontSize="12" fill="#5C4033">skills · production</text>
        </g>

        {/* Local buyers — pumpkin */}
        <g className="hero-float-two">
          <rect x="422" y="60" width="170" height="100" rx="8" fill="#FFFFFF" stroke="#C65A1E" strokeWidth="2.5" />
          <rect x="448" y="92" width="28" height="36" rx="3" fill="#C65A1E" />
          <path d="M452 92h20v-10h-20z" fill="#E07A3A" />
          <text x="488" y="108" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#1A1A1A">Local buyers</text>
          <text x="488" y="128" fontFamily="system-ui,sans-serif" fontSize="12" fill="#5C4033">clear demand</text>
        </g>

        {/* Land — soil */}
        <g className="hero-float-three">
          <rect x="48" y="280" width="170" height="100" rx="8" fill="#FFFFFF" stroke="#5C4033" strokeWidth="2.5" />
          <path d="M72 350c0-20 18-36 36-36s36 16 36 36" fill="none" stroke="#5C4033" strokeWidth="6" strokeLinecap="round" />
          <circle cx="108" cy="318" r="8" fill="#00780F" />
          <text x="156" y="320" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#1A1A1A">Land</text>
          <text x="156" y="340" fontFamily="system-ui,sans-serif" fontSize="12" fill="#5C4033">hosts · access</text>
        </g>

        {/* Resources — denim */}
        <g className="hero-float-four">
          <rect x="422" y="280" width="170" height="100" rx="8" fill="#FFFFFF" stroke="#005588" strokeWidth="2.5" />
          <circle cx="462" cy="330" r="20" fill="none" stroke="#005588" strokeWidth="3" />
          <path d="M462 318v12l8 5" stroke="#005588" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="492" y="322" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#1A1A1A">Resources</text>
          <text x="492" y="342" fontFamily="system-ui,sans-serif" fontSize="12" fill="#5C4033">guided access</text>
        </g>

        {/* IB hub core */}
        <g className="hero-core">
          <circle cx="320" cy="220" r="64" fill="#00780F" />
          <circle cx="320" cy="220" r="50" fill="#F9F4CB" stroke="#FFFFFF" strokeWidth="3" />
          <text x="320" y="212" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="700" fill="#005588">INDYpendent</text>
          <text x="320" y="234" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="700" fill="#005588">Bytes</text>
        </g>

        {/* Pulse nodes */}
        <circle cx="240" cy="180" r="6" fill="#C65A1E" className="hero-pulse" />
        <circle cx="400" cy="180" r="6" fill="#00780F" className="hero-pulse hero-pulse-delay" />
        <circle cx="240" cy="260" r="5" fill="#005588" className="hero-pulse" />
        <circle cx="400" cy="260" r="5" fill="#C65A1E" className="hero-pulse hero-pulse-delay" />
      </svg>
    </div>
  );
}
