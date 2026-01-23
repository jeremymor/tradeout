'use client';

import { useState, useRef, useEffect } from 'react';
import { Country } from '@/lib/data/countries';
import { generateTreemap, shouldShowLabel } from '@/lib/utils/treemap';
import { getSectorColor } from '@/lib/utils/puzzle';
import { TreemapTooltip } from './TreemapTooltip';

interface TreemapProps {
  country: Country;
}

export function Treemap({ country }: TreemapProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, width),
          height: Math.max(200, width * 0.625), // 16:10 aspect ratio
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const blocks = generateTreemap(
    country.exports,
    dimensions.width,
    dimensions.height
  );

  // Calculate total value for percentage display
  const totalValue = country.exports.reduce((sum, exp) => sum + exp.value, 0);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setHoveredBlock(index);
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTooltipPosition({
      x: touch.clientX,
      y: touch.clientY,
    });
    setHoveredBlock(index);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="border-2 border-black bg-white"
      >
        {blocks.map((block, index) => {
          const showFullLabel = shouldShowLabel(block);
          // Show percentage only for smaller blocks (min area 800px)
          const showPercentageOnly = !showFullLabel && block.width * block.height >= 800 && block.width >= 40 && block.height >= 25;
          const color = getSectorColor(block.product.sector);
          const percentage = ((block.product.value / totalValue) * 100).toFixed(1);

          return (
            <g key={index}>
              <rect
                x={block.x}
                y={block.y}
                width={block.width}
                height={block.height}
                fill={color}
                stroke="#000"
                strokeWidth="1"
                opacity={hoveredBlock === index ? 0.8 : 1}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => handleTouchStart(e, index)}
                className="cursor-pointer transition-opacity"
              />
              {showFullLabel && (
                <>
                  <text
                    x={block.x + block.width / 2}
                    y={block.y + block.height / 2 - 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="22"
                    fill="#000"
                    pointerEvents="none"
                    className="select-none font-pixel"
                  >
                    {block.product.name}
                  </text>
                  <text
                    x={block.x + block.width / 2}
                    y={block.y + block.height / 2 + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fill="#000"
                    pointerEvents="none"
                    className="select-none font-pixel"
                  >
                    {percentage}%
                  </text>
                </>
              )}
              {showPercentageOnly && (
                <text
                  x={block.x + block.width / 2}
                  y={block.y + block.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#000"
                  pointerEvents="none"
                  className="select-none font-pixel"
                >
                  {percentage}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredBlock !== null && (
        <TreemapTooltip
          product={blocks[hoveredBlock].product}
          x={tooltipPosition.x}
          y={tooltipPosition.y}
        />
      )}

      {/* Category Legend */}
      <CategoryLegend exports={country.exports} />
    </div>
  );
}

interface CategoryLegendProps {
  exports: Country['exports'];
}

function CategoryLegend({ exports }: CategoryLegendProps) {
  // Get unique sectors from the country's exports
  const uniqueSectors = [...new Set(exports.map((exp) => exp.sector))];

  // Format sector name for display
  const formatSectorName = (sector: string) => {
    return sector.charAt(0).toUpperCase() + sector.slice(1);
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {uniqueSectors.map((sector) => (
        <div
          key={sector}
          className="group relative flex items-center gap-1.5"
        >
          <div
            className="h-4 w-4 border border-black cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: getSectorColor(sector) }}
            title={formatSectorName(sector)}
          />
          {/* Tooltip on hover */}
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="mac-panel whitespace-nowrap px-3 py-1.5 text-base font-pixel">
              {formatSectorName(sector)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
