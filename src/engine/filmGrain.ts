import { TextureSettings } from '../types';

/**
 * Applies fine film grain and vintage editorial vignette.
 */
export function applyTextureAndVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: TextureSettings
): void {
  // 1. Vignette
  if (settings.vignette > 0) {
    ctx.save();
    const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const innerRadius = radius * 0.45;
    const vignetteGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      innerRadius,
      width / 2,
      height / 2,
      radius
    );
    const maxVigOpacity = (settings.vignette / 100) * 0.65;
    vignetteGrad.addColorStop(0, 'rgba(15, 14, 13, 0)');
    vignetteGrad.addColorStop(0.65, `rgba(15, 14, 13, ${maxVigOpacity * 0.4})`);
    vignetteGrad.addColorStop(1, `rgba(10, 9, 8, ${maxVigOpacity})`);

    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 2. Film Grain
  if (settings.filmGrain > 0) {
    ctx.save();
    // To ensure fast real-time performance on both preview and high-res exports,
    // we generate a repeating high-quality grain tile
    const grainCanvas = document.createElement('canvas');
    const tileSize = 256;
    grainCanvas.width = tileSize;
    grainCanvas.height = tileSize;
    const gCtx = grainCanvas.getContext('2d');

    if (gCtx) {
      const gImgData = gCtx.createImageData(tileSize, tileSize);
      const data = gImgData.data;
      const grainIntensity = (settings.filmGrain / 100) * 45;

      for (let i = 0; i < data.length; i += 4) {
        // Gaussian-like noise distribution
        const r1 = Math.random();
        const r2 = Math.random();
        const noise = (Math.sqrt(-2.0 * Math.log(r1 + 0.0001)) * Math.cos(2.0 * Math.PI * r2) * grainIntensity);

        const val = Math.min(255, Math.max(0, 128 + noise));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(Math.min(255, Math.abs(noise) * 2.8));
      }
      gCtx.putImageData(gImgData, 0, 0);

      // Blend grain over image with soft-light or overlay
      ctx.globalCompositeOperation = 'soft-light';
      const grainPattern = ctx.createPattern(grainCanvas, 'repeat');
      if (grainPattern) {
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
    ctx.restore();
  }
}
