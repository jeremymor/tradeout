'use client';

import { Country } from '@/lib/data/countries';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface AutocompleteDropdownProps {
  suggestions: Country[];
  selectedIndex: number;
  onSelect: (country: Country) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function AutocompleteDropdown({
  suggestions,
  selectedIndex,
  onSelect,
  inputRef,
}: AutocompleteDropdownProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inputRef?.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [inputRef, suggestions]);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!mounted) return null;

  const dropdown = (
    <div
      ref={dropdownRef}
      className="fixed z-[100] max-h-60 overflow-y-auto border-2 border-black bg-white shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      {suggestions.map((country, index) => (
        <button
          key={country.iso}
          onClick={() => onSelect(country)}
          className={`w-full px-3 py-2 text-left text-base hover:bg-retro-warmGray ${
            index === selectedIndex ? 'bg-retro-warmGray' : ''
          }`}
        >
          {country.flag} {country.name}
        </button>
      ))}
    </div>
  );

  return createPortal(dropdown, document.body);
}
