import React, { useState } from 'react';
import { Download, Check, AlertCircle, RefreshCw, FileImage } from 'lucide-react';
import { TransformationSettings, ImageSource, AspectRatio, ExportFormat } from '../../types';
import { exportToBlob, calculateCanvasDimensions } from '../../engine/renderPipeline';

interface ExportControlsProps {
  imageSource: ImageSource;
  settings: TransformationSettings;
  onProcessingChange?: (processing: boolean) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  imageSource,
  settings,
  onProcessingChange,
}) => {
  const [format, setFormat] = useState<ExportFormat>('image/png');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Compute calculated dimensions
  // Max resolution defaults to min(max(sourceW, sourceH), 2400)
  const maxDim = Math.min(2400, Math.max(1200, Math.max(imageSource.width, imageSource.height)));
  const { width: exportW, height: exportH } = calculateCanvasDimensions(
    aspectRatio,
    imageSource.width,
    imageSource.height,
    maxDim
  );

  const isUpscaled = exportW > imageSource.width || exportH > imageSource.height;

  const handleDownload = async () => {
    if (!imageSource.img) {
      setExportError('No photo loaded to export.');
      return;
    }

    try {
      setIsExporting(true);
      if (onProcessingChange) onProcessingChange(true);
      setExportError(null);
      setDownloadSuccess(false);

      // Render high-res image
      const blob = await exportToBlob(
        imageSource.img,
        settings,
        aspectRatio,
        format,
        quality,
        maxDim
      );

      // Generate actual download link
      const blobUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const cleanName = imageSource.name.replace(/\.[^/.]+$/, '').toLowerCase();
      downloadAnchor.download = `habibti-${cleanName}-${settings.preset}.${ext}`;
      downloadAnchor.href = blobUrl;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      // Revoke temporary object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Export rendering failed.';
      setExportError(msg);
    } finally {
      setIsExporting(false);
      if (onProcessingChange) onProcessingChange(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#777168] font-semibold">
          High-Quality Export
        </label>
        <span className="text-[10px] font-mono text-[#8E7D62]">No Watermark</span>
      </div>

      {/* Format & Aspect Ratio Options */}
      <div className="grid grid-cols-2 gap-3">
        {/* Format Selector */}
        <div>
          <span className="block text-xs text-[#242320] mb-1.5">File Format</span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#E9E2D5] rounded-sm border border-[#DCD3C4]">
            <button
              type="button"
              onClick={() => setFormat('image/png')}
              className={`py-1 text-xs font-mono rounded transition-all ${
                format === 'image/png'
                  ? 'bg-[#171715] text-[#F3EFE6] font-medium shadow-xs'
                  : 'text-[#777168] hover:text-[#171715]'
              }`}
            >
              PNG
            </button>
            <button
              type="button"
              onClick={() => setFormat('image/jpeg')}
              className={`py-1 text-xs font-mono rounded transition-all ${
                format === 'image/jpeg'
                  ? 'bg-[#171715] text-[#F3EFE6] font-medium shadow-xs'
                  : 'text-[#777168] hover:text-[#171715]'
              }`}
            >
              JPEG
            </button>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <span className="block text-xs text-[#242320] mb-1.5">Crop Ratio</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#E9E2D5] rounded-sm border border-[#DCD3C4]">
            {(['1:1', '4:5', 'original'] as AspectRatio[]).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => setAspectRatio(ar)}
                className={`py-1 text-[11px] font-mono rounded transition-all capitalize ${
                  aspectRatio === ar
                    ? 'bg-[#171715] text-[#F3EFE6] font-medium shadow-xs'
                    : 'text-[#777168] hover:text-[#171715]'
                }`}
              >
                {ar === 'original' ? 'Orig' : ar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* JPEG Quality slider if JPEG chosen */}
      {format === 'image/jpeg' && (
        <div className="p-2.5 bg-[#E9E2D5]/50 border border-[#DCD3C4] rounded-sm">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#242320]">JPEG Quality</span>
            <span className="font-mono text-[#777168]">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.0"
            step="0.01"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      )}

      {/* Output Resolution info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#777168] bg-[#F8F6F0] px-3 py-2 rounded border border-[#DCD3C4]/70">
        <span className="flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5 text-[#B5A68C]" />
          Output: {exportW} × {exportH} px
        </span>
        {isUpscaled ? (
          <span className="text-amber-700 font-semibold">[Interpolated]</span>
        ) : (
          <span className="text-emerald-700 font-semibold">Native Resolution</span>
        )}
      </div>

      {/* Primary Download Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-sm bg-[#171715] text-[#F3EFE6] text-xs font-mono uppercase tracking-[0.22em] font-semibold hover:bg-[#2b2a26] active:scale-98 transition-all disabled:opacity-50 shadow-art cursor-pointer"
      >
        {isExporting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-[#B5A68C]" />
            Generating Full Resolution...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-[#B5A68C]" />
            Download Portrait
          </>
        )}
      </button>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center gap-2.5 text-emerald-800 text-xs animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">Portrait downloaded successfully!</span> Check your browser downloads.
          </div>
        </div>
      )}

      {/* Error Notification */}
      {exportError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Download Failed</p>
            <p>{exportError}</p>
          </div>
          <button
            onClick={() => setExportError(null)}
            className="text-red-700 hover:text-red-950 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
