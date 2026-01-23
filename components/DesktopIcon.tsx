'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DesktopIconProps {
  id: string;
  label: string;
  icon: ReactNode;
  gridPosition: { row: number; col: number };
  onDoubleClick: () => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

// Grid configuration
const GRID_START_X = 16;
const GRID_START_Y = 16;
const GRID_CELL_WIDTH = 110;
const GRID_CELL_HEIGHT = 100;
const GRID_GAP = 8;

const DOUBLE_CLICK_DELAY = 300;

// Calculate pixel position from grid position
function gridToPixel(row: number, col: number): Position {
  return {
    x: GRID_START_X + col * (GRID_CELL_WIDTH + GRID_GAP),
    y: GRID_START_Y + row * (GRID_CELL_HEIGHT + GRID_GAP),
  };
}

export function DesktopIcon({
  id,
  label,
  icon,
  gridPosition,
  onDoubleClick,
  isSelected = false,
  onSelect,
}: DesktopIconProps) {
  // Calculate initial position from grid
  const initialPosition = gridToPixel(gridPosition.row, gridPosition.col);
  
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const lastClickTime = useRef<number>(0);
  const hasDragged = useRef(false);
  const iconRef = useRef<HTMLDivElement>(null);

  // Reset position when gridPosition changes (e.g., on remount/reload)
  useEffect(() => {
    setPosition(gridToPixel(gridPosition.row, gridPosition.col));
  }, [gridPosition.row, gridPosition.col]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Select this icon
    onSelect?.(id);
    
    setIsDragging(true);
    hasDragged.current = false;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position, id, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      // Check if we've moved more than a few pixels (to distinguish from click)
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
        hasDragged.current = true;
      }
      
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, position]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      if (!hasDragged.current) {
        // We didn't drag, check for double-click
        const now = Date.now();
        if (now - lastClickTime.current < DOUBLE_CLICK_DELAY) {
          onDoubleClick();
          lastClickTime.current = 0;
        } else {
          lastClickTime.current = now;
        }
      }
    }
  }, [isDragging, onDoubleClick]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={iconRef}
      className={`
        absolute flex flex-col items-center gap-1 p-2 rounded select-none
        ${isSelected ? 'bg-black/10' : 'hover:bg-black/5'}
        ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: GRID_CELL_WIDTH,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      
      {/* Label */}
      <span 
        className={`
          font-pixel text-sm text-center whitespace-nowrap px-1
          ${isSelected ? 'bg-black text-white' : 'text-black'}
        `}
      >
        {label}
      </span>
    </div>
  );
}
