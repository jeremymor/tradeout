'use client';

import { useEffect, useState } from 'react';
import { RetroWindow } from './RetroWindow';
import { TitleBar } from './TitleBar';
import { RetroButton } from './RetroButton';
import { Country } from '@/lib/data/countries';

interface CongratulationsWindowProps {
  country: Country;
  guessCount: number;
  onClose: () => void;
  onNewGame: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

interface MiniConfetti {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
}

export function CongratulationsWindow({
  country,
  guessCount,
  onClose,
  onNewGame,
  onFocus,
  zIndex = 10,
}: CongratulationsWindowProps) {
  const [confetti, setConfetti] = useState<MiniConfetti[]>([]);

  useEffect(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', 
      '#F38181', '#AA96DA', '#FCBAD3', '#FFD93D',
    ];
    const particles: MiniConfetti[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        size: Math.random() * 6 + 3,
      });
    }

    setConfetti(particles);
  }, []);

  const getMessage = () => {
    if (guessCount === 1) return "INCREDIBLE! First try!";
    if (guessCount === 2) return "AMAZING! Just 2 guesses!";
    if (guessCount <= 4) return "GREAT JOB!";
    return "YOU GOT IT!";
  };

  return (
    <div
      className="fixed"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <RetroWindow
        className="w-[420px] max-w-[95vw]"
        initialPosition={{ x: 250, y: 100 }}
      >
        <TitleBar
          title="🎊 TradeOut Corp - WINNER! 🎊"
          onClose={onClose}
          showHelp={false}
        />

        <div className="relative p-6 overflow-hidden">
          {/* Mini confetti inside the window */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((particle) => (
              <div
                key={particle.id}
                className="absolute animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  animationDelay: `${particle.delay}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-4">
            {/* Festive banner */}
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-2 border-black p-3 -mx-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.5)]">
              <div className="font-pixel text-xs tracking-widest text-yellow-800 mb-1">
                ★ ★ ★ CONGRATULATIONS ★ ★ ★
              </div>
              <div className="font-pixel text-xl text-black">
                {getMessage()}
              </div>
            </div>

            {/* Trophy animation */}
            <div className="text-6xl animate-bounce py-2">
              🏆
            </div>

            {/* Country reveal */}
            <div className="bg-white border-2 border-black p-4 space-y-2">
              <div className="font-pixel text-xs text-gray-600 uppercase tracking-wide">
                The Mystery Country Was
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{country.flag}</span>
                <span className="font-pixel text-2xl font-bold">{country.name}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-retro-warmGray border border-black p-2">
                <div className="font-pixel text-xs text-gray-600">Guesses</div>
                <div className="font-pixel text-lg font-bold">{guessCount}</div>
              </div>
              <div className="bg-retro-warmGray border border-black p-2">
                <div className="font-pixel text-xs text-gray-600">Status</div>
                <div className="font-pixel text-lg font-bold text-green-600">WINNER</div>
              </div>
            </div>

            {/* Decorative message */}
            <div className="font-pixel text-xs text-gray-500 italic">
              🌍 Another victory for the Trade Detective! 🌍
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-2">
              <RetroButton onClick={onNewGame} variant="primary" className="px-8">
                🎮 New Game
              </RetroButton>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
