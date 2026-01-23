'use client';

import { useGameState } from '@/hooks/useGameState';
import { useFirstVisit } from '@/hooks/useFirstVisit';
import { DesktopPattern } from '@/components/DesktopPattern';
import { RetroWindow } from '@/components/RetroWindow';
import { TitleBar } from '@/components/TitleBar';
import { Treemap } from '@/components/Treemap';
import { GuessInput } from '@/components/GuessInput';
import { GuessList } from '@/components/GuessList';
import { InfoWindow } from '@/components/InfoWindow';
import { RevealCard } from '@/components/RevealCard';
import { PixelConfetti } from '@/components/PixelConfetti';
import { DesktopIcon } from '@/components/DesktopIcon';
import { TradeOutIcon } from '@/components/icons/TradeOutIcon';
import { InfoIcon } from '@/components/icons/InfoIcon';
import { TradeDataIcon } from '@/components/icons/TradeDataIcon';
import { TradeDataWindow } from '@/components/TradeDataWindow';
import { CountryExportWindow } from '@/components/CountryExportWindow';
import { Country } from '@/lib/data/countries';
import { useState, useEffect, useCallback } from 'react';

type WindowId = 'game' | 'info' | 'tradeData' | 'countryExport';

function formatExportValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)} trillion`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)} billion`;
  }
  return `$${value} million`;
}

export default function Home() {
  const {
    currentPuzzle,
    guesses,
    gameStatus,
    remainingGuesses,
    submitGuess,
    startNewGame,
  } = useGameState();

  const { isFirstVisit, isLoading, markVisited } = useFirstVisit();
  
  // Window management state
  const [openWindows, setOpenWindows] = useState<Record<WindowId, boolean>>({
    game: true,
    info: false,
    tradeData: false,
    countryExport: false,
  });
  const [windowOrder, setWindowOrder] = useState<WindowId[]>(['game']);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  // State for country export detail window
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Auto-show info on first visit (after loading)
  useEffect(() => {
    if (!isLoading && isFirstVisit) {
      setOpenWindows(prev => ({ ...prev, info: true }));
      setWindowOrder(prev => [...prev.filter(id => id !== 'info'), 'info']);
    }
  }, [isLoading, isFirstVisit]);

  const bringToFront = useCallback((windowId: WindowId) => {
    setWindowOrder(prev => [...prev.filter(id => id !== windowId), windowId]);
  }, []);

  const openWindow = useCallback((windowId: WindowId) => {
    setOpenWindows(prev => ({ ...prev, [windowId]: true }));
    bringToFront(windowId);
  }, [bringToFront]);

  const closeWindow = useCallback((windowId: WindowId) => {
    setOpenWindows(prev => ({ ...prev, [windowId]: false }));
    setWindowOrder(prev => prev.filter(id => id !== windowId));
    if (windowId === 'info' && isFirstVisit) {
      markVisited();
    }
    // Clear selected country when closing export window
    if (windowId === 'countryExport') {
      setSelectedCountry(null);
    }
  }, [isFirstVisit, markVisited]);

  const handleHelpOpen = () => {
    openWindow('info');
  };

  const getZIndex = (windowId: WindowId) => {
    const index = windowOrder.indexOf(windowId);
    return index === -1 ? 10 : 10 + index;
  };

  const handleGuessSubmit = (countryName: string) => {
    submitGuess(countryName);
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };

  // Handler for when a country is selected in TradeDataWindow
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    openWindow('countryExport');
  }, [openWindow]);

  if (!currentPuzzle) {
    return (
      <main className="min-h-screen relative">
        <DesktopPattern />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="font-pixel text-2xl">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen relative overflow-hidden"
      onClick={handleDesktopClick}
    >
      <DesktopPattern />
      
      {gameStatus === 'won' && <PixelConfetti />}

      {/* Desktop Icons */}
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        <DesktopIcon
          id="tradeout"
          label="TradeOut"
          icon={<TradeOutIcon />}
          gridPosition={{ row: 0, col: 0 }}
          onDoubleClick={() => openWindow('game')}
          isSelected={selectedIcon === 'tradeout'}
          onSelect={setSelectedIcon}
        />
        <DesktopIcon
          id="info"
          label="How to Play"
          icon={<InfoIcon />}
          gridPosition={{ row: 1, col: 0 }}
          onDoubleClick={() => openWindow('info')}
          isSelected={selectedIcon === 'info'}
          onSelect={setSelectedIcon}
        />
        <DesktopIcon
          id="tradedata"
          label="Trade Data"
          icon={<TradeDataIcon />}
          gridPosition={{ row: 2, col: 0 }}
          onDoubleClick={() => openWindow('tradeData')}
          isSelected={selectedIcon === 'tradedata'}
          onSelect={setSelectedIcon}
        />
      </div>

      {/* Game Window */}
      {openWindows.game && (
        <div 
          className="relative"
          style={{ zIndex: getZIndex('game') }}
          onMouseDown={() => bringToFront('game')}
        >
          <RetroWindow>
            <TitleBar 
              title="TradeOut"
              onHelpClick={handleHelpOpen} 
              onClose={() => closeWindow('game')}
            />

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Treemap */}
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-pixel text-2xl">
                    Mystery Country&apos;s Exports
                  </h2>
                  <span className="font-pixel text-lg text-gray-600">
                    Total: {formatExportValue(currentPuzzle.totalExports)}
                  </span>
                </div>
                <Treemap country={currentPuzzle} />
              </div>

              {/* Guess History */}
              {guesses.length > 0 && (
                <div>
                  <h3 className="mb-3 font-pixel text-xl">Your Guesses</h3>
                  <GuessList guesses={guesses} />
                </div>
              )}

              {/* Game Over / Reveal */}
              {gameStatus !== 'playing' && (
                <RevealCard
                  country={currentPuzzle}
                  won={gameStatus === 'won'}
                  onNewGame={startNewGame}
                />
              )}

              {/* Input (only show when game is active) */}
              {gameStatus === 'playing' && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-pixel text-xl">Make Your Guess</h3>
                    <div className="font-pixel text-base text-gray-600">
                      {remainingGuesses} {remainingGuesses === 1 ? 'guess' : 'guesses'} left
                    </div>
                  </div>
                  <GuessInput
                    onSubmit={handleGuessSubmit}
                    disabled={gameStatus !== 'playing'}
                  />
                </div>
              )}
            </div>
          </RetroWindow>
        </div>
      )}

      {/* Info Window */}
      {openWindows.info && (
        <InfoWindow
          onClose={() => closeWindow('info')}
          onFocus={() => bringToFront('info')}
          zIndex={getZIndex('info')}
        />
      )}

      {/* Trade Data Window */}
      {openWindows.tradeData && (
        <TradeDataWindow
          onClose={() => closeWindow('tradeData')}
          onFocus={() => bringToFront('tradeData')}
          onCountrySelect={handleCountrySelect}
          zIndex={getZIndex('tradeData')}
        />
      )}

      {/* Country Export Window */}
      {openWindows.countryExport && selectedCountry && (
        <CountryExportWindow
          country={selectedCountry}
          onClose={() => closeWindow('countryExport')}
          onFocus={() => bringToFront('countryExport')}
          zIndex={getZIndex('countryExport')}
        />
      )}
    </main>
  );
}
