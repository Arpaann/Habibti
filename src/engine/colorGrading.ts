import { MonochromeSettings, EyeEnhancementSettings, EyeOpeningSettings } from '../types';

/**
 * Apply photographic color grading, grayscale conversion, and tonal adjustments.
 * Operates directly on Canvas ImageData for high performance and precision.
 */
export function applyMonochromeAndGrading(
  imageData: ImageData,
  mono: MonochromeSettings,
  eyeSettings?: EyeOpeningSettings,
  eyeEnhance?: EyeEnhancementSettings,
  width?: number,
  height?: number
): void {
  const data = imageData.data;
  const len = data.length;

  // Precompute constants
  const grayRatio = mono.grayscale / 100;
  const contrastFactor = (259 * (mono.contrast + 255)) / (255 * (259 - mono.contrast));
  const brightnessOffset = mono.brightness * 1.5;
  const exposureMultiplier = Math.pow(2, mono.exposure / 50);
  const fadeLift = (mono.fade / 100) * 45; // Lifts minimum black levels
  const warmPaper = mono.warmPaperTone / 100;

  // Eye enhancement zone precomputation if provided
  const hasEyeEnhancement =
    eyeSettings &&
    eyeEnhance &&
    (eyeEnhance.brightness !== 0 || eyeEnhance.contrast !== 0 || eyeEnhance.sharpness !== 0 || eyeEnhance.clarity !== 0) &&
    width &&
    height;

  let eyeCenterY = 0;
  let eyeCenterX = 0;
  let eyeHalfW = 0;
  let eyeHalfH = 0;
  let eyeFeather = 0;

  if (hasEyeEnhancement && width && height && eyeSettings) {
    eyeCenterY = (eyeSettings.positionY / 100) * height;
    eyeCenterX = (0.5 + eyeSettings.positionX / 100) * width;
    eyeHalfW = ((eyeSettings.width / 100) * width) / 2;
    eyeHalfH = ((eyeSettings.height / 100) * height) / 2;
    eyeFeather = eyeSettings.feather * (width / 600);
  }

  // Eye enhancement factors
  const eyeBrightness = eyeEnhance ? eyeEnhance.brightness * 1.2 : 0;
  const eyeContrastFactor = eyeEnhance
    ? (259 * (eyeEnhance.contrast + 255)) / (255 * (259 - eyeEnhance.contrast))
    : 1;

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Exposure adjustment (linear multiplication in approximate gamma space)
    r = Math.min(255, Math.max(0, r * exposureMultiplier));
    g = Math.min(255, Math.max(0, g * exposureMultiplier));
    b = Math.min(255, Math.max(0, b * exposureMultiplier));

    // 2. Grayscale conversion using BT.709 photographic luminance
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = r * (1 - grayRatio) + lum * grayRatio;
    g = g * (1 - grayRatio) + lum * grayRatio;
    b = b * (1 - grayRatio) + lum * grayRatio;

    // 3. Contrast adjustment around middle gray (128)
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // 4. Brightness offset
    r += brightnessOffset;
    g += brightnessOffset;
    b += brightnessOffset;

    // 5. Matte Black Lift (Fade)
    if (fadeLift > 0) {
      r = r + (255 - r) * (fadeLift / 255) * (1 - Math.min(1, lum / 255));
      g = g + (255 - g) * (fadeLift / 255) * (1 - Math.min(1, lum / 255));
      b = b + (255 - b) * (fadeLift / 255) * (1 - Math.min(1, lum / 255));
    }

    // 6. Warm Paper Tone / Duotone
    // Warm highlights (sepia/cream tint) while preserving deep shadows
    if (warmPaper > 0) {
      const normalizedLum = Math.min(1, Math.max(0, lum / 255));
      // Tint increases more in midtones and highlights
      const tintStrength = Math.pow(normalizedLum, 0.8) * warmPaper;
      r = r * (1 + 0.14 * tintStrength);
      g = g * (1 + 0.06 * tintStrength);
      b = b * (1 - 0.12 * tintStrength);
    }

    // 7. Localized Eye Enhancement
    if (hasEyeEnhancement && width && height) {
      const pixelIdx = i / 4;
      const px = pixelIdx % width;
      const py = Math.floor(pixelIdx / width);

      // Check distance from eye opening center
      const dx = Math.abs(px - eyeCenterX);
      const dy = Math.abs(py - eyeCenterY);

      if (dx < eyeHalfW + eyeFeather && dy < eyeHalfH + eyeFeather) {
        // Calculate smooth mask weight
        const maskX = Math.max(0, Math.min(1, (eyeHalfW + eyeFeather - dx) / eyeFeather));
        const maskY = Math.max(0, Math.min(1, (eyeHalfH + eyeFeather - dy) / eyeFeather));
        const eyeWeight = maskX * maskY;

        if (eyeWeight > 0.01) {
          // Boost contrast and brightness in the eye region
          let er = eyeContrastFactor * (r - 128) + 128 + eyeBrightness;
          let eg = eyeContrastFactor * (g - 128) + 128 + eyeBrightness;
          let eb = eyeContrastFactor * (b - 128) + 128 + eyeBrightness;

          r = r * (1 - eyeWeight) + er * eyeWeight;
          g = g * (1 - eyeWeight) + eg * eyeWeight;
          b = b * (1 - eyeWeight) + eb * eyeWeight;
        }
      }
    }

    // Clamp values
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
}
