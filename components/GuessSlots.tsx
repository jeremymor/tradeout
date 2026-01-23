'use client';

import { Guess } from '@/hooks/useGameState';
import { ProximityBadge } from './ProximityBadge';
import { DirectionArrow } from './DirectionArrow';

interface GuessSlotsProps {
  guesses: Guess[];
  maxGuesses?: number;
}

export function GuessSlots({ guesses, maxGuesses = 6 }: GuessSlotsProps) {
  const slots = Array.from({ length: maxGuesses }, (_, i) => guesses[i] || null);

  return (
    <div className="space-y-2.5">
      {slots.map((guess, index) => (
        <div
          key={index}
          className={`
            mac-panel flex items-center justify-between gap-4 py-2.5 px-4
            ${guess ? '' : 'opacity-50'}
          `}
        >
          {guess ? (
            <>
              <div className="flex-1 font-pixel text-base font-medium truncate">
                {guess.country.flag} {guess.country.name}
              </div>
              <div className="flex items-center gap-3">
                <div className="font-pixel text-sm text-right whitespace-nowrap">
                  {guess.distance.toLocaleString()} km
                </div>
                <DirectionArrow direction={guess.direction} size="sm" />
                <ProximityBadge proximity={guess.proximity} size="sm" />
              </div>
            </>
          ) : (
            <div className="flex-1 font-pixel text-base text-gray-400 text-center">
              Guess {index + 1}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
