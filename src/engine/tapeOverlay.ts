/**
 * Authentic Masking Tape & Analog Album Cover Renderer
 * Faithfully recreates the handmade masking-tape collage aesthetic
 * of Drake's Habibti artwork.
 */

export interface TapeStyleConfig {
  tapeBaseColor: string; // e.g. '#E4D8BE'
  tapeOpacity: number; // 0.85 - 0.94
  tapeShadow: number;
  tapeWarmth: number;
  contrastBoost: number;
}

export const TAPE_STYLES: Record<string, TapeStyleConfig> = {
  classic: {
    tapeBaseColor: '#E6DCBF',
    tapeOpacity: 0.90,
    tapeShadow: 0.35,
    tapeWarmth: 0.3,
    contrastBoost: 24,
  },
  aged: {
    tapeBaseColor: '#D8C79D',
    tapeOpacity: 0.88,
    tapeShadow: 0.45,
    tapeWarmth: 0.5,
    contrastBoost: 28,
  },
  noir: {
    tapeBaseColor: '#383530',
    tapeOpacity: 0.93,
    tapeShadow: 0.60,
    tapeWarmth: 0.0,
    contrastBoost: 40,
  },
};

/**
 * Draws realistic semi-translucent overlapping masking tape strips,
 * torn tape pieces, and the iconic rectangular eye window.
 */
