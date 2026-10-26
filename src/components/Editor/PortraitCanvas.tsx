import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eye, SplitSquareVertical, Move, RefreshCw } from 'lucide-react';
import { TransformationSettings, ImageSource } from '../../types';
import { renderHabibti } from '../../engine/renderPipeline';

interface PortraitCanvasProps {
  imageSource: ImageSource;
  settings: TransformationSettings;
  onUpdateCrop: (panX: number, panY: number, zoom?: number) => void;
  isProcessing?: boolean;
}

export const PortraitCanvas: React.FC<PortraitCanvasProps> = ({
  imageSource,
  settings,
  onUpdateCrop,
  isProcessing = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Before / After Comparison states
  const [showOriginal, setShowOriginal] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // % across canvas
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Interactive Drag-to-Position on Canvas
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Target preview size
  const PREVIEW_RESOLUTION = 900; // Sharp square preview

  // Core render function
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSource.img) return;

    if (splitMode) {
      // Split view: render transformed on a buffer, original on another, then combine
      const transformedCanvas = document.createElement('canvas');
      renderHabibti(transformedCanvas, {
        width: PREVIEW_RESOLUTION,
        height: PREVIEW_RESOLUTION,
        settings,
        sourceImage: imageSource.img,
        renderOriginalOnly: false,
      });

      const originalCanvas = document.createElement('canvas');
      renderHabibti(originalCanvas, {
        width: PREVIEW_RESOLUTION,
        height: PREVIEW_RESOLUTION,
        settings,
        sourceImage: imageSource.img,
        renderOriginalOnly: true,
      });

      canvas.width = PREVIEW_RESOLUTION;
      canvas.height = PREVIEW_RESOLUTION;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw transformed on left side, original on right side (or vice versa)
      const splitPx = (splitPosition / 100) * PREVIEW_RESOLUTION;

      // Draw transformed
      ctx.drawImage(transformedCanvas, 0, 0);

      // Clip and draw original on right side
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitPx, 0, PREVIEW_RESOLUTION - splitPx, PREVIEW_RESOLUTION);
      ctx.clip();
      ctx.drawImage(originalCanvas, 0, 0);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#F3EFE6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitPx, 0);
      ctx.lineTo(splitPx, PREVIEW_RESOLUTION);
      ctx.stroke();

      // Split indicator circle
      ctx.fillStyle = '#171715';
      ctx.beginPath();
      ctx.arc(splitPx, PREVIEW_RESOLUTION / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F3EFE6';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      renderHabibti(canvas, {
        width: PREVIEW_RESOLUTION,
        height: PREVIEW_RESOLUTION,
        settings,
        sourceImage: imageSource.img,
        renderOriginalOnly: showOriginal,
      });
    }
  }, [imageSource, settings, showOriginal, splitMode, splitPosition]);

  // Request Animation Frame debounced render
  useEffect(() => {
    let animId: number;
    animId = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(animId);
  }, [redraw]);

  // Mouse / Touch handlers for Drag-to-Position
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (splitMode) return;
    setIsDraggingImage(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: settings.crop.panX,
      initialPanY: settings.crop.panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingSplit && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSplitPosition(pct);
      return;
    }

    if (!isDraggingImage || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Convert pixel delta to percentage (-50 to 50 scale)
    const panDeltaX = (dx / rect.width) * 100;
    const panDeltaY = (dy / rect.height) * 100;

    const newPanX = Math.max(-50, Math.min(50, dragStartRef.current.initialPanX + panDeltaX));
    const newPanY = Math.max(-50, Math.min(50, dragStartRef.current.initialPanY + panDeltaY));

    onUpdateCrop(newPanX, newPanY);
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
    setIsDraggingSplit(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    const newZoom = Math.max(0.8, Math.min(3.0, settings.crop.zoom + delta));
    onUpdateCrop(settings.crop.panX, settings.crop.panY, newZoom);
  };

  return (
    <div className="space-y-4">
      {/* Artwork Frame */}
      <div className="p-3 sm:p-5 bg-[#E9E2D5] rounded-sm shadow-art border border-[#DCD3C4]">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden bg-[#171715] shadow-inner select-none ${
            isDraggingImage ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Main Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain block"
          />

          {/* Interactive Drag Hint Overlay */}
          <div className="absolute top-3 left-3 pointer-events-none bg-[#171715]/75 backdrop-blur-sm text-[#F3EFE6] px-2.5 py-1 rounded-sm text-[10px] font-mono tracking-wider flex items-center gap-1.5 opacity-70">
            <Move className="w-3 h-3 text-[#B5A68C]" />
            Drag photo to center eyes
          </div>

          {/* Processing Spinner Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none transition-opacity">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#171715] rounded-full text-xs font-mono text-[#F3EFE6] border border-[#DCD3C4]/30 shadow-lg">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B5A68C]" />
                Rendering...
              </div>
            </div>
          )}

          {/* Eye Slit Guide Marks (subtle alignment indicators on the sides) */}
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all flex items-center justify-between px-2"
            style={{
              top: `${settings.eyeOpening.positionY}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <div className="w-2.5 h-[1.5px] bg-[#B5A68C]/50" />
            <div className="w-2.5 h-[1.5px] bg-[#B5A68C]/50" />
          </div>

          {/* Split Mode Handle */}
          {splitMode && (
            <div
              className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize z-30"
              style={{ left: `${splitPosition}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSplit(true);
              }}
            >
              <div className="w-7 h-7 rounded-full bg-[#171715] border-2 border-[#F3EFE6] text-[#F3EFE6] flex items-center justify-center shadow-lg">
                <SplitSquareVertical className="w-3.5 h-3.5 text-[#B5A68C]" />
              </div>
            </div>
          )}
        </div>

        {/* Frame Caption / Dimensions */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-[#777168]">
          <span>HABIBTI FINE ART PREVIEW</span>
          <span>{imageSource.width} × {imageSource.height} px source</span>
        </div>
      </div>

      {/* Comparison Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#E9E2D5]/70 border border-[#DCD3C4] rounded-sm">
        <div className="flex items-center gap-2">
          {/* Hold to view original */}
          <button
            type="button"
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              showOriginal
                ? 'bg-[#171715] text-[#F3EFE6]'
                : 'bg-[#F3EFE6] text-[#242320] hover:bg-[#F8F6F0] border border-[#DCD3C4]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#8E7D62]" />
            Hold for Original
          </button>

          {/* Split slider toggle */}
          <button
            type="button"
            onClick={() => {
              setSplitMode(!splitMode);
              setShowOriginal(false);
            }}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              splitMode
                ? 'bg-[#171715] text-[#F3EFE6]'
                : 'bg-[#F3EFE6] text-[#242320] hover:bg-[#F8F6F0] border border-[#DCD3C4]'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-[#8E7D62]" />
            Split Slider
          </button>
        </div>

        <span className="text-[10px] font-mono text-[#777168]">
          {splitMode ? `Slide to compare (${Math.round(splitPosition)}%)` : 'Scroll wheel to zoom'}
        </span>
      </div>
    </div>
  );
};
