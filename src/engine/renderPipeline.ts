import { TransformationSettings, AspectRatio, DrawableImage } from '../types';
import { applyMonochromeAndGrading } from './colorGrading';
import { renderVeilLayer } from './veilGenerator';
import { punchEyeOpening } from './eyeMask';
import { applyTextureAndVignette } from './filmGrain';

export interface RenderOptions {
  width: number;
  height: number;
  settings: TransformationSettings;
  sourceImage: DrawableImage;
  renderOriginalOnly?: boolean; // For Before/After comparison
}

/**
 * Calculates target canvas dimensions based on desired aspect ratio and maximum bounds.
 */
export function calculateCanvasDimensions(
  aspectRatio: AspectRatio,
  sourceW: number,
  sourceH: number,
  targetMaxDimension = 1200
): { width: number; height: number } {
  let ratio = 1; // 1:1 default

  if (aspectRatio === '1:1') {
    ratio = 1;
    return { width: targetMaxDimension, height: targetMaxDimension };
  } else if (aspectRatio === '4:5') {
    // 4:5 portrait ratio (e.g. 1080 x 1350)
    const w = targetMaxDimension;
    const h = Math.round(targetMaxDimension * 1.25);
    return { width: w, height: h };
  } else {
    // Original aspect ratio
    ratio = sourceW / sourceH;
    if (ratio >= 1) {
      return {
        width: targetMaxDimension,
        height: Math.round(targetMaxDimension / ratio),
      };
    } else {
      return {
        width: Math.round(targetMaxDimension * ratio),
        height: targetMaxDimension,
      };
    }
  }
}

/**
 * Executes the full unified Habibti rendering pipeline.
 * Used identically for both the interactive preview and high-resolution export.
 */
export function renderHabibti(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const { width, height, settings, sourceImage, renderOriginalOnly } = options;

  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw source image with crop (zoom, pan, rotation)
  ctx.save();

  // Background tone if aspect ratio leaves margins
  ctx.fillStyle = '#171715';
  ctx.fillRect(0, 0, width, height);

  // Center transformation
  ctx.translate(width / 2, height / 2);

  // Optional tilt rotation
  if (settings.crop.rotation !== 0) {
    ctx.rotate((settings.crop.rotation * Math.PI) / 180);
  }

  // Pan offsets (normalized -50 to 50 % of canvas size)
  const offsetX = (settings.crop.panX / 100) * width;
  const offsetY = (settings.crop.panY / 100) * height;

  // Safe dimensions
  const naturalW = Math.max(
    1,
    (sourceImage as HTMLImageElement).naturalWidth || (sourceImage as HTMLCanvasElement).width || width
  );
  const naturalH = Math.max(
    1,
    (sourceImage as HTMLImageElement).naturalHeight || (sourceImage as HTMLCanvasElement).height || height
  );

  // Compute cover-fit scaling
  const imgRatio = naturalW / naturalH;
  const canvasRatio = width / height;

  let drawW = width;
  let drawH = height;

  if (imgRatio > canvasRatio) {
    // Image is wider than canvas
    drawH = height;
    drawW = height * imgRatio;
  } else {
    // Image is taller than canvas
    drawW = width;
    drawH = width / imgRatio;
  }

  // Apply zoom factor
  const zoom = Math.max(0.5, Math.min(4.0, settings.crop.zoom));
  drawW *= zoom;
  drawH *= zoom;

  // Draw centered cropped image
  ctx.drawImage(
    sourceImage,
    -drawW / 2 + offsetX,
    -drawH / 2 + offsetY,
    drawW,
    drawH
  );

  ctx.restore();

  // If user requested Before view (original photo with crop), return now
  if (renderOriginalOnly) {
    return;
  }

  // 2. Grayscale, Contrast, Exposure, Brightness, Fade & Localized Eye Enhancement
  const rawData = ctx.getImageData(0, 0, width, height);
  applyMonochromeAndGrading(
    rawData,
    settings.monochrome,
    settings.eyeOpening,
    settings.eyeEnhancement,
    width,
    height
  );
  ctx.putImageData(rawData, 0, 0);

  // 3. Composite the Procedural Veil
  // We create a veil canvas buffer, render the striped linen cloth, and punch out the eye opening
  const veilCanvas = document.createElement('canvas');
  veilCanvas.width = width;
  veilCanvas.height = height;
  const veilCtx = veilCanvas.getContext('2d');

  if (veilCtx) {
    // Render the procedural veil onto the buffer
    renderVeilLayer(veilCtx, width, height, settings.veil);

    // Punch out the feathered eye opening
    punchEyeOpening(veilCtx, width, height, settings.eyeOpening);

    // Composite veil buffer onto the main canvas
    ctx.save();
    ctx.drawImage(veilCanvas, 0, 0);
    ctx.restore();
  }

  // 4. Analog Film Grain & Vintage Editorial Vignette
  applyTextureAndVignette(ctx, width, height, settings.texture);
}

/**
 * Export image as Blob with designated format, quality, and resolution.
 */
export async function exportToBlob(
  sourceImage: DrawableImage,
  settings: TransformationSettings,
  aspectRatio: AspectRatio,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95,
  maxDimension = 2048
): Promise<Blob> {
  const natW = (sourceImage as HTMLImageElement).naturalWidth || (sourceImage as HTMLCanvasElement).width || 1200;
  const natH = (sourceImage as HTMLImageElement).naturalHeight || (sourceImage as HTMLCanvasElement).height || 1200;

  const { width, height } = calculateCanvasDimensions(
    aspectRatio,
    natW,
    natH,
    maxDimension
  );

  const exportCanvas = document.createElement('canvas');
  renderHabibti(exportCanvas, {
    width,
    height,
    settings,
    sourceImage,
    renderOriginalOnly: false,
  });

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate export image blob.'));
        }
      },
      format,
      quality
    );
  });
}
