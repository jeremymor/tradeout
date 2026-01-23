'use client';

import { useState, useEffect, useCallback } from 'react';
import { Country } from '@/lib/data/countries';
import { countries } from '@/lib/data/countries';
import { selectRandomCountry } from '@/lib/utils/puzzle';
import { findCountryByName } from '@/lib/utils/fuzzy';
import { calculateDistance, calculateBearing, calculateProximity } from '@/lib/utils/geo';

export interface Guess {
  country: Country;
  distance: number;
  direction: string;
  proximity: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

const HISTORY_KEY = 'tradeout_history';
const MAX_HISTORY = 20;
const MAX_GUESSES = 6;

export function useGameState() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: string[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  }, []);

  // Start a new game
  const startNewGame = useCallback(() => {
    const newPuzzle = selectRandomCountry(countries, history, MAX_HISTORY);
    setCurrentPuzzle(newPuzzle);
    setGuesses([]);
    setGameStatus('playing');
    
    // Add to history
    const newHistory = [...history, newPuzzle.iso].slice(-MAX_HISTORY);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  // Submit a guess
  const submitGuess = useCallback(
    (countryName: string) => {
      if (!currentPuzzle || gameStatus !== 'playing') {
        return false;
      }

      const guessedCountry = findCountryByName(countryName, countries);
      if (!guessedCountry) {
        return false;
      }

      // Check if already guessed
      if (guesses.some((g) => g.country.iso === guessedCountry.iso)) {
        return false;
      }

      // Calculate metrics
      const distance = calculateDistance(
        guessedCountry.lat,
        guessedCountry.lng,
        currentPuzzle.lat,
        currentPuzzle.lng
      );
      const direction = calculateBearing(
        guessedCountry.lat,
        guessedCountry.lng,
        currentPuzzle.lat,
        currentPuzzle.lng
      );
      const proximity = calculateProximity(distance);

      const newGuess: Guess = {
        country: guessedCountry,
        distance,
        direction,
        proximity,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);

      // Check win condition
      if (guessedCountry.iso === currentPuzzle.iso) {
        setGameStatus('won');
        return true;
      }

      // Check loss condition
      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
      }

      return true;
    },
    [currentPuzzle, gameStatus, guesses]
  );

  // Reset game
  const resetGame = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  // Initialize first game
  useEffect(() => {
    if (!currentPuzzle) {
      startNewGame();
    }
  }, [currentPuzzle, startNewGame]);

  return {
    currentPuzzle,
    guesses,
    gameStatus,
    remainingGuesses: MAX_GUESSES - guesses.length,
    submitGuess,
    resetGame,
    startNewGame,
  };
}
