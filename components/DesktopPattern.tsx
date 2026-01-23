export function DesktopPattern() {
  return (
    <div className="fixed inset-0 -z-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Noise filter for grainy texture */}
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              result="mono"
            />
            <feComponentTransfer result="adjustedNoise">
              <feFuncR type="linear" slope="0.15" intercept="0" />
              <feFuncG type="linear" slope="0.15" intercept="0" />
              <feFuncB type="linear" slope="0.12" intercept="0" />
              <feFuncA type="linear" slope="0.4" intercept="0" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="adjustedNoise" mode="multiply" />
          </filter>
        </defs>
        {/* Base color - slightly darker than retro-cream (#F5F0E8) */}
        <rect width="100%" height="100%" fill="#D9D0C1" />
        {/* Noise overlay */}
        <rect width="100%" height="100%" fill="#C9C0B1" filter="url(#noise)" opacity="0.6" />
      </svg>
    </div>
  );
}
