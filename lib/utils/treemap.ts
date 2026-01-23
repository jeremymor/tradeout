import { ExportProduct } from '@/lib/data/countries';

export interface TreemapBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  product: ExportProduct;
}

/**
 * Generate treemap layout using squarified algorithm
 * @param exports Array of export products
 * @param width Container width
 * @param height Container height
 * @returns Array of positioned treemap blocks
 */
export function generateTreemap(
  exports: ExportProduct[],
  width: number,
  height: number
): TreemapBlock[] {
  // Sort by value descending for better layout
  const sortedExports = [...exports].sort((a, b) => b.value - a.value);
  
  // Calculate total value
  const totalValue = sortedExports.reduce((sum, exp) => sum + exp.value, 0);
  
  // Simple row-based treemap algorithm
  const blocks: TreemapBlock[] = [];
  let currentY = 0;
  let currentRow: ExportProduct[] = [];
  let currentRowValue = 0;
  
  for (let i = 0; i < sortedExports.length; i++) {
    const product = sortedExports[i];
    
    currentRow.push(product);
    currentRowValue += product.value;
    
    // Check if we should start a new row
    const isLastProduct = i === sortedExports.length - 1;
    const currentRowRatio = currentRowValue / totalValue;
    const remainingRatio = 1 - (currentY / height);
    
    if (isLastProduct || currentRowRatio >= remainingRatio * 0.8) {
      // Layout current row
      const rowHeight = (currentRowValue / totalValue) * height;
      let currentX = 0;
      
      for (const rowProduct of currentRow) {
        const blockWidth = (rowProduct.value / currentRowValue) * width;
        
        blocks.push({
          x: currentX,
          y: currentY,
          width: blockWidth,
          height: rowHeight,
          product: rowProduct,
        });
        
        currentX += blockWidth;
      }
      
      currentY += rowHeight;
      currentRow = [];
      currentRowValue = 0;
    }
  }
  
  return blocks;
}

/**
 * Check if a block is large enough to display a label
 * @param block Treemap block
 * @param minArea Minimum area in pixels (default 2000)
 * @returns True if block should show label
 */
export function shouldShowLabel(
  block: TreemapBlock,
  minArea: number = 2000
): boolean {
  const area = block.width * block.height;
  return area >= minArea;
}

/**
 * Format export value for display
 * @param value Export value in millions USD
 * @returns Formatted string (e.g., "$12.5B")
 */
export function formatExportValue(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  }
  return `$${value.toFixed(0)}M`;
}
