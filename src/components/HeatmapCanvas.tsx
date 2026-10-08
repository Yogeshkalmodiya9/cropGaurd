import React, { useRef, useEffect } from 'react';
import { AttentionPoint } from '../types';

interface HeatmapCanvasProps {
  imageUrl: string;
  attentionPoints?: AttentionPoint[];
  showHeatmap?: boolean;
  showPoints?: boolean;
  opacity?: number;
  className?: string;
}

export const HeatmapCanvas: React.FC<HeatmapCanvasProps> = ({
  imageUrl,
  attentionPoints = [
    { x: 44, y: 36, radius: 18, intensity: 0.92 },
    { x: 56, y: 54, radius: 22, intensity: 0.95 },
    { x: 38, y: 68, radius: 16, intensity: 0.84 },
  ],
  showHeatmap = true,
  showPoints = false,
  opacity = 0.72,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (showHeatmap && attentionPoints.length > 0) {
      // Create offscreen heat canvas
      const heatCanvas = document.createElement('canvas');
      heatCanvas.width = width;
      heatCanvas.height = height;
      const heatCtx = heatCanvas.getContext('2d');
      if (!heatCtx) return;

      // Draw radial heat spots
      attentionPoints.forEach((pt) => {
        const cx = (pt.x / 100) * width;
        const cy = (pt.y / 100) * height;
        const r = (pt.radius / 100) * width * 1.5;

        const grad = heatCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(239, 68, 68, ${pt.intensity * 0.95})`); // Hot Red
        grad.addColorStop(0.35, `rgba(249, 115, 22, ${pt.intensity * 0.8})`); // Orange
        grad.addColorStop(0.65, `rgba(234, 179, 8, ${pt.intensity * 0.55})`); // Yellow
        grad.addColorStop(0.85, `rgba(132, 204, 22, ${pt.intensity * 0.25})`); // Lime
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)'); // Fades out

        heatCtx.fillStyle = grad;
        heatCtx.beginPath();
        heatCtx.arc(cx, cy, r, 0, Math.PI * 2);
        heatCtx.fill();
      });

      // Blend heat
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(heatCanvas, 0, 0);

      ctx.globalAlpha = opacity * 0.5;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(heatCanvas, 0, 0);
      ctx.restore();
    }

    // Draw focus markers if requested
    if (showPoints && attentionPoints.length > 0) {
      attentionPoints.forEach((pt, idx) => {
        const cx = (pt.x / 100) * width;
        const cy = (pt.y / 100) * height;
        const r = (pt.radius / 100) * width;

        ctx.save();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Marker dot
        ctx.setLineDash([]);
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Text tag
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx + 8, cy - 14, 48, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.fillText(`L-${idx + 1} ${(pt.intensity * 100).toFixed(0)}%`, cx + 12, cy - 1);
        ctx.restore();
      });
    }
  }, [attentionPoints, showHeatmap, showPoints, opacity]);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-neutral-900 ${className}`}>
      {/* Base Leaf Photo is always rendered reliably */}
      <img
        src={imageUrl}
        alt="Analyzed Leaf"
        className="w-full h-full object-cover block"
      />

      {/* Saliency / Heatmap Overlay */}
      {showHeatmap && (
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
        />
      )}
    </div>
  );
};