export function renderMaskingTapeCollage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  eyeYPercent: number, // 30 - 60%
  eyeHeightPercent: number, // 10 - 25%
  eyeWidthPercent: number, // 35 - 70%
  styleKey: 'classic' | 'aged' | 'noir' = 'classic'
): void {
  const style = TAPE_STYLES[styleKey] || TAPE_STYLES.classic;

  // Create an offscreen buffer for the tape collage
  const tapeCanvas = document.createElement('canvas');
  tapeCanvas.width = width;
  tapeCanvas.height = height;
  const tCtx = tapeCanvas.getContext('2d');
  if (!tCtx) return;

  const hex = style.tapeBaseColor;
  const r = parseInt(hex.slice(1, 3), 16) || 230;
  const g = parseInt(hex.slice(3, 5), 16) || 220;
  const b = parseInt(hex.slice(5, 7), 16) || 191;

  // Eye window geometry
  const eyeCenterY = (eyeYPercent / 100) * height;
  const eyeH = (eyeHeightPercent / 100) * height;
  const eyeW = (eyeWidthPercent / 100) * width;
  const eyeX = (width - eyeW) / 2;
  const eyeY = eyeCenterY - eyeH / 2;

  // 1. Vertical Masking Tape Strips (overlapping columns)
  // Standard roll of masking tape is ~80-100px wide on a 1000px square
  const numStrips = 11;
  const stripW = width / (numStrips - 1.2);
  const overlap = stripW * 0.16; // 16% overlap between strips creates dark seams

  // Draw each vertical strip
  for (let i = 0; i < numStrips; i++) {
    const x = i * (stripW - overlap) - stripW * 0.1;
    tCtx.save();

    // Subtle individual tape strip opacity and hue jitter
    const stripAlpha = style.tapeOpacity + (Math.sin(i * 3.7) * 0.03);
    
    // Tape body: subtle linear gradient across strip width (crepe paper roll texture)
    const tapeGrad = tCtx.createLinearGradient(x, 0, x + stripW, 0);
    tapeGrad.addColorStop(0, `rgba(${r - 6}, ${g - 6}, ${b - 8}, ${stripAlpha})`);
    tapeGrad.addColorStop(0.15, `rgba(${r + 4}, ${g + 4}, ${b + 2}, ${stripAlpha})`);
    tapeGrad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${stripAlpha})`);
    tapeGrad.addColorStop(1, `rgba(${r - 10}, ${g - 10}, ${b - 12}, ${stripAlpha * 1.05})`);

    tCtx.fillStyle = tapeGrad;
    tCtx.fillRect(x, 0, stripW, height);

    // Left tape edge adhesive line / subtle seam
    tCtx.fillStyle = `rgba(${Math.max(0, r - 35)}, ${Math.max(0, g - 35)}, ${Math.max(0, b - 40)}, 0.22)`;
    tCtx.fillRect(x, 0, 1.5, height);

    // Right tape edge shadow
    tCtx.fillStyle = `rgba(${Math.max(0, r - 45)}, ${Math.max(0, g - 45)}, ${Math.max(0, b - 50)}, 0.28)`;
    tCtx.fillRect(x + stripW - 1.5, 0, 1.5, height);

    tCtx.restore();
  }

  // 2. Horizontal Masking Tape Strips (Forehead and Under-Eye Cheeks)
  // Just like the reference cover:
  // - Top horizontal tape strip taped across forehead right above the eye slit
  // - Bottom horizontal tape strip taped across cheeks right below the eye slit

  const horizTapeH = eyeH * 1.35;
  const topTapeY = eyeY - horizTapeH * 0.85;
  const btmTapeY = eyeY + eyeH - horizTapeH * 0.15;
  const horizW = width * 0.58;
  const horizX = (width - horizW) / 2;

  const drawHorizTape = (hx: number, hy: number, hw: number, hh: number, angle = 0) => {
    tCtx.save();
    tCtx.translate(hx + hw / 2, hy + hh / 2);
    if (angle !== 0) tCtx.rotate((angle * Math.PI) / 180);

    // Tape body
    tCtx.fillStyle = `rgba(${r + 2}, ${g + 2}, ${b}, ${style.tapeOpacity * 0.95})`;
    tCtx.fillRect(-hw / 2, -hh / 2, hw, hh);

    // Torn/serrated end edges (masking tape torn from roll)
    tCtx.strokeStyle = `rgba(${r - 40}, ${g - 40}, ${b - 45}, 0.35)`;
    tCtx.lineWidth = 1.5;
    tCtx.beginPath();
    tCtx.moveTo(-hw / 2, -hh / 2);
    tCtx.lineTo(-hw / 2, hh / 2);
    tCtx.moveTo(hw / 2, -hh / 2);
    tCtx.lineTo(hw / 2, hh / 2);
    tCtx.stroke();

    // Top and bottom adhesive edges
    tCtx.fillStyle = `rgba(${r - 35}, ${g - 35}, ${b - 40}, 0.25)`;
    tCtx.fillRect(-hw / 2, -hh / 2, hw, 1.5);
    tCtx.fillRect(-hw / 2, hh / 2 - 1.5, hw, 1.5);

    tCtx.restore();
  };

  // Draw forehead tape
  drawHorizTape(horizX, topTapeY, horizW, horizTapeH, 0.4);

  // Draw under-eye tape
  drawHorizTape(horizX, btmTapeY, horizW, horizTapeH, -0.6);

  // 3. Top-left torn tape corner detail (signature visual element from album cover!)
  tCtx.save();
  tCtx.fillStyle = `rgba(${r + 8}, ${g + 8}, ${b + 5}, 0.95)`;
  tCtx.beginPath();
  tCtx.moveTo(width * 0.08, 0);
  tCtx.lineTo(width * 0.22, 0);
  tCtx.lineTo(width * 0.20, height * 0.12);
  tCtx.bezierCurveTo(width * 0.16, height * 0.14, width * 0.10, height * 0.11, width * 0.08, height * 0.08);
  tCtx.closePath();
  tCtx.fill();

  // Curled tape crease shadow
  tCtx.strokeStyle = `rgba(30, 25, 20, 0.35)`;
  tCtx.lineWidth = 2;
  tCtx.beginPath();
  tCtx.moveTo(width * 0.08, height * 0.08);
  tCtx.lineTo(width * 0.20, height * 0.12);
  tCtx.stroke();
  tCtx.restore();

  // 4. Subtle Tape Wrinkles and Diagonal Creases
  const drawTapeCrease = (x1: number, y1: number, x2: number, y2: number) => {
    tCtx.save();
    // Shadow side
    tCtx.strokeStyle = `rgba(${Math.max(0, r - 55)}, ${Math.max(0, g - 55)}, ${Math.max(0, b - 60)}, 0.35)`;
    tCtx.lineWidth = 1.5;
    tCtx.beginPath();
    tCtx.moveTo(x1, y1);
    tCtx.lineTo(x2, y2);
    tCtx.stroke();

    // Highlight side
    tCtx.strokeStyle = `rgba(255, 255, 255, 0.45)`;
    tCtx.lineWidth = 1;
    tCtx.beginPath();
    tCtx.moveTo(x1 + 1, y1 + 1);
    tCtx.lineTo(x2 + 1, y2 + 1);
    tCtx.stroke();
    tCtx.restore();
  };

  // Creases under the eyes matching reference
  drawTapeCrease(eyeX + eyeW * 0.15, eyeY + eyeH + 8, eyeX + eyeW * 0.45, eyeY + eyeH + 32);
  drawTapeCrease(eyeX + eyeW * 0.55, eyeY + eyeH + 20, eyeX + eyeW * 0.85, eyeY + eyeH + 45);

  // 5. Punch Out the Clean Rectangular Eye Window
  // Erase tape layer in the eye region so the underlying sharp eyes show through
  tCtx.save();
  tCtx.globalCompositeOperation = 'destination-out';
  tCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  tCtx.fillRect(eyeX, eyeY, eyeW, eyeH);
  tCtx.restore();

  // 6. Cut-out Tape Border & Shadow around the Eye Window
  tCtx.save();
  // Cut tape edge shadow (the tape is layered on top of the print, so it casts a tiny 2px inner shadow)
  tCtx.strokeStyle = `rgba(20, 18, 15, 0.45)`;
  tCtx.lineWidth = 2;
  tCtx.strokeRect(eyeX, eyeY, eyeW, eyeH);

  // Subtle tape bevel highlight on top edge
  tCtx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
  tCtx.lineWidth = 1;
  tCtx.beginPath();
  tCtx.moveTo(eyeX, eyeY + eyeH);
  tCtx.lineTo(eyeX + eyeW, eyeY + eyeH);
  tCtx.stroke();
  tCtx.restore();

  // 7. Overall Crepe Paper Texture Grain
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 128;
  noiseCanvas.height = 128;
  const nCtx = noiseCanvas.getContext('2d');
  if (nCtx) {
    const nImg = nCtx.createImageData(128, 128);
    const nData = nImg.data;
    for (let i = 0; i < nData.length; i += 4) {
      const val = 120 + Math.random() * 40;
      nData[i] = val;
      nData[i + 1] = val;
      nData[i + 2] = val;
      nData[i + 3] = 25; // Subtle paper tooth
    }
    nCtx.putImageData(nImg, 0, 0);

    const pattern = tCtx.createPattern(noiseCanvas, 'repeat');
    if (pattern) {
      tCtx.fillStyle = pattern;
      tCtx.fillRect(0, 0, width, height);
    }
  }

  // Draw the entire tape collage onto the main canvas
  ctx.save();
  ctx.drawImage(tapeCanvas, 0, 0);
  ctx.restore();
}

/**
 * High contrast Black-and-White grading for the underlying portrait
 */
export function applyAlbumGrayscale(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  contrastBoost = 26
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const contrastFactor = (259 * (contrastBoost + 255)) / (255 * (259 - contrastBoost));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // High quality photographic luminance
    let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Contrast S-curve
    lum = contrastFactor * (lum - 128) + 128;

    // Slight fade on blacks
    lum = Math.min(255, Math.max(0, lum));

    data[i] = lum;
    data[i + 1] = lum;
    data[i + 2] = lum;
  }

  ctx.putImageData(imgData, 0, 0);
}
