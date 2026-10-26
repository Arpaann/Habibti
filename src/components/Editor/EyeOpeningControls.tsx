import React from 'react';
import { Eye, MoveVertical, MoveHorizontal, Maximize2, Minimize2, Feather } from 'lucide-react';
import { EyeOpeningSettings, EyeEnhancementSettings } from '../../types';

interface EyeOpeningControlsProps {
  eyeOpening: EyeOpeningSettings;
  eyeEnhancement: EyeEnhancementSettings;
  onOpeningChange: (newOpening: EyeOpeningSettings) => void;
  onEnhanceChange: (newEnhance: EyeEnhancementSettings) => void;
}

export const EyeOpeningControls: React.FC<EyeOpeningControlsProps> = ({
  eyeOpening,
  eyeEnhancement,
  onOpeningChange,
  onEnhanceChange,
}) => {
  return (
    <div className="space-y-5 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168]">
          Eye Opening Slit
        </span>
        <span className="text-[10px] font-mono text-[#8E7D62]">Natural Feathered Hem</span>
      </div>

      <div className="space-y-3">
        {/* Slit Vertical Position */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <MoveVertical className="w-3.5 h-3.5 text-[#777168]" />
              Vertical Eye Position
            </span>
            <span className="font-mono text-[#777168]">{Math.round(eyeOpening.positionY)}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="70"
            step="1"
            value={eyeOpening.positionY}
            onChange={(e) =>
              onOpeningChange({ ...eyeOpening, positionY: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Slit Horizontal Offset */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#777168]" />
              Horizontal Offset
            </span>
            <span className="font-mono text-[#777168]">{Math.round(eyeOpening.positionX)}%</span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            step="1"
            value={eyeOpening.positionX}
            onChange={(e) =>
              onOpeningChange({ ...eyeOpening, positionX: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Slit Height */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Minimize2 className="w-3.5 h-3.5 text-[#777168]" />
              Slit Height
            </span>
            <span className="font-mono text-[#777168]">{Math.round(eyeOpening.height)}%</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="1"
            value={eyeOpening.height}
            onChange={(e) =>
              onOpeningChange({ ...eyeOpening, height: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Slit Width */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Maximize2 className="w-3.5 h-3.5 text-[#777168]" />
              Slit Width
            </span>
            <span className="font-mono text-[#777168]">{Math.round(eyeOpening.width)}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            step="1"
            value={eyeOpening.width}
            onChange={(e) =>
              onOpeningChange({ ...eyeOpening, width: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Feathering / Edge Softness */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Feather className="w-3.5 h-3.5 text-[#777168]" />
              Edge Softness (Feather)
            </span>
            <span className="font-mono text-[#777168]">{Math.round(eyeOpening.feather)}px</span>
          </div>
          <input
            type="range"
            min="6"
            max="50"
            step="1"
            value={eyeOpening.feather}
            onChange={(e) =>
              onOpeningChange({ ...eyeOpening, feather: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      </div>

      {/* Localized Eye Enhancement */}
      <div className="pt-3 border-t border-[#DCD3C4]/70 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#8E7D62]" />
            Eye Region Enhancement
          </span>
          <span className="text-[9px] font-mono text-[#777168]">Subtle Iris Pop</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Eye Brightness */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#242320]">Gaze Brightness</span>
              <span className="font-mono text-[#777168]">
                {eyeEnhancement.brightness > 0 ? `+${eyeEnhancement.brightness}` : eyeEnhancement.brightness}
              </span>
            </div>
            <input
              type="range"
              min="-25"
              max="35"
              step="1"
              value={eyeEnhancement.brightness}
              onChange={(e) =>
                onEnhanceChange({ ...eyeEnhancement, brightness: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
            />
          </div>

          {/* Eye Contrast */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#242320]">Iris Contrast</span>
              <span className="font-mono text-[#777168]">
                {eyeEnhancement.contrast > 0 ? `+${eyeEnhancement.contrast}` : eyeEnhancement.contrast}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="45"
              step="1"
              value={eyeEnhancement.contrast}
              onChange={(e) =>
                onEnhanceChange({ ...eyeEnhancement, contrast: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
