import { getDirectionArrow, Direction } from '@/lib/utils/geo';

interface DirectionArrowProps {
  direction: string;
}

export function DirectionArrow({ direction }: DirectionArrowProps) {
  const arrow = getDirectionArrow(direction as Direction);
  
  return (
    <div className="text-2xl" aria-label={`Direction: ${direction}`}>
      {arrow}
    </div>
  );
}
