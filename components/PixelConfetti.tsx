'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  fallSpeed: number;
  shape: 'rect' | 'square';
}

export function PixelConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Classic confetti colors
    const colors = [
      '#FF0000', // Red
      '#FF6B00', // Orange
      '#FFD700', // Gold
      '#00FF00', // Green
      '#00BFFF', // Sky blue
      '#FF1493', // Pink
      '#9400D3', // Purple
      '#FFFF00', // Yellow
      '#00FF7F', // Spring green
      '#FF69B4', // Hot pink
    ];
    const newParticles: Particle[] = [];

    // Many more particles for full screen coverage
    for (let i = 0; i < 200; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 100, // Start above the screen
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        size: Math.random() * 10 + 6, // 6-16px sizes
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720, // -360 to 360 deg/s
        swayAmplitude: Math.random() * 60 + 20, // 20-80px sway
        swaySpeed: Math.random() * 2 + 1, // 1-3s per sway
        fallSpeed: Math.random() * 3 + 4, // 4-7s to fall
        shape: Math.random() > 0.3 ? 'rect' : 'square',
      });
    }

    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0.8;
          }
        }
        @keyframes confetti-sway {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(var(--sway));
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          <div
            style={{
              backgroundColor: particle.color,
              width: particle.shape === 'rect' ? `${particle.size}px` : `${particle.size * 0.6}px`,
              height: particle.shape === 'rect' ? `${particle.size * 0.6}px` : `${particle.size}px`,
              animation: `confetti-fall ${particle.fallSpeed}s ease-in-out ${particle.delay}s forwards, confetti-sway ${particle.swaySpeed}s ease-in-out ${particle.delay}s infinite`,
              // @ts-ignore
              '--sway': `${particle.swayAmplitude}px`,
              boxShadow: `1px 1px 0 rgba(0,0,0,0.2)`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
