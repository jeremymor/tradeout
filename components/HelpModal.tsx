'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RetroButton } from './RetroButton';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="mac-window max-w-2xl border-2 border-black">
        <DialogHeader>
          <DialogTitle className="mac-title-bar px-4 py-2 font-pixel text-xl">
            How to Play TradeOut
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-6 text-base">
          <div>
            <h3 className="mb-2 font-pixel text-lg">🎯 Objective</h3>
            <p>
              Guess the mystery country by analyzing its export treemap. You have
              6 attempts to identify the correct country!
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-pixel text-lg">📊 The Treemap</h3>
            <p>
              Each colored block represents an export product. The size of each
              block shows its relative share of the country&apos;s total exports.
              Hover (or tap on mobile) to see details about each product.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-pixel text-lg">🔍 Making Guesses</h3>
            <p>
              Type a country name in the input field. The autocomplete will help
              you find matches. Common aliases work too (e.g., &quot;USA&quot; for &quot;United
              States&quot;).
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-pixel text-lg">📍 Feedback</h3>
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
            <h3 className="mb-2 font-pixel text-lg">🎮 Tips</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>Look for distinctive export patterns</li>
              <li>Consider geographic and economic factors</li>
              <li>Use the direction arrows to narrow down regions</li>
              <li>Each puzzle is random - unlimited replays!</li>
            </ul>
          </div>

          <div className="pt-4">
            <RetroButton onClick={onClose} className="w-full" variant="primary">
              Got it!
            </RetroButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
