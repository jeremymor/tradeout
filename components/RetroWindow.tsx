import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';

interface RetroWindowProps {
  children: ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

export function RetroWindow({ children, className = '', initialPosition, initialSize }: RetroWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number; posX: number; posY: number }>({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  // Initialize position and size on mount
  useEffect(() => {
    if (windowRef.current && position === null) {
      const rect = windowRef.current.getBoundingClientRect();
      
      // Use initialSize if provided, otherwise use CSS size
      const newWidth = initialSize?.width || rect.width;
      const newHeight = initialSize?.height || rect.height;
      
      if (initialPosition) {
        setPosition(initialPosition);
      } else {
        // Center the window if using initialSize
        if (initialSize) {
          const centerX = (window.innerWidth - newWidth) / 2;
          const centerY = (window.innerHeight - newHeight) / 2;
          setPosition({ x: Math.max(20, centerX), y: Math.max(20, centerY) });
        } else {
          setPosition({ x: rect.left, y: rect.top });
        }
      }
      setSize({ width: newWidth, height: newHeight });
    }
  }, [position, initialPosition, initialSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drag from title bar (first child with mac-title-bar class)
    const target = e.target as HTMLElement;
    const titleBar = target.closest('.mac-title-bar');
    
    if (titleBar && windowRef.current) {
      // Don't drag if clicking on buttons
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        return;
      }
      
      e.preventDefault();
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (windowRef.current && position && size) {
      setIsResizing(true);
      setResizeDirection(direction);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
    }
  }, [position, size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setPosition({ x: newX, y: newY });
    } else if (isResizing && resizeDirection) {
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      
      let newWidth = resizeStart.current.width;
      let newHeight = resizeStart.current.height;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;
      
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, resizeStart.current.width + deltaX);
      }
      if (resizeDirection.includes('w')) {
        const possibleWidth = resizeStart.current.width - deltaX;
        if (possibleWidth >= MIN_WIDTH) {
          newWidth = possibleWidth;
          newX = resizeStart.current.posX + deltaX;
        }
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY);
      }
      if (resizeDirection.includes('n')) {
        const possibleHeight = resizeStart.current.height - deltaY;
        if (possibleHeight >= MIN_HEIGHT) {
          newHeight = possibleHeight;
          newY = resizeStart.current.posY + deltaY;
        }
      }
      
      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, isResizing, resizeDirection]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const style = position && size ? {
    position: 'fixed' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    margin: 0,
  } : {};

  return (
    <div
      ref={windowRef}
      className={`mac-window relative ${position ? '' : 'mx-auto my-8 max-w-2xl'} flex flex-col ${className}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      {children}
      
      {/* Resize handles */}
      {position && size && (
        <>
          {/* Edges */}
          <div
            className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="absolute -left-1 top-2 bottom-2 w-2 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="absolute -right-1 top-2 bottom-2 w-2 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          
          {/* Corners */}
          <div
            className="absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          
          {/* Bottom-right corner with classic Mac resize grip */}
          <div
            className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 16 16"
              fill="none"
            >
              <line x1="14" y1="4" x2="4" y2="14" stroke="black" strokeWidth="1" />
              <line x1="14" y1="8" x2="8" y2="14" stroke="black" strokeWidth="1" />
              <line x1="14" y1="12" x2="12" y2="14" stroke="black" strokeWidth="1" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
