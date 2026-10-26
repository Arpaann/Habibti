import { PresetId, TransformationSettings } from '../types';

export interface PresetDefinition {
  id: PresetId;
  name: string;
  tagline: string;
  description: string;
  previewBg: string;
  settings: Omit<TransformationSettings, 'preset' | 'crop'>;
}

export const DEFAULT_CROP = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
  rotation: 0,
};

export const PRESETS: Record<PresetId, PresetDefinition> = {
  habibti: {
    id: 'habibti',
    name: 'HABIBTI',
    tagline: 'Signature Editorial',
    description: 'Warm translucent beige veil, balanced monochrome portrait, and soft vintage film grain.',
    previewBg: '#C8BEAE',
    settings: {
      veil: {
        color: '#C7BBAE',
        opacity: 0.92,
        stripeDensity: 56,
        stripeSoftness: 0.52,
        fabricTexture: 0.42,
        foldsShadow: 0.48,
        warmth: 0.38,
        stripeWaviness: 0.22,
      },
      eyeOpening: {
        positionY: 42,
        positionX: 0,
        height: 16,
        width: 88,
        feather: 24,
        curvature: 0.15,
      },
      eyeEnhancement: {
        brightness: 10,
        contrast: 22,
        sharpness: 18,
        clarity: 14,
      },
      monochrome: {
        grayscale: 100,
        contrast: 18,
        brightness: -2,
        exposure: 0,
        fade: 22,
        warmPaperTone: 34,
      },
      texture: {
        filmGrain: 28,
        grainSize: 1.5,
        vignette: 32,
      },
    },
  },

  noir: {
    id: 'noir',
    name: 'NOIR',
    tagline: 'Deep Shadows & Stark Contrast',
    description: 'Deeper obsidian blacks, high contrast chiaroscuro, and a dark charcoal draped veil.',
    previewBg: '#3C3A36',
    settings: {
      veil: {
        color: '#3F3B36',
        opacity: 0.94,
        stripeDensity: 64,
        stripeSoftness: 0.45,
        fabricTexture: 0.5,
        foldsShadow: 0.68,
        warmth: 0.1,
        stripeWaviness: 0.18,
      },
      eyeOpening: {
        positionY: 42,
        positionX: 0,
        height: 15,
        width: 86,
        feather: 20,
        curvature: 0.1,
      },
      eyeEnhancement: {
        brightness: 16,
        contrast: 32,
        sharpness: 24,
        clarity: 20,
      },
      monochrome: {
        grayscale: 100,
        contrast: 36,
        brightness: -8,
        exposure: -4,
        fade: 10,
        warmPaperTone: 8,
      },
      texture: {
        filmGrain: 40,
        grainSize: 1.8,
        vignette: 45,
      },
    },
  },

  faded: {
    id: 'faded',
    name: 'FADED',
    tagline: 'Sun-Bleached & Ethereal',
    description: 'Muted shadows, lifted matte blacks, light antique ivory veil, and gentle analog fade.',
    previewBg: '#E6DFC8',
    settings: {
      veil: {
        color: '#E6E0D2',
        opacity: 0.88,
        stripeDensity: 48,
        stripeSoftness: 0.6,
        fabricTexture: 0.32,
        foldsShadow: 0.28,
        warmth: 0.48,
        stripeWaviness: 0.25,
      },
      eyeOpening: {
        positionY: 42,
        positionX: 0,
        height: 18,
        width: 92,
        feather: 30,
        curvature: 0.2,
      },
      eyeEnhancement: {
        brightness: 8,
        contrast: 14,
        sharpness: 12,
        clarity: 10,
      },
      monochrome: {
        grayscale: 100,
        contrast: 6,
        brightness: 8,
        exposure: 4,
        fade: 42,
        warmPaperTone: 46,
      },
      texture: {
        filmGrain: 22,
        grainSize: 1.4,
        vignette: 18,
      },
    },
  },

  custom: {
    id: 'custom',
    name: 'CUSTOM',
    tagline: 'Bespoke Editorial Tuning',
    description: 'Custom fine-tuned veil, eye opening, contrast, and texture configuration.',
    previewBg: '#8E7D62',
    settings: {
      veil: {
        color: '#C7BBAE',
        opacity: 0.92,
        stripeDensity: 56,
        stripeSoftness: 0.52,
        fabricTexture: 0.42,
        foldsShadow: 0.48,
        warmth: 0.38,
        stripeWaviness: 0.22,
      },
      eyeOpening: {
        positionY: 42,
        positionX: 0,
        height: 16,
        width: 88,
        feather: 24,
        curvature: 0.15,
      },
      eyeEnhancement: {
        brightness: 10,
        contrast: 22,
        sharpness: 18,
        clarity: 14,
      },
      monochrome: {
        grayscale: 100,
        contrast: 18,
        brightness: -2,
        exposure: 0,
        fade: 22,
        warmPaperTone: 34,
      },
      texture: {
        filmGrain: 28,
        grainSize: 1.5,
        vignette: 32,
      },
    },
  },
};

export const INITIAL_SETTINGS: TransformationSettings = {
  preset: 'habibti',
  crop: { ...DEFAULT_CROP },
  ...PRESETS.habibti.settings,
};
