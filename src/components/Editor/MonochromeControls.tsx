import React from 'react';
import { Sun, Contrast, Coffee } from 'lucide-react';
import { MonochromeSettings } from '../../types';

interface MonochromeControlsProps {
  monochrome: MonochromeSettings;
  onChange: (newMono: MonochromeSettings) => void;
}

export const MonochromeControls: React.FC<MonochromeControlsProps> = ({
  monochrome,
  onChange,
}) => {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168]">
          Monochrome & Tone Grading
        </span>
        <span className="text-[10px] font-mono text-[#8E7D62]">BT.709 Luminance</span>
      </div>

      <div className="space-y-3">
        {/* Grayscale % */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#242320]">Grayscale Intensity</span>
            <span className="font-mono text-[#777168]">{monochrome.grayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={monochrome.grayscale}
            onChange={(e) =>
              onChange({ ...monochrome, grayscale: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Contrast className="w-3.5 h-3.5 text-[#777168]" />
              Contrast
            </span>
            <span className="font-mono text-[#777168]">
              {monochrome.contrast > 0 ? `+${monochrome.contrast}` : monochrome.contrast}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={monochrome.contrast}
            onChange={(e) =>
              onChange({ ...monochrome, contrast: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Brightness */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Sun className="w-3.5 h-3.5 text-[#777168]" />
              Brightness
            </span>
            <span className="font-mono text-[#777168]">
              {monochrome.brightness > 0 ? `+${monochrome.brightness}` : monochrome.brightness}
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            step="1"
            value={monochrome.brightness}
            onChange={(e) =>
              onChange({ ...monochrome, brightness: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Vintage Fade / Matte Black Lift */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#242320]">Vintage Matte Fade</span>
            <span className="font-mono text-[#777168]">{monochrome.fade}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={monochrome.fade}
            onChange={(e) => onChange({ ...monochrome, fade: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Warm Paper Tone (Sepia / Ivory Highlight Toning) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Coffee className="w-3.5 h-3.5 text-[#777168]" />
              Warm Paper Highlight Tone
            </span>
            <span className="font-mono text-[#777168]">{monochrome.warmPaperTone}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={monochrome.warmPaperTone}
            onChange={(e) =>
              onChange({ ...monochrome, warmPaperTone: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      </div>
    </div>
  );
};
