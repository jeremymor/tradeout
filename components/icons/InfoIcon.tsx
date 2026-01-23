export function InfoIcon() {
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
      {/* Document with info - pixel art style */}
      {/* Paper background with folded corner */}
      <path
        d="M8 4 L32 4 L40 12 L40 44 L8 44 Z"
        fill="#F5F0E8"
        stroke="#000"
        strokeWidth="2"
      />
      
      {/* Folded corner */}
      <path
        d="M32 4 L32 12 L40 12"
        fill="#D4CFC7"
        stroke="#000"
        strokeWidth="2"
      />
      
      {/* Info circle */}
      <circle cx="24" cy="26" r="10" fill="#5B8C5A" stroke="#000" strokeWidth="2" />
      
      {/* Letter "i" */}
      {/* Dot */}
      <rect x="22" y="20" width="4" height="4" fill="#F5F0E8" />
      {/* Stem */}
      <rect x="22" y="26" width="4" height="8" fill="#F5F0E8" />
      
      {/* Document lines at bottom */}
      <rect x="12" y="38" width="24" height="2" fill="#D4CFC7" />
    </svg>
  );
}
