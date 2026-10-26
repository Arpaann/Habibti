import React from 'react';
import { Layers, Palette, Sparkles } from 'lucide-react';
import { VeilSettings } from '../../types';

interface VeilControlsProps {
  veil: VeilSettings;
  onChange: (newVeil: VeilSettings) => void;
}

const VEIL_PALETTES = [
  { name: 'Sand (Habibti)', hex: '#C7BBAE' },
  { name: 'Antique Linen', hex: '#E6E0D2' },
  { name: 'Warm Khaki', hex: '#8E7D62' },
  { name: 'Obsidian Noir', hex: '#3F3B36' },
];

export const VeilControls: React.FC<VeilControlsProps> = ({ veil, onChange }) => {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#777168]">
          Fabric Veil & Drape
        </span>
        <span className="text-[10px] font-mono text-[#8E7D62]">Procedural Linen</span>
      </div>

      {/* Fabric Color Swatches */}
      <div>
        <label className="flex items-center gap-1.5 text-xs text-[#242320] mb-2">
          <Palette className="w-3.5 h-3.5 text-[#777168]" />
          Veil Tone
        </label>
        <div className="flex items-center gap-2">
          {VEIL_PALETTES.map((pal) => (
            <button
              key={pal.hex}
              onClick={() => onChange({ ...veil, color: pal.hex })}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-sm border transition-all ${
                veil.color.toUpperCase() === pal.hex.toUpperCase()
                  ? 'border-[#171715] bg-[#E9E2D5] ring-1 ring-[#171715]'
                  : 'border-[#DCD3C4] bg-[#F3EFE6] hover:border-[#B5A68C]'
              }`}
              title={pal.name}
            >
              <div
                className="w-5 h-5 rounded-full border border-black/15 shadow-sm"
                style={{ backgroundColor: pal.hex }}
              />
              <span className="text-[9px] font-mono text-[#777168] truncate max-w-full">
                {pal.name.split(' ')[0]}
              </span>
            </button>
          ))}
          {/* Custom color input */}
          <input
            type="color"
            value={veil.color}
            onChange={(e) => onChange({ ...veil, color: e.target.value })}
            className="w-9 h-9 p-0.5 rounded border border-[#DCD3C4] cursor-pointer bg-transparent"
            title="Custom veil color"
          />
        </div>
      </div>

      <div className="space-y-3">
        {/* Opacity */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#242320]">
              <Layers className="w-3.5 h-3.5 text-[#777168]" />
              Veil Opacity
            </span>
            <span className="font-mono text-[#777168]">{Math.round(veil.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.02"
            value={veil.opacity}
            onChange={(e) => onChange({ ...veil, opacity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Pleat Stripe Density */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#242320]">Pleat & Stripe Density</span>
            <span className="font-mono text-[#777168]">{veil.stripeDensity}</span>
          </div>
          <input
            type="range"
            min="25"
            max="100"
            step="1"
            value={veil.stripeDensity}
            onChange={(e) => onChange({ ...veil, stripeDensity: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Drapery Fold Shadows */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#242320]">Fold Creases & Shadows</span>
            <span className="font-mono text-[#777168]">{Math.round(veil.foldsShadow * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={veil.foldsShadow}
            onChange={(e) => onChange({ ...veil, foldsShadow: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>

        {/* Fabric Weave Texture */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-[#242320]">
              <Sparkles className="w-3.5 h-3.5 text-[#777168]" />
              Fabric Weave Noise
            </span>
            <span className="font-mono text-[#777168]">{Math.round(veil.fabricTexture * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={veil.fabricTexture}
            onChange={(e) => onChange({ ...veil, fabricTexture: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#DCD3C4] rounded-lg appearance-none cursor-pointer accent-[#171715]"
          />
        </div>
      </div>
    </div>
  );
};
