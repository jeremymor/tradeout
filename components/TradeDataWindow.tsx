'use client';

import { useState, useRef, useCallback } from 'react';
import { RetroWindow } from './RetroWindow';
import { TitleBar } from './TitleBar';
import { TradeDataIcon } from './icons/TradeDataIcon';
import { countries, Country } from '@/lib/data/countries';

interface TradeDataWindowProps {
  onClose: () => void;
  onFocus?: () => void;
  onCountrySelect: (country: Country) => void;
  zIndex?: number;
}

const DOUBLE_CLICK_DELAY = 300;

function formatExportValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}T`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}B`;
  }
  return `$${value}M`;
}

export function TradeDataWindow({ 
  onClose, 
  onFocus, 
  onCountrySelect,
  zIndex = 10 
}: TradeDataWindowProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);
  const lastClickTime = useRef<Record<string, number>>({});

  // Filter countries based on search
  const filteredCountries = countries.filter(country => {
    const query = searchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(query) ||
      country.iso.toLowerCase().includes(query) ||
      country.aliases.some(alias => alias.toLowerCase().includes(query))
    );
  });

  // Sort by total exports descending
  const sortedCountries = [...filteredCountries].sort(
    (a, b) => b.totalExports - a.totalExports
  );

  const handleCountryClick = useCallback((country: Country) => {
    const now = Date.now();
    const lastClick = lastClickTime.current[country.iso] || 0;
    
    if (now - lastClick < DOUBLE_CLICK_DELAY) {
      // Double click - open country detail
      onCountrySelect(country);
      lastClickTime.current[country.iso] = 0;
    } else {
      // Single click - select
      setSelectedCountryIso(country.iso);
      lastClickTime.current[country.iso] = now;
    }
  }, [onCountrySelect]);

  return (
    <div 
      className="fixed"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <RetroWindow 
        className="w-[800px] max-w-[95vw]" 
        initialPosition={{ x: 100, y: 80 }}
      >
        <TitleBar 
          title="Trade Data" 
          onClose={onClose}
          showHelp={false}
        />
        
        <div className="flex flex-col md:flex-row gap-4 p-4 max-h-[70vh]">
          {/* Left side - Globe */}
          <div className="flex flex-col items-center justify-start p-4 border-2 border-black bg-retro-warmGray/50">
            <h3 className="font-pixel text-lg mb-4">World Trade</h3>
            <TradeDataIcon size={160} />
            <p className="font-pixel text-sm text-center mt-4 text-gray-600">
              {countries.length} countries
            </p>
          </div>
          
          {/* Right side - Country List */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mac-input w-full"
              />
            </div>
            
            {/* Column headers */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-2 px-2 py-1 border-b-2 border-black bg-retro-warmGray font-pixel text-sm">
              <span className="w-8"></span>
              <span>Country</span>
              <span className="text-right">Exports</span>
            </div>
            
            {/* Country list */}
            <div className="flex-1 overflow-y-auto hide-scrollbar border-2 border-t-0 border-black bg-white">
              {sortedCountries.map((country) => (
                <div
                  key={country.iso}
                  onClick={() => handleCountryClick(country)}
                  className={`
                    grid grid-cols-[auto_1fr_auto] gap-2 px-2 py-2 
                    border-b border-gray-200 cursor-pointer
                    transition-colors
                    ${selectedCountryIso === country.iso 
                      ? 'bg-black text-white' 
                      : 'hover:bg-retro-warmGray/50'
                    }
                  `}
                >
                  <span className="text-xl w-8">{country.flag}</span>
                  <span className="font-pixel text-sm truncate">
                    {country.name}
                  </span>
                  <span className="font-pixel text-sm text-right whitespace-nowrap">
                    {formatExportValue(country.totalExports)}
                  </span>
                </div>
              ))}
              
              {sortedCountries.length === 0 && (
                <div className="p-4 text-center text-gray-500 font-pixel">
                  No countries found
                </div>
              )}
            </div>
            
            {/* Instructions */}
            <div className="mt-2 px-2 py-1 bg-retro-warmGray border-2 border-black">
              <p className="font-pixel text-xs text-gray-600">
                Double-click a country to view export details
              </p>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
