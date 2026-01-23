export function TradeOutIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pixelated"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Treemap-style icon representing trade/exports */}
      {/* Outer border */}
      <rect x="4" y="4" width="40" height="40" fill="#F5F0E8" stroke="#000" strokeWidth="2" />
      
      {/* Treemap blocks - colorful export categories */}
      {/* Large block - top left */}
      <rect x="6" y="6" width="20" height="18" fill="#4A7C59" stroke="#000" strokeWidth="1" />
      
      {/* Medium block - top right */}
      <rect x="26" y="6" width="16" height="10" fill="#E07A5F" stroke="#000" strokeWidth="1" />
      
      {/* Small block - middle right */}
      <rect x="26" y="16" width="16" height="8" fill="#81B29A" stroke="#000" strokeWidth="1" />
      
      {/* Bottom left block */}
      <rect x="6" y="24" width="12" height="18" fill="#F2CC8F" stroke="#000" strokeWidth="1" />
      
      {/* Bottom middle block */}
      <rect x="18" y="24" width="14" height="10" fill="#3D405B" stroke="#000" strokeWidth="1" />
      
      {/* Bottom right large */}
      <rect x="32" y="24" width="10" height="18" fill="#E07A5F" stroke="#000" strokeWidth="1" />
      
      {/* Bottom middle-bottom */}
      <rect x="18" y="34" width="14" height="8" fill="#81B29A" stroke="#000" strokeWidth="1" />
      
      {/* Globe/trade arrows overlay - simplified */}
      <circle cx="24" cy="24" r="6" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M20 24 L28 24 M24 20 L24 28" stroke="#000" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
