'use client';

import { RetroWindow } from './RetroWindow';
import { TitleBar } from './TitleBar';
import { CountryPixelShape } from './CountryPixelShape';
import { Country } from '@/lib/data/countries';
import { getSectorColor } from '@/lib/utils/puzzle';

interface CountryExportWindowProps {
  country: Country;
  onClose: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

function formatExportValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)} trillion`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)} billion`;
  }
  return `$${value} million`;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Capitalize sector name
function formatSector(sector: string): string {
  return sector.charAt(0).toUpperCase() + sector.slice(1);
}

export function CountryExportWindow({ 
  country, 
  onClose, 
  onFocus, 
  zIndex = 10 
}: CountryExportWindowProps) {
  // Sort exports by value descending
  const sortedExports = [...country.exports].sort((a, b) => b.value - a.value);
  
  return (
    <div 
      className="fixed"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <RetroWindow 
        className="w-[550px] max-w-[95vw]" 
        initialPosition={{ x: 200, y: 120 }}
      >
        <TitleBar 
          title={`${country.name} - Exports`}
          onClose={onClose}
          showHelp={false}
        />
        
        <div className="p-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
          {/* Country Header */}
          <div className="flex items-center gap-4 mb-4 p-3 border-2 border-black bg-retro-warmGray">
            {/* Pixel art country shape */}
            <CountryPixelShape countryCode={country.iso} size={64} />
            
            {/* Country info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{country.flag}</span>
                <h2 className="font-pixel text-xl">{country.name}</h2>
              </div>
              <p className="font-pixel text-sm text-gray-600 mt-1">
                ISO: {country.iso}
              </p>
            </div>
          </div>
          
          {/* Total Exports */}
          <div className="mb-4 p-3 border-2 border-black bg-white">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-base">Total Exports:</span>
              <span className="font-pixel text-lg font-bold">
                {formatExportValue(country.totalExports)}
              </span>
            </div>
          </div>
          
          {/* Export Products */}
          <div className="border-2 border-black">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 bg-retro-warmGray border-b-2 border-black">
              <span className="font-pixel text-sm">Product</span>
              <span className="font-pixel text-sm text-right w-20">Value</span>
              <span className="font-pixel text-sm text-right w-14">Share</span>
              <span className="font-pixel text-sm text-right w-20">Sector</span>
            </div>
            
            {/* Export rows */}
            <div className="bg-white">
              {sortedExports.map((product, index) => (
                <div
                  key={product.name}
                  className={`
                    grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 items-center
                    ${index < sortedExports.length - 1 ? 'border-b border-gray-200' : ''}
                  `}
                >
                  <span className="font-pixel text-sm truncate">
                    {product.name}
                  </span>
                  <span className="font-pixel text-xs text-right w-20 whitespace-nowrap">
                    ${(product.value / 1000).toFixed(1)}B
                  </span>
                  <span className="font-pixel text-xs text-right w-14">
                    {formatPercentage(product.percentage)}
                  </span>
                  <span 
                    className="font-pixel text-xs px-2 py-1 rounded text-center w-20 border border-black/20"
                    style={{ backgroundColor: getSectorColor(product.sector) }}
                  >
                    {formatSector(product.sector)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coordinates info */}
          <div className="mt-4 p-2 bg-retro-warmGray/50 border border-black/30">
            <p className="font-pixel text-xs text-gray-500">
              Coordinates: {country.lat.toFixed(2)}°, {country.lng.toFixed(2)}°
            </p>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
