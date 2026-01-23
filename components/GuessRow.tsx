import { Guess } from '@/hooks/useGameState';
import { ProximityBadge } from './ProximityBadge';
import { DirectionArrow } from './DirectionArrow';

interface GuessRowProps {
  guess: Guess;
}

export function GuessRow({ guess }: GuessRowProps) {
  return (
    <div className="mac-panel flex items-center justify-between gap-4 text-base">
      <div className="flex-1 font-medium">
        {guess.country.flag} {guess.country.name}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-pixel">{guess.distance.toLocaleString()} km</div>
        </div>
        <DirectionArrow direction={guess.direction} />
        <ProximityBadge proximity={guess.proximity} />
      </div>
    </div>
  );
}
