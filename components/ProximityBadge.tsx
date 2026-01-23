interface ProximityBadgeProps {
  proximity: number;
  size?: 'sm' | 'md';
}

export function ProximityBadge({ proximity, size = 'md' }: ProximityBadgeProps) {
  const getColor = (prox: number): string => {
    if (prox >= 80) return 'bg-green-500';
    if (prox >= 60) return 'bg-yellow-500';
    if (prox >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'min-w-[40px] px-1 py-0.5 text-[10px]',
    md: 'min-w-[65px] px-2 py-1 text-base',
  };

  return (
    <div
      className={`rounded border border-black text-center font-pixel text-white ${sizeClasses[size]} ${getColor(
        proximity
      )}`}
    >
      {proximity}%
    </div>
  );
}
