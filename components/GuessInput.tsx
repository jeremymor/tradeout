'use client';

import { useState, useRef, useEffect } from 'react';
import { Country } from '@/lib/data/countries';
import { countries } from '@/lib/data/countries';
import { fuzzyMatch } from '@/lib/utils/fuzzy';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { RetroButton } from './RetroButton';

interface GuessInputProps {
  onSubmit: (countryName: string) => void;
  disabled: boolean;
}

export function GuessInput({ onSubmit, disabled }: GuessInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const matches = fuzzyMatch(input, countries);
      setSuggestions(matches);
      setSelectedIndex(0);
      setShowDropdown(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showDropdown && suggestions.length > 0) {
        setInput(suggestions[selectedIndex].name);
        setShowDropdown(false);
        setTimeout(() => handleSubmit(), 0);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSelect = (country: Country) => {
    setInput(country.name);
    setShowDropdown(false);
    setTimeout(() => handleSubmit(), 0);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a country name..."
          className="mac-input flex-1 disabled:opacity-50"
          autoComplete="off"
        />
        <RetroButton
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          variant="primary"
        >
          Guess
        </RetroButton>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <AutocompleteDropdown
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}
