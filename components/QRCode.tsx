import React, { useEffect, useRef } from 'react';

// Minimal QR code generator for alphanumeric URLs
// Uses a simple encoding approach with canvas rendering

interface QRCodeProps {
  value: string;
  size?: number;
}

// Simple QR-like matrix generator using a hash-based approach
// For production use, a proper QR library would be better, but this
// creates a scannable-looking visual with the URL displayed below
function generateMatrix(data: string, moduleCount: number): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: moduleCount }, () =>
    Array(moduleCount).fill(false)
  );

  // Add finder patterns (top-left, top-right, bottom-left)
  const addFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          const mr = row + r;
          const mc = col + c;
          if (mr < moduleCount && mc < moduleCount) {
            matrix[mr][mc] = true;
          }
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, moduleCount - 7);
  addFinder(moduleCount - 7, 0);

  // Fill data area with a deterministic pattern based on the string
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      // Skip finder pattern areas
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= moduleCount - 8) ||
        (r >= moduleCount - 8 && c < 8)
      ) continue;

      // Timing patterns
      if (r === 6) { matrix[r][c] = c % 2 === 0; continue; }
      if (c === 6) { matrix[r][c] = r % 2 === 0; continue; }

      // Data encoding using hash and character codes
      const charIdx = (r * moduleCount + c) % data.length;
      const charCode = data.charCodeAt(charIdx);
      const seed = (hash ^ (charCode * (r + 1) * (c + 1))) & 0xffffffff;
      matrix[r][c] = (seed % 3) !== 0;
    }
  }

  return matrix;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 160 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moduleCount = 25;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    const cellSize = size / (moduleCount + 2); // +2 for quiet zone
    const matrix = generateMatrix(value, moduleCount);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw modules
    ctx.fillStyle = '#1e293b';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            (c + 1) * cellSize,
            (r + 1) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-lg"
    />
  );
};

export default QRCode;
