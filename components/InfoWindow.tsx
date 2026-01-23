'use client';

import { RetroWindow } from './RetroWindow';
import { TitleBar } from './TitleBar';

interface InfoWindowProps {
  onClose: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

export function InfoWindow({ onClose, onFocus, zIndex = 10 }: InfoWindowProps) {
  const asciiLogo = `
████████╗██████╗  █████╗ ██████╗ ███████╗ ██████╗ ██╗   ██╗████████╗     ██████╗ ██████╗ ██████╗ ██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗██║   ██║╚══██╔══╝    ██╔════╝██╔═══██╗██╔══██╗██╔══██╗
   ██║   ██████╔╝███████║██║  ██║█████╗  ██║   ██║██║   ██║   ██║       ██║     ██║   ██║██████╔╝██████╔╝
   ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  ██║   ██║██║   ██║   ██║       ██║     ██║   ██║██╔══██╗██╔═══╝ 
   ██║   ██║  ██║██║  ██║██████╔╝███████╗╚██████╔╝╚██████╔╝   ██║       ╚██████╗╚██████╔╝██║  ██║██║     
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝    ╚═╝        ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     
`.trim();

  return (
    <div 
      className="fixed"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <RetroWindow className="w-[700px] max-w-[95vw]" initialPosition={{ x: 150, y: 100 }}>
        <TitleBar 
          title="How to Play" 
          onClose={onClose}
          showHelp={false}
        />
        
        <div className="flex-1 overflow-y-auto p-6 max-h-[70vh] hide-scrollbar">
          {/* ASCII Logo Header */}
          <div className="mb-6 overflow-x-auto hide-scrollbar">
            <pre className="font-mono text-[0.35rem] xs:text-[0.4rem] sm:text-[0.5rem] leading-none text-black/60 whitespace-pre text-center">
              {asciiLogo}
            </pre>
          </div>
          
          <div className="space-y-4 text-base">
            <div>
              <h3 className="mb-2 font-pixel text-lg">Objective</h3>
              <p>
                Guess the mystery country by analyzing its export treemap. You have
                6 attempts to identify the correct country!
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-pixel text-lg">The Treemap</h3>
              <p>
                Each colored block represents an export product. The size of each
                block shows its relative share of the country&apos;s total exports.
                Hover (or tap on mobile) to see details about each product.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-pixel text-lg">Making Guesses</h3>
              <p>
                Type a country name in the input field. The autocomplete will help
                you find matches. Common aliases work too (e.g., &quot;USA&quot; for &quot;United
                States&quot;).
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-pixel text-lg">Feedback</h3>
              <p>After each guess, you&apos;ll see:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>
                  <strong>Distance:</strong> How far your guess is from the target
                </li>
                <li>
                  <strong>Direction:</strong> Arrow pointing toward the target
                </li>
                <li>
                  <strong>Proximity %:</strong> Color-coded closeness (red = far,
                  green = close)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-pixel text-lg">Tips</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Look for distinctive export patterns</li>
                <li>Consider geographic and economic factors</li>
                <li>Use the direction arrows to narrow down regions</li>
                <li>Each puzzle is random - unlimited replays!</li>
              </ul>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
