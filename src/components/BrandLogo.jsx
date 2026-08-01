/**
 * INDYpendent Bytes mark — brand palette
 * Pumpkin wheat + denim gear (#043e60) + brand-green leaves
 */
export default function BrandLogo({ className = "h-9 w-9", title = "INDYpendent Bytes" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Gear — denim #043e60 */}
      <g fill="#043e60">
        <path d="M118 118c22 4 38 24 38 48 0 6-1 12-3 17l14 8c4-8 6-16 6-25 0-32-22-58-52-64l-3 16z" />
        <path d="M148 95l8-14 12 7-6 15c-4-3-9-6-14-8z" />
        <path d="M168 118l15-4 4 13-14 5c-1-5-3-9-5-14z" />
        <path d="M172 148l14 6-5 13-14-5c3-4 4-9 5-14z" />
        <path d="M160 175l10 11-10 10-9-12c4-2 7-5 9-9z" />
        <path d="M138 192l4 14-13 4-3-14c4-1 8-2 12-4z" />
      </g>

      {/* Left arc — pumpkin */}
      <path
        d="M100 198c-38 0-68-30-68-68 0-22 10-42 28-54"
        stroke="#C65A1E"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Stem */}
      <rect x="94" y="95" width="12" height="105" rx="3" fill="#C65A1E" />

      {/* Wheat — pumpkin */}
      <g fill="#C65A1E">
        <rect x="97" y="8" width="6" height="42" rx="2" />
        <rect x="82" y="22" width="5" height="28" rx="2" transform="rotate(-12 84.5 36)" />
        <rect x="113" y="22" width="5" height="28" rx="2" transform="rotate(12 115.5 36)" />
        <rect x="72" y="34" width="4.5" height="22" rx="2" transform="rotate(-18 74 45)" />
        <rect x="123" y="34" width="4.5" height="22" rx="2" transform="rotate(18 125 45)" />
        <ellipse cx="100" cy="48" rx="7" ry="11" />
        <ellipse cx="88" cy="56" rx="6" ry="10" transform="rotate(-20 88 56)" />
        <ellipse cx="112" cy="56" rx="6" ry="10" transform="rotate(20 112 56)" />
        <ellipse cx="100" cy="68" rx="8" ry="12" />
        <ellipse cx="85" cy="72" rx="7" ry="11" transform="rotate(-22 85 72)" />
        <ellipse cx="115" cy="72" rx="7" ry="11" transform="rotate(22 115 72)" />
        <ellipse cx="100" cy="88" rx="7" ry="11" />
        <ellipse cx="86" cy="90" rx="6.5" ry="10" transform="rotate(-18 86 90)" />
        <ellipse cx="114" cy="90" rx="6.5" ry="10" transform="rotate(18 114 90)" />
      </g>

      {/* Leaves — brand green */}
      <path
        d="M52 108c-2-18 8-32 22-38 2 14-2 30-12 42-4 5-8 4-10-4z"
        fill="#00780F"
      />
      <path
        d="M72 155c-18-8-28-28-22-42 16 2 30 16 34 32 1 6-4 12-12 10z"
        fill="#00780F"
      />
      <path
        d="M128 155c18-8 28-28 22-42-16 2-30 16-34 32-1 6 4 12 12 10z"
        fill="#2D9B4E"
      />
    </svg>
  );
}
