import React, { useState } from 'react';
import {
  Crop,
  Layers,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Upload,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import {
  TransformationSettings,
  ImageSource,
  PresetId,
  CropState,
  VeilSettings,
  EyeOpeningSettings,
  EyeEnhancementSettings,
  MonochromeSettings,
  TextureSettings,
} from '../../types';
import { INITIAL_SETTINGS, PRESETS, DEFAULT_CROP } from '../../constants/presets';
import { ImageUploader } from './ImageUploader';
import { PortraitCanvas } from './PortraitCanvas';
import { PresetSelector } from './PresetSelector';
import { CropControls } from './CropControls';
import { VeilControls } from './VeilControls';
import { EyeOpeningControls } from './EyeOpeningControls';
import { MonochromeControls } from './MonochromeControls';
import { TextureControls } from './TextureControls';
import { ExportControls } from './ExportControls';

interface EditorContainerProps {
  initialImage?: ImageSource | null;
}

export const EditorContainer: React.FC<EditorContainerProps> = ({ initialImage = null }) => {
  const [imageSource, setImageSource] = useState<ImageSource | null>(initialImage);
  const [settings, setSettings] = useState<TransformationSettings>(INITIAL_SETTINGS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync initialImage if loaded asynchronously or selected externally
  React.useEffect(() => {
    if (initialImage) {
      setImageSource(initialImage);
    }
  }, [initialImage]);

  // Active accordion section on desktop/mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    crop: false,
    veil: true,
    eyes: true,
    monochrome: false,
    texture: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Preset Selection
  const handleSelectPreset = (presetId: PresetId) => {
    const preset = PRESETS[presetId];
    setSettings((prev) => ({
      ...prev,
      preset: presetId,
      ...preset.settings,
    }));
  };

  // Reset to preset defaults
  const handleResetAdjustments = () => {
    const preset = PRESETS[settings.preset];
    setSettings((prev) => ({
      ...prev,
      ...preset.settings,
    }));
  };

  // Reset Crop
  const handleResetCrop = () => {
    setSettings((prev) => ({
      ...prev,
      crop: { ...DEFAULT_CROP },
    }));
  };

  // Direct canvas drag-to-pan & zoom updates
  const handleUpdateCrop = (panX: number, panY: number, zoom?: number) => {
    setSettings((prev) => ({
      ...prev,
      crop: {
        ...prev.crop,
        panX,
        panY,
        ...(zoom !== undefined ? { zoom } : {}),
      },
    }));
  };

  return (
    <section id="editor-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[#DCD3C4] gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#777168] block">
            Transformation Studio
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171715] font-normal tracking-tight">
            The Habibti Veil Editor
          </h2>
        </div>

        {imageSource && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setImageSource(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#E9E2D5] hover:bg-[#ded5c5] border border-[#DCD3C4] text-xs font-mono uppercase tracking-wider text-[#242320] transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#777168]" />
              Replace Photo
            </button>
            <button
              onClick={() => {
                setSettings(INITIAL_SETTINGS);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono uppercase tracking-wider text-[#777168] hover:text-[#171715] transition-colors"
              title="Reset all adjustments and crop"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8E7D62]" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Body */}
      {!imageSource ? (
        <div className="max-w-2xl mx-auto">
          <ImageUploader
            onImageLoaded={(src) => setImageSource(src)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Canvas Preview, Replace controls, Before/After */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            <PortraitCanvas
              imageSource={imageSource}
              settings={settings}
              onUpdateCrop={handleUpdateCrop}
              isProcessing={isProcessing}
            />

            {/* Quick Presets Bar below preview on desktop */}
            <div className="p-4 bg-[#E9E2D5]/50 border border-[#DCD3C4] rounded-sm">
              <PresetSelector
                currentPreset={settings.preset}
                onSelectPreset={handleSelectPreset}
                onResetAdjustments={handleResetAdjustments}
              />
            </div>
          </div>

          {/* Right Column: Controls, Accordions & High-Res Export */}
          <div className="lg:col-span-6 space-y-4">
            {/* 1. Eye Slit Opening (Crucial primary control!) */}
            <div className="bg-[#F8F6F0] border border-[#DCD3C4] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('eyes')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#E9E2D5]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[#8E7D62]" />
                  <span className="font-serif text-base font-medium text-[#171715]">
                    Eye Slit Opening & Iris Pop
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#777168] transition-transform ${
                    openSections.eyes ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.eyes && (
                <div className="p-4 pt-1 border-t border-[#DCD3C4]/60">
                  <EyeOpeningControls
                    eyeOpening={settings.eyeOpening}
                    eyeEnhancement={settings.eyeEnhancement}
                    onOpeningChange={(newEyes: EyeOpeningSettings) =>
                      setSettings((prev) => ({ ...prev, eyeOpening: newEyes, preset: 'custom' }))
                    }
                    onEnhanceChange={(newEnhance: EyeEnhancementSettings) =>
                      setSettings((prev) => ({
                        ...prev,
                        eyeEnhancement: newEnhance,
                        preset: 'custom',
                      }))
                    }
                  />
                </div>
              )}
            </div>

            {/* 2. Veil Fabric & Pleat Drape */}
            <div className="bg-[#F8F6F0] border border-[#DCD3C4] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('veil')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#E9E2D5]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#8E7D62]" />
                  <span className="font-serif text-base font-medium text-[#171715]">
                    Veil Fabric & Drapery Pleats
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#777168] transition-transform ${
                    openSections.veil ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.veil && (
                <div className="p-4 pt-1 border-t border-[#DCD3C4]/60">
                  <VeilControls
                    veil={settings.veil}
                    onChange={(newVeil: VeilSettings) =>
                      setSettings((prev) => ({ ...prev, veil: newVeil, preset: 'custom' }))
                    }
                  />
                </div>
              )}
            </div>

            {/* 3. Crop, Zoom & Tilt Positioning */}
            <div className="bg-[#F8F6F0] border border-[#DCD3C4] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('crop')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#E9E2D5]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Crop className="w-4 h-4 text-[#8E7D62]" />
                  <span className="font-serif text-base font-medium text-[#171715]">
                    Crop, Zoom & Framing
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#777168] transition-transform ${
                    openSections.crop ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.crop && (
                <div className="p-4 pt-1 border-t border-[#DCD3C4]/60">
                  <CropControls
                    crop={settings.crop}
                    onChange={(newCrop: CropState) =>
                      setSettings((prev) => ({ ...prev, crop: newCrop }))
                    }
                    onReset={handleResetCrop}
                  />
                </div>
              )}
            </div>

            {/* 4. Monochrome & Tone Grading */}
            <div className="bg-[#F8F6F0] border border-[#DCD3C4] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('monochrome')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#E9E2D5]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#8E7D62]" />
                  <span className="font-serif text-base font-medium text-[#171715]">
                    Monochrome & Contrast Tones
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#777168] transition-transform ${
                    openSections.monochrome ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.monochrome && (
                <div className="p-4 pt-1 border-t border-[#DCD3C4]/60">
                  <MonochromeControls
                    monochrome={settings.monochrome}
                    onChange={(newMono: MonochromeSettings) =>
                      setSettings((prev) => ({
                        ...prev,
                        monochrome: newMono,
                        preset: 'custom',
                      }))
                    }
                  />
                </div>
              )}
            </div>

            {/* 5. Analog Film Grain & Texture */}
            <div className="bg-[#F8F6F0] border border-[#DCD3C4] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('texture')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#E9E2D5]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#8E7D62]" />
                  <span className="font-serif text-base font-medium text-[#171715]">
                    Analog Film Grain & Vignette
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#777168] transition-transform ${
                    openSections.texture ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.texture && (
                <div className="p-4 pt-1 border-t border-[#DCD3C4]/60">
                  <TextureControls
                    texture={settings.texture}
                    onChange={(newTex: TextureSettings) =>
                      setSettings((prev) => ({
                        ...prev,
                        texture: newTex,
                        preset: 'custom',
                      }))
                    }
                  />
                </div>
              )}
            </div>

            {/* High-Resolution Export Section */}
            <div className="p-5 bg-[#E9E2D5] border border-[#DCD3C4] rounded-sm shadow-subtle">
              <ExportControls
                imageSource={imageSource}
                settings={settings}
                onProcessingChange={(p) => setIsProcessing(p)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
