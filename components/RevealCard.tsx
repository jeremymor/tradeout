import { Country } from '@/lib/data/countries';
import { RetroButton } from './RetroButton';

interface RevealCardProps {
  country: Country;
  won: boolean;
  onNewGame: () => void;
}

export function RevealCard({ country, won, onNewGame }: RevealCardProps) {
  return (
    <div className="mac-panel space-y-2 text-center py-2 px-3">
      <div className="font-pixel text-sm">
        {won ? '🎉 You got it!' : '😔 Game Over'}
      </div>
      <div className="text-xs">
        <span className="font-bold">
          {country.flag} {country.name}
        </span>
      </div>
      <RetroButton onClick={onNewGame} variant="primary" className="w-full text-xs py-1">
        New Game
      </RetroButton>
    </div>
  );
}
