import { Guess } from '@/hooks/useGameState';
import { GuessRow } from './GuessRow';

interface GuessListProps {
  guesses: Guess[];
}

export function GuessList({ guesses }: GuessListProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {guesses.map((guess, index) => (
        <GuessRow key={index} guess={guess} />
      ))}
    </div>
  );
}
