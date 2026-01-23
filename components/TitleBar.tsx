interface TitleBarProps {
  title?: string;
  onHelpClick?: () => void;
  onClose?: () => void;
  showHelp?: boolean;
}

export function TitleBar({ 
  title = 'TradeOut', 
  onHelpClick, 
  onClose,
  showHelp = true,
}: TitleBarProps) {
  return (
    <div className="mac-title-bar flex cursor-grab items-center justify-between px-4 py-2 select-none active:cursor-grabbing">
      <div className="flex items-center gap-2">
        <span className="font-pixel text-xl">{title}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {showHelp && onHelpClick && (
          <button
            onClick={onHelpClick}
            className="flex h-7 w-7 items-center justify-center rounded border border-black bg-retro-warmGray text-base hover:bg-retro-warmGray/80 transition-transform active:scale-95"
            aria-label="Help"
          >
            ?
          </button>
        )}
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded border border-black bg-retro-warmGray text-base hover:bg-retro-warmGray/80 transition-transform active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
