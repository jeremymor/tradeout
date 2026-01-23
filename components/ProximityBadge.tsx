interface ProximityBadgeProps {
  proximity: number;
}

export function ProximityBadge({ proximity }: ProximityBadgeProps) {
  const getColor = (prox: number): string => {
    if (prox >= 80) return 'bg-green-500';
    if (prox >= 60) return 'bg-yellow-500';
    if (prox >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={`min-w-[65px] rounded border border-black px-2 py-1 text-center font-pixel text-base text-white ${getColor(
        proximity
      )}`}
    >
      {proximity}%
    </div>
  );
}
