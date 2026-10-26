import { DrawableImage } from '../types';
import { renderMaskingTapeCollage, applyAlbumGrayscale } from './tapeOverlay';

export interface HabibtiOptions {
  width: number;
  height: number;
  sourceImage: DrawableImage;
  panX: number; // -50 to 50
  panY: number; // -50 to 50
  zoom: number; // 0.8 to 3.0
  rotation: number; // -15 to 15 degrees
  eyeY: number; // 30 to 60 (%)
  eyeHeight: number; // 8 to 25 (%)
  eyeWidth: number; // 30 to 65 (%)
  style: 'original' | 'classic' | 'noir' | 'aged';
  contrast: number; // 10 to 50
  tapeOpacity: number; // 0.70 to 0.95
  eyeBrightness: number; // -20 to 30
  eyeContrast: number; // -10 to 40
}

// Master reference texture cache
let refImageCache: HTMLImageElement | null = null;

export function loadReferenceImage(): Promise<HTMLImageElement> {
  if (refImageCache && refImageCache.complete && refImageCache.naturalWidth > 0) {
    return Promise.resolve(refImageCache);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      refImageCache = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = '/habibti-master.jpg';
  });
}

/**
 * Master renderer for the Habibti Album Cover
 */
export function renderHabibtiCover(
  targetCanvas: HTMLCanvasElement,
  options: HabibtiOptions,
  referenceImg?: HTMLImageElement | null
): void {
  const {
    width,
    height,
    sourceImage,
    panX,
    panY,
    zoom,
    rotation = 0,
    eyeY,
    eyeHeight,
    eyeWidth,
    style,
    contrast,
    tapeOpacity,
    eyeBrightness = 0,
    eyeContrast = 20,
  } = options;

  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // 1. Render User's Photo into an Offscreen Grayscale Buffer
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = width;
  photoCanvas.height = height;
  const pCtx = photoCanvas.getContext('2d');
  if (!pCtx) return;

  // Fill dark background
  pCtx.fillStyle = '#171715';
  pCtx.fillRect(0, 0, width, height);

  pCtx.save();
  pCtx.translate(width / 2, height / 2);

  if (rotation !== 0) {
    pCtx.rotate((rotation * Math.PI) / 180);
  }

  const natW = Math.max(1, (sourceImage as HTMLImageElement).naturalWidth || (sourceImage as HTMLCanvasElement).width || width);
  const natH = Math.max(1, (sourceImage as HTMLImageElement).naturalHeight || (sourceImage as HTMLCanvasElement).height || height);
  const imgRatio = natW / natH;
  const canvasRatio = width / height;

  let drawW = width;
  let drawH = height;
  if (imgRatio > canvasRatio) {
    drawH = height;
    drawW = height * imgRatio;
  } else {
    drawW = width;
    drawH = width / imgRatio;
  }

  const currentZoom = Math.max(0.5, Math.min(4.0, zoom));
  drawW *= currentZoom;
  drawH *= currentZoom;

  const offsetX = (panX / 100) * width;
  const offsetY = (panY / 100) * height;

  pCtx.drawImage(sourceImage, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
  pCtx.restore();

  // Apply calibrated monochrome film contrast
  applyAlbumGrayscale(pCtx, width, height, contrast);

  // 2. Draw user's B&W portrait onto main canvas as base
  ctx.drawImage(photoCanvas, 0, 0);

  // 3. Render High-Definition Tape Overlay
  const eyeCenterY = (eyeY / 100) * height;
  const eyeH = (eyeHeight / 100) * height;
  const eyeW = (eyeWidth / 100) * width;
  const eyeX = (width - eyeW) / 2;
  const eyeYTop = eyeCenterY - eyeH / 2;

  const tapeCanvas = document.createElement('canvas');
  tapeCanvas.width = width;
  tapeCanvas.height = height;
  const tCtx = tapeCanvas.getContext('2d');
  if (!tCtx) return;

  if (style === 'original' && referenceImg && referenceImg.complete && referenceImg.naturalWidth > 0) {
    // A. 2000x2000 Master HD Tape Artwork
    tCtx.drawImage(referenceImg, 0, 0, width, height);
  } else {
    // B. High-DPI Procedural Masking Tape Strips
    const tapeKey = style === 'noir' ? 'noir' : style === 'aged' ? 'aged' : 'classic';
    renderMaskingTapeCollage(tCtx, width, height, eyeY, eyeHeight, eyeWidth, tapeKey);
  }

  // 4. Punch out the rectangular Eye Opening from the Tape Layer
  tCtx.save();
  tCtx.globalCompositeOperation = 'destination-out';
  tCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  tCtx.fillRect(eyeX, eyeYTop, eyeW, eyeH);
  tCtx.restore();

  // 5. Add Authentic Tape Cut Edges & Bevel Shadows
  tCtx.save();
  // Cut tape edge shadow
  tCtx.strokeStyle = 'rgba(25, 20, 15, 0.45)';
  tCtx.lineWidth = 2.5;
  tCtx.strokeRect(eyeX, eyeYTop, eyeW, eyeH);

  // Upper adhesive lip
  tCtx.fillStyle = 'rgba(30, 24, 18, 0.35)';
  tCtx.fillRect(eyeX, eyeYTop - 1.5, eyeW, 2);

  // Lower tape lip highlight
  tCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  tCtx.fillRect(eyeX, eyeYTop + eyeH - 1, eyeW, 1.5);
  tCtx.restore();

  // 6. Composite Tape Layer over Portrait with realistic Translucency
  // This allows the user's body, shoulders, hair, and head to show through the tape!
  ctx.save();
  ctx.globalAlpha = tapeOpacity;
  ctx.drawImage(tapeCanvas, 0, 0);
  ctx.restore();

  // 7. Render Crisp, High-Contrast Eyes into the Opening
  // Extract user's eye region from photoCanvas, boost clarity, and stamp inside the window
  ctx.save();
  // Clip strictly to the eye window
  ctx.beginPath();
  ctx.rect(eyeX, eyeYTop, eyeW, eyeH);
  ctx.clip();

  // Draw full-opacity un-occluded eyes
  ctx.drawImage(photoCanvas, 0, 0);

  // Apply localized eye punch (contrast & clarity)
  if (eyeBrightness !== 0 || eyeContrast !== 0) {
    const eyeImgData = ctx.getImageData(eyeX, eyeYTop, eyeW, eyeH);
    const eData = eyeImgData.data;
    const eyeFactor = (259 * (eyeContrast + 255)) / (255 * (259 - eyeContrast));

    for (let i = 0; i < eData.length; i += 4) {
      let val = eData[i];
      // Boost contrast
      val = eyeFactor * (val - 128) + 128 + eyeBrightness;
      val = Math.min(255, Math.max(0, val));
      eData[i] = val;
      eData[i + 1] = val;
      eData[i + 2] = val;
    }
    ctx.putImageData(eyeImgData, eyeX, eyeYTop);
  }

  // Soft ambient vignette inside the tape cutout edges (depth)
  const eyeEdgeGrad = ctx.createLinearGradient(0, eyeYTop, 0, eyeYTop + eyeH);
  eyeEdgeGrad.addColorStop(0, 'rgba(15, 12, 10, 0.25)');
  eyeEdgeGrad.addColorStop(0.15, 'rgba(0, 0, 0, 0)');
  eyeEdgeGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0)');
  eyeEdgeGrad.addColorStop(1, 'rgba(15, 12, 10, 0.30)');
  ctx.fillStyle = eyeEdgeGrad;
  ctx.fillRect(eyeX, eyeYTop, eyeW, eyeH);

  ctx.restore();

  // 8. Overall Analog Finish
  applyFinalPaperFinish(ctx, width, height);
}

/**
 * Subtle analog paper grain and border
 */
function applyFinalPaperFinish(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Vignette
  const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  const grad = ctx.createRadialGradient(width / 2, height / 2, radius * 0.45, width / 2, height / 2, radius);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(25, 22, 18, 0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);
}
