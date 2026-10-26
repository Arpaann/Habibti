import { VeilSettings } from '../types';

/**
 * Procedurally generates the Habibti pleated fabric veil.
 * Uses layered irregular vertical bands, micro-weave fabric noise,
 * cylindrical fold highlights/shadows, and organic drape folds.
 */
export function renderVeilLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: VeilSettings
): void {
  // Create an offscreen buffer for the veil
  const veilCanvas = document.createElement('canvas');
  veilCanvas.width = width;
  veilCanvas.height = height;
  const vCtx = veilCanvas.getContext('2d');
  if (!vCtx) return;

  const hexColor = settings.color || '#C7BBAE';
  const baseR = parseInt(hexColor.slice(1, 3), 16) || 199;
  const baseG = parseInt(hexColor.slice(3, 5), 16) || 187;
  const baseB = parseInt(hexColor.slice(5, 7), 16) || 174;

  // 1. Base translucent fabric tint layer
  vCtx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${settings.opacity * 0.72})`;
  vCtx.fillRect(0, 0, width, height);

  // 2. Vertical ribbed stripes & drape folds
  // The stripes have varying widths, gentle waviness, and 3D bevels (highlight on left, shadow on right)
  const numStripes = Math.max(15, Math.floor(settings.stripeDensity * (width / 800)));
  const baseStripeWidth = width / numStripes;

  // Use a pseudo-random seed sequence for consistent stripe distribution
  let seed = 42;
  const pseudoRand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const waviness = settings.stripeWaviness * (width * 0.015);
  const softness = Math.max(0.1, settings.stripeSoftness);
  const foldShadowDepth = settings.foldsShadow;

  // Draw irregular pleated bands
  let currentX = 0;
  let stripeIndex = 0;

  while (currentX < width) {
    // Irregular width variation
    const widthJitter = (pseudoRand() - 0.5) * 0.4 * baseStripeWidth;
    const stripeWidth = Math.max(4, baseStripeWidth + widthJitter);
    const wavePhase = pseudoRand() * Math.PI * 2;
    const waveFreq = 1.5 + pseudoRand() * 2;

    // Fold shading: linear gradient across the stripe for a realistic 3D accordion/drape fold
    const stripeGrad = vCtx.createLinearGradient(currentX, 0, currentX + stripeWidth, 0);

    // Deep shadow in the crease
    const shadowOpacity = (0.25 + 0.35 * foldShadowDepth) * settings.opacity;
    // Highlight on ridge
    const highlightOpacity = (0.15 + 0.25 * (1 - softness)) * settings.opacity;

    // Pleat orientation (alternate ridges and grooves)
    const isOdd = stripeIndex % 2 === 1;

    if (isOdd) {
      stripeGrad.addColorStop(0, `rgba(${Math.max(0, baseR - 45)}, ${Math.max(0, baseG - 45)}, ${Math.max(0, baseB - 45)}, ${shadowOpacity})`);
      stripeGrad.addColorStop(0.4, `rgba(${baseR}, ${baseG}, ${baseB}, ${settings.opacity * 0.85})`);
      stripeGrad.addColorStop(1, `rgba(${Math.min(255, baseR + 35)}, ${Math.min(255, baseG + 35)}, ${Math.min(255, baseB + 30)}, ${highlightOpacity})`);
    } else {
      stripeGrad.addColorStop(0, `rgba(${Math.min(255, baseR + 30)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 25)}, ${highlightOpacity})`);
      stripeGrad.addColorStop(0.6, `rgba(${baseR}, ${baseG}, ${baseB}, ${settings.opacity * 0.85})`);
      stripeGrad.addColorStop(1, `rgba(${Math.max(0, baseR - 40)}, ${Math.max(0, baseG - 40)}, ${Math.max(0, baseB - 40)}, ${shadowOpacity})`);
    }

    vCtx.fillStyle = stripeGrad;

    // Draw wavy vertical strip
    vCtx.beginPath();
    const steps = 12;
    // Top-left to bottom-left
    for (let s = 0; s <= steps; s++) {
      const y = (s / steps) * height;
      const xOffset = Math.sin((y / height) * waveFreq * Math.PI + wavePhase) * waviness;
      if (s === 0) {
        vCtx.moveTo(currentX + xOffset, y);
      } else {
        vCtx.lineTo(currentX + xOffset, y);
      }
    }
    // Bottom-right to top-right
    for (let s = steps; s >= 0; s--) {
      const y = (s / steps) * height;
      const xOffset = Math.sin((y / height) * waveFreq * Math.PI + wavePhase) * waviness;
      vCtx.lineTo(currentX + stripeWidth + xOffset, y);
    }
    vCtx.closePath();
    vCtx.fill();

    // Subtle fine inner pinstripe line
    if (stripeIndex % 3 === 0) {
      vCtx.strokeStyle = `rgba(${Math.min(255, baseR + 40)}, ${Math.min(255, baseG + 40)}, ${Math.min(255, baseB + 35)}, ${0.15 * settings.opacity})`;
      vCtx.lineWidth = 1;
      vCtx.beginPath();
      const midX = currentX + stripeWidth * 0.5;
      vCtx.moveTo(midX, 0);
      vCtx.lineTo(midX, height);
      vCtx.stroke();
    }

    currentX += stripeWidth;
    stripeIndex++;
  }

  // 3. Broad organic drapery shadows (curtain draping across facial depth)
  const drapeGrad = vCtx.createLinearGradient(0, 0, width, height * 0.8);
  drapeGrad.addColorStop(0, `rgba(0, 0, 0, ${0.12 * foldShadowDepth})`);
  drapeGrad.addColorStop(0.35, `rgba(255, 255, 255, ${0.08 * (1 - foldShadowDepth)})`);
  drapeGrad.addColorStop(0.65, `rgba(0, 0, 0, ${0.15 * foldShadowDepth})`);
  drapeGrad.addColorStop(1, `rgba(0, 0, 0, ${0.25 * foldShadowDepth})`);
  vCtx.fillStyle = drapeGrad;
  vCtx.fillRect(0, 0, width, height);

  // 4. Procedural micro-weave fabric noise
  if (settings.fabricTexture > 0.05) {
    const textureCanvas = document.createElement('canvas');
    const tSize = 128;
    textureCanvas.width = tSize;
    textureCanvas.height = tSize;
    const tCtx = textureCanvas.getContext('2d');
    if (tCtx) {
      const imgData = tCtx.createImageData(tSize, tSize);
      const tData = imgData.data;
      const noiseAmp = settings.fabricTexture * 35;

      for (let i = 0; i < tData.length; i += 4) {
        const px = (i / 4) % tSize;
        const py = Math.floor((i / 4) / tSize);

        // Linen cross-hatch weave pattern
        const weaveX = (px % 2 === 0) ? 1 : -1;
        const weaveY = (py % 2 === 0) ? 1 : -1;
        const n = (Math.random() - 0.5) * noiseAmp + (weaveX * weaveY * 4);

        const val = Math.min(255, Math.max(0, 128 + n));
        tData[i] = val;
        tData[i + 1] = val;
        tData[i + 2] = val;
        tData[i + 3] = Math.floor(settings.fabricTexture * 45); // subtle alpha
      }
      tCtx.putImageData(imgData, 0, 0);

      const pattern = vCtx.createPattern(textureCanvas, 'repeat');
      if (pattern) {
        vCtx.fillStyle = pattern;
        vCtx.fillRect(0, 0, width, height);
      }
    }
  }

  // Draw the finished veil onto the main context with soft compositing
  ctx.save();
  ctx.drawImage(veilCanvas, 0, 0);
  ctx.restore();
}
