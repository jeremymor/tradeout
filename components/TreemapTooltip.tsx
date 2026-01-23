'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExportProduct } from '@/lib/data/countries';
import { formatExportValue } from '@/lib/utils/treemap';

interface TreemapTooltipProps {
  product: ExportProduct;
  x: number;
  y: number;
}

export function TreemapTooltip({ product, x, y }: TreemapTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipContent = (
    <div
      className="pointer-events-none fixed z-[9999] mac-panel min-w-[200px] text-base"
      style={{
        left: `${x + 10}px`,
        top: `${y + 10}px`,
      }}
    >
      <div className="font-bold">{product.name}</div>
      <div className="text-sm">
        <div>Value: {formatExportValue(product.value)}</div>
        <div>Share: {product.percentage.toFixed(1)}%</div>
        <div className="capitalize">Sector: {product.sector}</div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(tooltipContent, document.body);
}
