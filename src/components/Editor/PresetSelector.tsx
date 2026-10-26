import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { PresetId } from '../../types';
import { PRESETS } from '../../constants/presets';

interface PresetSelectorProps {
  currentPreset: PresetId;
  onSelectPreset: (presetId: PresetId) => void;
  onResetAdjustments: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onSelectPreset,
  onResetAdjustments,
}) => {
  const presetsList: PresetId[] = ['habibti', 'noir', 'faded'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#777168] font-semibold">
          Artistic Presets
        </label>

        <button
          onClick={onResetAdjustments}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#777168] hover:text-[#171715] transition-colors"
          title="Restore current preset defaults"
        >
          <RotateCcw className="w-3 h-3 text-[#B5A68C]" />
          Reset adjustments
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {presetsList.map((id) => {
          const preset = PRESETS[id];
          const isSelected = currentPreset === id;

          return (
            <button
              key={id}
              onClick={() => onSelectPreset(id)}
              className={`p-3 rounded-sm border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-[#171715] bg-[#E9E2D5] shadow-sm ring-1 ring-[#171715]'
                  : 'border-[#DCD3C4] bg-[#F3EFE6] hover:border-[#B5A68C] hover:bg-[#E9E2D5]/40'
              }`}
            >
              {/* Color Swatch accent bar */}
              <div
                className="w-full h-1.5 rounded-full mb-2 border border-black/10"
                style={{ backgroundColor: preset.previewBg }}
              />

              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold tracking-wider text-[#171715] uppercase">
                  {preset.name}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#171715]" />}
              </div>

              <p className="text-[10px] text-[#777168] mt-0.5 font-mono line-clamp-1">
                {preset.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
