'use client';

interface CountryPixelShapeProps {
  countryCode: string;
  size?: number;
  className?: string;
}

// Simplified pixel art country shapes - 32x32 viewBox
const countryShapes: Record<string, React.ReactNode> = {
  // North America
  US: (
    <>
      <rect x="2" y="10" width="28" height="14" fill="#5B8C5A" />
      <rect x="4" y="8" width="8" height="4" fill="#5B8C5A" />
      <rect x="26" y="14" width="4" height="6" fill="#5B8C5A" />
      <rect x="2" y="18" width="4" height="8" fill="#5B8C5A" />
    </>
  ),
  CA: (
    <>
      <rect x="4" y="4" width="24" height="20" fill="#5B8C5A" />
      <rect x="8" y="2" width="16" height="4" fill="#5B8C5A" />
      <rect x="20" y="20" width="8" height="8" fill="#5B8C5A" />
      <rect x="2" y="8" width="4" height="12" fill="#5B8C5A" />
    </>
  ),
  MX: (
    <>
      <rect x="4" y="6" width="20" height="8" fill="#5B8C5A" />
      <rect x="8" y="14" width="12" height="12" fill="#5B8C5A" />
      <rect x="16" y="22" width="8" height="6" fill="#5B8C5A" />
    </>
  ),
  // South America
  BR: (
    <>
      <rect x="6" y="4" width="20" height="24" fill="#5B8C5A" />
      <rect x="10" y="2" width="12" height="4" fill="#5B8C5A" />
      <rect x="4" y="10" width="4" height="12" fill="#5B8C5A" />
      <rect x="22" y="8" width="6" height="16" fill="#5B8C5A" />
    </>
  ),
  AR: (
    <>
      <rect x="10" y="2" width="12" height="28" fill="#5B8C5A" />
      <rect x="6" y="4" width="6" height="8" fill="#5B8C5A" />
      <rect x="18" y="20" width="8" height="8" fill="#5B8C5A" />
    </>
  ),
  CL: (
    <>
      <rect x="14" y="2" width="4" height="28" fill="#5B8C5A" />
      <rect x="10" y="6" width="6" height="4" fill="#5B8C5A" />
    </>
  ),
  // Europe
  GB: (
    <>
      <rect x="10" y="4" width="12" height="20" fill="#5B8C5A" />
      <rect x="6" y="8" width="6" height="8" fill="#5B8C5A" />
      <rect x="18" y="10" width="6" height="6" fill="#5B8C5A" />
    </>
  ),
  FR: (
    <>
      <rect x="8" y="6" width="16" height="18" fill="#5B8C5A" />
      <rect x="6" y="10" width="4" height="8" fill="#5B8C5A" />
      <rect x="20" y="8" width="6" height="12" fill="#5B8C5A" />
    </>
  ),
  DE: (
    <>
      <rect x="6" y="8" width="20" height="16" fill="#5B8C5A" />
      <rect x="10" y="6" width="12" height="4" fill="#5B8C5A" />
    </>
  ),
  IT: (
    <>
      <rect x="10" y="4" width="12" height="8" fill="#5B8C5A" />
      <rect x="14" y="10" width="8" height="8" fill="#5B8C5A" />
      <rect x="16" y="16" width="6" height="10" fill="#5B8C5A" />
    </>
  ),
  ES: (
    <>
      <rect x="4" y="8" width="24" height="16" fill="#5B8C5A" />
      <rect x="8" y="6" width="8" height="4" fill="#5B8C5A" />
    </>
  ),
  RU: (
    <>
      <rect x="2" y="8" width="28" height="12" fill="#5B8C5A" />
      <rect x="4" y="6" width="20" height="4" fill="#5B8C5A" />
      <rect x="22" y="16" width="8" height="8" fill="#5B8C5A" />
    </>
  ),
  // Asia
  CN: (
    <>
      <rect x="4" y="6" width="24" height="20" fill="#5B8C5A" />
      <rect x="24" y="4" width="6" height="8" fill="#5B8C5A" />
      <rect x="8" y="22" width="12" height="6" fill="#5B8C5A" />
    </>
  ),
  JP: (
    <>
      <rect x="8" y="4" width="8" height="6" fill="#5B8C5A" />
      <rect x="10" y="8" width="12" height="12" fill="#5B8C5A" />
      <rect x="14" y="18" width="8" height="8" fill="#5B8C5A" />
      <rect x="6" y="20" width="6" height="6" fill="#5B8C5A" />
    </>
  ),
  IN: (
    <>
      <rect x="8" y="4" width="16" height="12" fill="#5B8C5A" />
      <rect x="10" y="14" width="12" height="12" fill="#5B8C5A" />
      <rect x="14" y="24" width="6" height="6" fill="#5B8C5A" />
    </>
  ),
  KR: (
    <>
      <rect x="12" y="4" width="8" height="20" fill="#5B8C5A" />
      <rect x="10" y="8" width="4" height="8" fill="#5B8C5A" />
    </>
  ),
  // Oceania
  AU: (
    <>
      <rect x="4" y="8" width="24" height="16" fill="#5B8C5A" />
      <rect x="20" y="6" width="8" height="4" fill="#5B8C5A" />
      <rect x="6" y="22" width="8" height="6" fill="#5B8C5A" />
    </>
  ),
  // Africa
  ZA: (
    <>
      <rect x="6" y="10" width="20" height="16" fill="#5B8C5A" />
      <rect x="10" y="8" width="12" height="4" fill="#5B8C5A" />
    </>
  ),
  EG: (
    <>
      <rect x="8" y="6" width="16" height="20" fill="#5B8C5A" />
      <rect x="20" y="10" width="6" height="8" fill="#5B8C5A" />
    </>
  ),
  NG: (
    <>
      <rect x="8" y="8" width="16" height="16" fill="#5B8C5A" />
      <rect x="6" y="12" width="4" height="8" fill="#5B8C5A" />
    </>
  ),
  // Middle East
  SA: (
    <>
      <rect x="4" y="8" width="24" height="16" fill="#5B8C5A" />
      <rect x="8" y="6" width="8" height="4" fill="#5B8C5A" />
      <rect x="24" y="14" width="4" height="8" fill="#5B8C5A" />
    </>
  ),
};

// Generic landmass shape for countries without specific shapes
const genericShape = (
  <>
    <rect x="8" y="8" width="16" height="16" fill="#5B8C5A" />
    <rect x="6" y="12" width="4" height="8" fill="#5B8C5A" />
    <rect x="22" y="10" width="4" height="12" fill="#5B8C5A" />
  </>
);

export function CountryPixelShape({ 
  countryCode, 
  size = 48,
  className = ''
}: CountryPixelShapeProps) {
  const shape = countryShapes[countryCode] || genericShape;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixelated ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background */}
      <rect x="0" y="0" width="32" height="32" fill="#5B8FA8" rx="2" />
      
      {/* Country shape */}
      {shape}
      
      {/* Pixel border effect */}
      <rect 
        x="1" 
        y="1" 
        width="30" 
        height="30" 
        fill="none" 
        stroke="#000" 
        strokeWidth="2"
        rx="1"
      />
    </svg>
  );
}

// Export the list of countries that have custom shapes
export const countriesWithShapes = Object.keys(countryShapes);
