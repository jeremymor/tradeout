interface TradeDataIconProps {
  size?: number;
}

export function TradeDataIcon({ size = 48 }: TradeDataIconProps) {
  // Scale factor based on default size of 48
  const scale = size / 48;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Globe background - ocean */}
      <circle cx="24" cy="24" r="20" fill="#5B8FA8" stroke="#2D4A5E" strokeWidth="2" />
      
      {/* Simplified continents */}
      {/* North America */}
      <path
        d="M12 14 L16 12 L20 14 L18 18 L14 20 L10 16 Z"
        fill="#5B8C5A"
        stroke="#3D5A3D"
        strokeWidth="1"
      />
      
      {/* South America */}
      <path
        d="M14 24 L18 26 L16 34 L12 30 Z"
        fill="#5B8C5A"
        stroke="#3D5A3D"
        strokeWidth="1"
      />
      
      {/* Europe */}
      <path
        d="M28 12 L34 14 L32 18 L28 16 Z"
        fill="#5B8C5A"
        stroke="#3D5A3D"
        strokeWidth="1"
      />
      
      {/* Africa */}
      <path
        d="M30 20 L36 22 L34 32 L28 30 L30 24 Z"
        fill="#5B8C5A"
        stroke="#3D5A3D"
        strokeWidth="1"
      />
      
      {/* Asia hint */}
      <path
        d="M36 16 L40 18 L38 22 L36 20 Z"
        fill="#5B8C5A"
        stroke="#3D5A3D"
        strokeWidth="1"
      />
      
      {/* Grid lines - equator */}
      <ellipse cx="24" cy="24" rx="20" ry="6" fill="none" stroke="#2D4A5E" strokeWidth="1" opacity="0.4" />
      
      {/* Meridian */}
      <ellipse cx="24" cy="24" rx="6" ry="20" fill="none" stroke="#2D4A5E" strokeWidth="1" opacity="0.4" />
      
      {/* Highlight */}
      <ellipse cx="16" cy="16" rx="4" ry="6" fill="#fff" opacity="0.15" />
      
      {/* Bar chart overlay - bottom right */}
      <rect x="30" y="28" width="12" height="14" fill="#F5F0E6" stroke="#2D4A5E" strokeWidth="1.5" rx="1" />
      
      {/* Chart bars */}
      <rect x="32" y="36" width="2" height="4" fill="#E07A5F" />
      <rect x="35" y="33" width="2" height="7" fill="#F2CC8F" />
      <rect x="38" y="30" width="2" height="10" fill="#5B8C5A" />
      
      {/* Globe rim highlight */}
      <circle cx="24" cy="24" r="20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
