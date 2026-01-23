import { Country } from '@/lib/data/countries';
import { RetroButton } from './RetroButton';

interface RevealCardProps {
  country: Country;
  won: boolean;
  onNewGame: () => void;
}

export function RevealCard({ country, won, onNewGame }: RevealCardProps) {
  return (
    <div className="mac-panel space-y-4 text-center">
      <div className="font-pixel text-2xl">
        {won ? '🎉 Congratulations!' : '😔 Game Over'}
      </div>
      <div className="text-xl">
        The country was:{' '}
        <span className="font-bold">
          {country.flag} {country.name}
        </span>
      </div>
      <RetroButton onClick={onNewGame} variant="primary" className="w-full">
        New Game
      </RetroButton>
    </div>
  );
}
