import React from 'react';
import { CircleDot, Film } from 'lucide-react';
import { TextureSettings } from '../../types';

interface TextureControlsProps {
  texture: TextureSettings;
  onChange: (newTexture: TextureSettings) => void;
}

export const TextureControls: React.FC<TextureControlsProps> = ({ texture, onChange }) => {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168]">
          Analog Finish & Grain
        </span>
        <span className="text-[10px] font-mono text-[#8E7D62]">35mm Emulsion</span>
      </div>

      <div className="space-y-3">
        {/* Film Grain Intensity */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Film className="w-3.5 h-3.5 text-[#777168]" />
              Film Grain Intensity
            </span>
            <span className="font-mono text-[#777168]">{texture.filmGrain}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={texture.filmGrain}
            onChange={(e) =>
              onChange({ ...texture, filmGrain: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Soft Vignette */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <CircleDot className="w-3.5 h-3.5 text-[#777168]" />
              Soft Editorial Vignette
            </span>
            <span className="font-mono text-[#777168]">{texture.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={texture.vignette}
            onChange={(e) =>
              onChange({ ...texture, vignette: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      </div>
    </div>
  );
};
