import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Sparkles,
  RefreshCw,
  ZoomIn,
  MoveVertical,
  MoveHorizontal,
  RotateCw,
  Check,
  Eye,
  Crosshair,
  Sliders,
} from 'lucide-react';
import { DrawableImage } from './types';
import { getSampleImage } from './constants/sampleImages';
import { renderHabibtiCover, loadReferenceImage } from './engine/habibtiRenderer';

export const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Source Image
  const [sourceImage, setSourceImage] = useState<DrawableImage | null>(null);
  const [imageName, setImageName] = useState<string>('habibti');
  const [refImage, setRefImage] = useState<HTMLImageElement | null>(null);

  // Precision alignment controls
  const [zoom, setZoom] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(2);
  const [rotation, setRotation] = useState<number>(0);

  // Tape eye window customization
  const [eyeY, setEyeY] = useState<number>(41.5); // % from top
  const [eyeWidth, setEyeWidth] = useState<number>(44); // % width
  const [eyeHeight, setEyeHeight] = useState<number>(13.5); // % height
  const [style, setStyle] = useState<'original' | 'classic' | 'noir'>('original');

  // Alignment guide overlay
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Dragging state on canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, initPanX: 0, initPanY: 0 });

  // Download feedback
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Load 2000x2000 master reference image & default sample
  useEffect(() => {
    loadReferenceImage()
      .then((img) => setRefImage(img))
      .catch((err) => console.log('Ref image load error:', err));

    const sampleCanvas = getSampleImage('sample-female-1');
    setSourceImage(sampleCanvas);
    setImageName('sample');
  }, []);

  // Redraw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;

    renderHabibtiCover(
      canvas,
      {
        width: 1000,
        height: 1000,
        sourceImage,
        panX,
        panY,
        zoom,
        rotation,
        eyeY,
        eyeHeight,
        eyeWidth,
        style,
        contrast: 28,
        tapeOpacity: 0.88,
        eyeBrightness: 4,
        eyeContrast: 22,
      },
      refImage
    );

    // Optional Eye Alignment Guide overlay
    if (showGuide) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        const eyeCenterY = (eyeY / 100) * 1000;
        const eyeW = (eyeWidth / 100) * 1000;
        const eyeX = (1000 - eyeW) / 2;
        const eyeH = (eyeHeight / 100) * 1000;
        const eyeTop = eyeCenterY - eyeH / 2;

        // Eye center line (cyan dashed)
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeCenterY);
        ctx.lineTo(eyeX + eyeW, eyeCenterY);
        ctx.stroke();

        // Eye box boundary
        ctx.strokeStyle = '#FF3366';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(eyeX, eyeTop, eyeW, eyeH);

        // Center crosshair
        ctx.beginPath();
        ctx.moveTo(500, eyeTop);
        ctx.lineTo(500, eyeTop + eyeH);
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [sourceImage, panX, panY, zoom, rotation, eyeY, eyeHeight, eyeWidth, style, refImage, showGuide]);

  useEffect(() => {
    let anim = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(anim);
  }, [redraw]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setImageName(file.name.replace(/\.[^/.]+$/, ''));
        // Reset pan
        setPanX(0);
        setPanY(0);
        setZoom(1.15);
        setRotation(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Direct canvas drag-to-position
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initPanX: panX,
      initPanY: panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const deltaX = (dx / rect.width) * 100;
    const deltaY = (dy / rect.height) * 100;

    setPanX(Math.max(-50, Math.min(50, dragStart.current.initPanX + deltaX)));
    setPanY(Math.max(-50, Math.min(50, dragStart.current.initPanY + deltaY)));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setZoom((prev) => Math.max(0.6, Math.min(3.5, prev + delta)));
  };

  // High-Res Download (Full 2000x2000 Master Quality)
  const handleDownload = () => {
    if (!sourceImage) return;
    setDownloading(true);

    try {
      const exportCanvas = document.createElement('canvas');
      renderHabibtiCover(
        exportCanvas,
        {
          width: 2000,
          height: 2000,
          sourceImage,
          panX,
          panY,
          zoom,
          rotation,
          eyeY,
          eyeHeight,
          eyeWidth,
          style,
          contrast: 30,
          tapeOpacity: 0.88,
          eyeBrightness: 4,
          eyeContrast: 22,
        },
        refImage
      );

      const link = document.createElement('a');
      link.download = `habibti-${imageName}.jpg`;
      link.href = exportCanvas.toDataURL('image/jpeg', 0.96);
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#242320] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-[#B5A68C]/30">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Clean Minimal Header */}
      <header className="text-center space-y-1 mb-5">
        <h1 className="font-serif text-3xl sm:text-5xl tracking-[0.22em] uppercase font-bold text-[#171715]">
          HABIBTI
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[#777168] font-mono">
          Album Cover Generator
        </p>
      </header>

      {/* Main Studio Frame */}
      <main className="w-full max-w-lg flex flex-col items-center space-y-5">
        {/* Album Artwork Card */}
        <div className="w-full relative group">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`w-full aspect-square bg-[#171715] rounded-sm shadow-2xl overflow-hidden relative border-4 border-[#E9E2D5] select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full object-cover block" />

            {/* Drag hint overlay */}
            <div className="absolute bottom-3 left-3 pointer-events-none bg-black/60 backdrop-blur-sm text-[#F3EFE6] text-[10px] font-mono px-2.5 py-1 rounded tracking-wider flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span>Drag to move photo • Scroll to zoom</span>
            </div>

            {/* Guide active badge */}
            {showGuide && (
              <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded tracking-wider">
                Alignment Guide Active
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Upload & Try Sample */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3.5 px-4 rounded bg-[#171715] text-[#F3EFE6] hover:bg-[#2c2b28] active:scale-[0.99] font-mono text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#B5A68C]" />
            Upload Your Photo
          </button>

          <button
            onClick={() => {
              const canvas = getSampleImage('sample-female-1');
              setSourceImage(canvas);
              setImageName('sample');
              setPanX(0);
              setPanY(2);
              setZoom(1.2);
              setRotation(0);
            }}
            className="py-3.5 px-4 rounded bg-[#E9E2D5] border border-[#DCD3C4] hover:bg-[#ded4c3] text-[#242320] font-mono text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Load sample portrait"
          >
            <Sparkles className="w-4 h-4 text-[#8E7D62]" />
            Sample
          </button>
        </div>

        {/* Tape Style Pills & Alignment Toggle */}
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            {[
              { id: 'original', name: 'Original Tape', icon: '🏷️' },
              { id: 'classic', name: 'Masking Tape', icon: '📦' },
              { id: 'noir', name: 'Dark Noir', icon: '🖤' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStyle(st.id as any)}
                className={`py-2 px-2 rounded text-[11px] font-mono tracking-wider transition-all border flex items-center justify-center gap-1 ${
                  style === st.id
                    ? 'bg-[#171715] text-[#F3EFE6] border-[#171715] shadow-sm font-semibold'
                    : 'bg-[#E9E2D5] text-[#242320] border-[#DCD3C4] hover:border-[#B5A68C]'
                }`}
              >
                <span>{st.icon}</span>
                <span className="truncate">{st.name}</span>
              </button>
            ))}
          </div>

          {/* Guide toggle button */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2 rounded border transition-all text-xs flex items-center gap-1 ${
              showGuide
                ? 'bg-red-500 text-white border-red-600 font-semibold shadow-inner'
                : 'bg-[#E9E2D5] border-[#DCD3C4] text-[#242320] hover:border-[#B5A68C]'
            }`}
            title="Toggle Eye Alignment Guide"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Essential Positioning Controls */}
        <div className="w-full bg-[#E9E2D5]/70 border border-[#DCD3C4] rounded p-4 space-y-3.5">
          {/* Zoom Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="flex items-center gap-1 text-[#242320]">
                <ZoomIn className="w-3.5 h-3.5 text-[#777168]" />
                Photo Zoom
              </span>
              <span className="text-[#777168]">{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
            />
          </div>

          {/* Move Up/Down Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="flex items-center gap-1 text-[#242320]">
                <MoveVertical className="w-3.5 h-3.5 text-[#777168]" />
                Move Up / Down
              </span>
              <span className="text-[#777168]">{Math.round(panY)}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={panY}
              onChange={(e) => setPanY(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
            />
          </div>

          {/* Move Left/Right Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="flex items-center gap-1 text-[#242320]">
                <MoveHorizontal className="w-3.5 h-3.5 text-[#777168]" />
                Move Left / Right
              </span>
              <span className="text-[#777168]">{Math.round(panX)}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={panX}
              onChange={(e) => setPanX(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
            />
          </div>

          {/* Straighten / Tilt Rotation */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="flex items-center gap-1 text-[#242320]">
                <RotateCw className="w-3.5 h-3.5 text-[#777168]" />
                Head Tilt / Rotation
              </span>
              <span className="text-[#777168]">{rotation}°</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
            />
          </div>

          {/* Advanced Tape Slit Customization Toggle */}
          <div className="pt-1 border-t border-[#DCD3C4]">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] font-mono uppercase tracking-wider text-[#777168] hover:text-[#171715] flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-[#8E7D62]" />
              {showAdvanced ? 'Hide Tape Slit Customization' : 'Customize Tape Slit Size & Position'}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 pt-2">
                {/* Slit Vertical Position */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="flex items-center gap-1 text-[#242320]">
                      <Eye className="w-3.5 h-3.5 text-[#777168]" />
                      Slit Position
                    </span>
                    <span className="text-[#777168]">{eyeY.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="50"
                    step="0.5"
                    value={eyeY}
                    onChange={(e) => setEyeY(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
                  />
                </div>

                {/* Slit Width */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-[#242320]">Slit Width</span>
                    <span className="text-[#777168]">{eyeWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="65"
                    step="1"
                    value={eyeWidth}
                    onChange={(e) => setEyeWidth(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
                  />
                </div>

                {/* Slit Height */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-[#242320]">Slit Height</span>
                    <span className="text-[#777168]">{eyeHeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="22"
                    step="0.5"
                    value={eyeHeight}
                    onChange={(e) => setEyeHeight(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#DCD3C4] rounded appearance-none cursor-pointer accent-[#171715]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big Bold Download Button */}
        <div className="w-full space-y-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 px-6 rounded bg-[#171715] text-[#F3EFE6] hover:bg-[#2c2b28] active:scale-[0.99] font-mono text-sm uppercase tracking-[0.22em] font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer"
          >
            {downloading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-[#B5A68C]" />
                Generating 2000×2000 Master HD...
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                Downloaded! Check Downloads
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-[#B5A68C]" />
                Download Album Cover (Master HD)
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer with Creator Details & Social Links */}
      <footer className="mt-10 mb-4 text-center space-y-4 max-w-lg w-full">
        {/* Social Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Linktree Primary Badge */}
          <a
            href="https://linktr.ee/NapraB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9E2D5] hover:bg-[#171715] text-[#242320] hover:text-[#F3EFE6] border border-[#DCD3C4] text-[11px] font-mono tracking-wider transition-all duration-200 group shadow-xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13.511 5.854l3.879-3.88a.75.75 0 0 1 1.06 1.061l-3.879 3.88h4.679a.75.75 0 0 1 0 1.5h-4.68l3.88 3.878a.75.75 0 0 1-1.061 1.061l-3.878-3.879v4.68a.75.75 0 0 1-1.5 0v-4.68l-3.879 3.88a.75.75 0 0 1-1.06-1.061l3.878-3.88H4.75a.75.75 0 0 1 0-1.5h4.68L5.551 3.034a.75.75 0 0 1 1.061-1.06l3.879 3.879V1.173a.75.75 0 0 1 1.5 0v4.68zM11.25 15.75h1.5v7.077a.75.75 0 0 1-1.5 0V15.75z" />
            </svg>
            <span className="font-semibold">Linktree</span>
          </a>

          {/* Instagram */}
          <a
            href="https://linktr.ee/NapraB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E2D5] hover:bg-[#E1306C] text-[#242320] hover:text-white border border-[#DCD3C4] text-[11px] font-mono tracking-wider transition-all duration-200 shadow-xs"
            title="Instagram"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>

          {/* TikTok */}
          <a
            href="https://linktr.ee/NapraB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E2D5] hover:bg-[#000000] text-[#242320] hover:text-white border border-[#DCD3C4] text-[11px] font-mono tracking-wider transition-all duration-200 shadow-xs"
            title="TikTok"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.67a8.21 8.21 0 0 0 4.9 1.6v-3.58z" />
            </svg>
            <span>TikTok</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linktr.ee/NapraB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E2D5] hover:bg-[#0A66C2] text-[#242320] hover:text-white border border-[#DCD3C4] text-[11px] font-mono tracking-wider transition-all duration-200 shadow-xs"
            title="LinkedIn"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-2 border-t border-[#DCD3C4]/60 text-[11px] font-mono text-[#777168] space-y-1">
          <p className="font-semibold text-[#171715] tracking-wider">
            © {new Date().getFullYear()} ARPN$ • All Rights Reserved
          </p>
          <p className="text-[10px] opacity-75">
            Inspired by Drake's Habibti artwork • 100% in-browser client-side transformation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
