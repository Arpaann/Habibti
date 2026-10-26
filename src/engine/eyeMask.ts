import { EyeOpeningSettings } from '../types';

/**
 * Creates and applies the feathered eye opening mask onto the veil canvas.
 * Uses natural organic curvature, soft radial/linear gradient feathering,
 * and subtle cloth hem shadows at top and bottom edges.
 */
export function punchEyeOpening(
  veilCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: EyeOpeningSettings
): void {
  veilCtx.save();

  const centerX = (0.5 + settings.positionX / 100) * width;
  const centerY = (settings.positionY / 100) * height;
  const slitWidth = (settings.width / 100) * width;
  const slitHeight = (settings.height / 100) * height;

  // Scale feather relative to canvas resolution
  const featherPx = Math.max(4, settings.feather * (width / 600));
  const curveDip = settings.curvature * slitHeight * 0.4;

  // We use destination-out to erase the veil in the eye region with feathered edges
  veilCtx.globalCompositeOperation = 'destination-out';

  // To achieve smooth, realistic feathering, we draw the mask into an offscreen mask buffer
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d');

  if (mCtx) {
    const halfW = slitWidth / 2;
    const halfH = slitHeight / 2;

    // Use multiple feathered concentric contour passes for smooth falloff
    const passes = 12;
    for (let p = passes; p >= 1; p--) {
      const t = p / passes; // 1.0 (outer edge) down to ~0.08 (core)
      const currentFeather = featherPx * (1 - t);
      const w = halfW - currentFeather * 0.5;
      const h = halfH - currentFeather * 0.5;

      if (w <= 0 || h <= 0) continue;

      const alpha = 1 / passes;
      mCtx.fillStyle = `rgba(0, 0, 0, ${alpha * 1.5})`;

      mCtx.beginPath();
      // Draw organic curved pill slit:
      // Top edge with slight curve
      mCtx.moveTo(centerX - w, centerY);
      mCtx.quadraticCurveTo(centerX, centerY - h + curveDip, centerX + w, centerY);
      // Bottom edge
      mCtx.quadraticCurveTo(centerX, centerY + h + curveDip * 0.5, centerX - w, centerY);
      mCtx.closePath();
      mCtx.fill();
    }

    // Core solid opening
    const coreW = Math.max(10, halfW - featherPx);
    const coreH = Math.max(6, halfH - featherPx);
    mCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    mCtx.beginPath();
    mCtx.moveTo(centerX - coreW, centerY);
    mCtx.quadraticCurveTo(centerX, centerY - coreH + curveDip, centerX + coreW, centerY);
    mCtx.quadraticCurveTo(centerX, centerY + coreH + curveDip * 0.5, centerX - coreW, centerY);
    mCtx.closePath();
    mCtx.fill();

    // Stamp mask to erase veil
    veilCtx.drawImage(maskCanvas, 0, 0);
  }

  veilCtx.restore();

  // Now, back on the veil layer, add subtle natural cloth hem shadows along the top and bottom edges of the opening
  veilCtx.save();
  veilCtx.globalCompositeOperation = 'source-over';

  const halfW = slitWidth / 2;
  const halfH = slitHeight / 2;

  // Top hem drape shadow
  const topHemGrad = veilCtx.createLinearGradient(0, centerY - halfH - 10, 0, centerY - halfH + 8);
  topHemGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  topHemGrad.addColorStop(0.7, 'rgba(25, 20, 15, 0.28)');
  topHemGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  veilCtx.fillStyle = topHemGrad;
  veilCtx.beginPath();
  veilCtx.rect(centerX - halfW, centerY - halfH - 12, slitWidth, 24);
  veilCtx.fill();

  // Bottom hem edge fold
  const btmHemGrad = veilCtx.createLinearGradient(0, centerY + halfH - 8, 0, centerY + halfH + 10);
  btmHemGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  btmHemGrad.addColorStop(0.3, 'rgba(25, 20, 15, 0.22)');
  btmHemGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  veilCtx.fillStyle = btmHemGrad;
  veilCtx.beginPath();
  veilCtx.rect(centerX - halfW, centerY + halfH - 10, slitWidth, 22);
  veilCtx.fill();

  veilCtx.restore();
}
