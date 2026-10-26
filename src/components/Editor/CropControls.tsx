import React from 'react';
import { RotateCcw, ZoomIn, MoveHorizontal, MoveVertical, RotateCw } from 'lucide-react';
import { CropState } from '../../types';

interface CropControlsProps {
  crop: CropState;
  onChange: (newCrop: CropState) => void;
  onReset: () => void;
}

export const CropControls: React.FC<CropControlsProps> = ({ crop, onChange, onReset }) => {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168]">
          Framing & Positioning
        </span>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#777168] hover:text-[#171715]"
        >
          <RotateCcw className="w-2.5 h-2.5 text-[#B5A68C]" />
          Reset crop
        </button>
      </div>

      <div className="space-y-3">
        {/* Zoom */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <ZoomIn className="w-3.5 h-3.5 text-[#777168]" />
              Zoom
            </span>
            <span className="font-mono text-[#777168]">{crop.zoom.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="3.0"
            step="0.05"
            value={crop.zoom}
            onChange={(e) => onChange({ ...crop, zoom: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Pan Y (Vertical) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <MoveVertical className="w-3.5 h-3.5 text-[#777168]" />
              Vertical Position
            </span>
            <span className="font-mono text-[#777168]">{Math.round(crop.panY)}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={crop.panY}
            onChange={(e) => onChange({ ...crop, panY: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Pan X (Horizontal) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#777168]" />
              Horizontal Position
            </span>
            <span className="font-mono text-[#777168]">{Math.round(crop.panX)}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={crop.panX}
            onChange={(e) => onChange({ ...crop, panX: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Tilt Rotation */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <RotateCw className="w-3.5 h-3.5 text-[#777168]" />
              Subtle Tilt
            </span>
            <span className="font-mono text-[#777168]">{Math.round(crop.rotation)}°</span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.5"
            value={crop.rotation}
            onChange={(e) => onChange({ ...crop, rotation: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      </div>
    </div>
  );
};
