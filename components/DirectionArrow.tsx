import { getDirectionArrow, Direction } from '@/lib/utils/geo';

interface DirectionArrowProps {
  direction: string;
  size?: 'sm' | 'md';
}

export function DirectionArrow({ direction, size = 'md' }: DirectionArrowProps) {
  const arrow = getDirectionArrow(direction as Direction);
  
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-2xl',
  };
  
  return (
    <div className={sizeClasses[size]} aria-label={`Direction: ${direction}`}>
      {arrow}
    </div>
  );
}
