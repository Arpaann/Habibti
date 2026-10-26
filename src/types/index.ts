export type PresetId = 'habibti' | 'noir' | 'faded' | 'custom';

export type AspectRatio = '1:1' | '4:5' | 'original';

export type ExportFormat = 'image/png' | 'image/jpeg';

export interface CropState {
  zoom: number; // 1.0 to 3.0
  panX: number; // -50 to 50 (%)
  panY: number; // -50 to 50 (%)
  rotation: number; // -45 to 45 (degrees)
}

export interface VeilSettings {
  color: string; // hex
  opacity: number; // 0 to 1
  stripeDensity: number; // 20 to 120
  stripeSoftness: number; // 0 to 1
  fabricTexture: number; // 0 to 1 (procedural weave noise)
  foldsShadow: number; // 0 to 1 (depth of vertical drape folds)
  warmth: number; // 0 to 1
  stripeWaviness: number; // 0 to 1 (organic drape waviness)
}

export interface EyeOpeningSettings {
  positionY: number; // 10 to 90 (%)
  positionX: number; // -30 to 30 (%)
  height: number; // 8 to 40 (%)
  width: number; // 40 to 100 (%)
  feather: number; // 4 to 60 (px relative to base size)
  curvature: number; // -0.5 to 0.5 (natural eye arc)
}

export interface EyeEnhancementSettings {
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  sharpness: number; // 0 to 50
  clarity: number; // 0 to 50
}

export interface MonochromeSettings {
  grayscale: number; // 0 to 100 (%)
  contrast: number; // -50 to 50
  brightness: number; // -50 to 50
  exposure: number; // -50 to 50
  fade: number; // 0 to 100 (matte black lift)
  warmPaperTone: number; // 0 to 100 (ivory/sepia highlight duotone)
}

export interface TextureSettings {
  filmGrain: number; // 0 to 100
  grainSize: number; // 1 to 4
  vignette: number; // 0 to 100
}

export interface TransformationSettings {
  preset: PresetId;
  crop: CropState;
  veil: VeilSettings;
  eyeOpening: EyeOpeningSettings;
  eyeEnhancement: EyeEnhancementSettings;
  monochrome: MonochromeSettings;
  texture: TextureSettings;
}

export type DrawableImage = HTMLImageElement | HTMLCanvasElement;

export interface ImageSource {
  img: DrawableImage;
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  dataUrl?: string;
}

export interface ExportConfig {
  format: ExportFormat;
  quality: number; // 0.1 to 1.0 (for JPEG)
  aspectRatio: AspectRatio;
  customResolution?: { width: number; height: number };
}

export interface SamplePortrait {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  generateImage: () => Promise<DrawableImage> | DrawableImage;
}
