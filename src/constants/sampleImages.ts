// Procedural realistic portrait generator for offline high-quality samples

export interface SamplePortraitData {
  id: string;
  name: string;
  subtitle: string;
  gender: 'female' | 'male';
  thumbnailUrl: string;
}

function createPortraitCanvas(gender: 'female' | 'male', eyeColor = '#3a2d24'): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background - moody studio gradient
  const bgGrad = ctx.createRadialGradient(size * 0.5, size * 0.45, 100, size * 0.5, size * 0.5, size * 0.7);
  bgGrad.addColorStop(0, '#55524e');
  bgGrad.addColorStop(0.6, '#2b2927');
  bgGrad.addColorStop(1, '#151413');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Soft shoulder / neck silhouette
  ctx.save();
  ctx.fillStyle = '#1c1b1a';
  ctx.beginPath();
  ctx.moveTo(size * 0.2, size);
  ctx.bezierCurveTo(size * 0.25, size * 0.75, size * 0.35, size * 0.7, size * 0.4, size * 0.65);
  ctx.lineTo(size * 0.6, size * 0.65);
  ctx.bezierCurveTo(size * 0.65, size * 0.7, size * 0.75, size * 0.75, size * 0.8, size);
  ctx.closePath();
  ctx.fill();

  // Neck
  const neckGrad = ctx.createLinearGradient(size * 0.4, size * 0.55, size * 0.6, size * 0.55);
  neckGrad.addColorStop(0, '#4a443d');
  neckGrad.addColorStop(0.5, '#786e63');
  neckGrad.addColorStop(1, '#4a443d');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.rect(size * 0.42, size * 0.5, size * 0.16, size * 0.2);
  ctx.fill();

  // Face oval
  const faceGrad = ctx.createRadialGradient(size * 0.48, size * 0.4, 40, size * 0.5, size * 0.44, size * 0.35);
  faceGrad.addColorStop(0, '#8c8074');
  faceGrad.addColorStop(0.5, '#6b6156');
  faceGrad.addColorStop(0.85, '#4a433b');
  faceGrad.addColorStop(1, '#2e2a25');
  ctx.fillStyle = faceGrad;

  ctx.beginPath();
  const faceW = gender === 'female' ? size * 0.24 : size * 0.26;
  const faceH = gender === 'female' ? size * 0.32 : size * 0.33;
  ctx.ellipse(size * 0.5, size * 0.42, faceW, faceH, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#11100f';
  ctx.beginPath();
  if (gender === 'female') {
    ctx.arc(size * 0.5, size * 0.38, size * 0.28, Math.PI * 0.8, Math.PI * 2.2);
    ctx.bezierCurveTo(size * 0.8, size * 0.6, size * 0.75, size * 0.85, size * 0.7, size * 0.95);
    ctx.lineTo(size * 0.3, size * 0.95);
    ctx.bezierCurveTo(size * 0.25, size * 0.85, size * 0.2, size * 0.6, size * 0.22, size * 0.38);
  } else {
    ctx.arc(size * 0.5, size * 0.35, size * 0.27, Math.PI * 0.85, Math.PI * 2.15);
    ctx.bezierCurveTo(size * 0.74, size * 0.35, size * 0.72, size * 0.52, size * 0.68, size * 0.5);
    ctx.lineTo(size * 0.32, size * 0.5);
    ctx.bezierCurveTo(size * 0.28, size * 0.52, size * 0.26, size * 0.35, size * 0.35, size * 0.35);
  }
  ctx.fill();

  // Eyebrows
  const browY = size * 0.38;
  const leftEyeX = size * 0.42;
  const rightEyeX = size * 0.58;
  const eyeY = size * 0.42;

  ctx.strokeStyle = '#1d1916';
  ctx.lineWidth = gender === 'female' ? 6 : 9;
  ctx.lineCap = 'round';
  // Left brow
  ctx.beginPath();
  ctx.moveTo(leftEyeX - size * 0.06, browY + 3);
  ctx.quadraticCurveTo(leftEyeX, browY - (gender === 'female' ? 8 : 4), leftEyeX + size * 0.05, browY + (gender === 'female' ? 3 : 5));
  ctx.stroke();

  // Right brow
  ctx.beginPath();
  ctx.moveTo(rightEyeX - size * 0.05, browY + (gender === 'female' ? 3 : 5));
  ctx.quadraticCurveTo(rightEyeX, browY - (gender === 'female' ? 8 : 4), rightEyeX + size * 0.06, browY + 3);
  ctx.stroke();

  // Eye Sockets & realistic eyes
  const drawEye = (x: number, y: number, isRight: boolean) => {
    ctx.save();
    // Eye socket shadow
    const socketGrad = ctx.createRadialGradient(x, y, 10, x, y, 45);
    socketGrad.addColorStop(0, 'rgba(30, 25, 20, 0.4)');
    socketGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = socketGrad;
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fill();

    // Sclera (eyeball white) with realistic curvature and ambient shadow
    const eyeW = size * 0.046;
    const eyeH = size * 0.021;
    ctx.beginPath();
    ctx.moveTo(x - eyeW, y);
    ctx.bezierCurveTo(x - eyeW * 0.5, y - eyeH * 1.3, x + eyeW * 0.5, y - eyeH * 1.3, x + eyeW, y);
    ctx.bezierCurveTo(x + eyeW * 0.5, y + eyeH * 1.1, x - eyeW * 0.5, y + eyeH * 1.1, x - eyeW, y);
    ctx.closePath();

    ctx.fillStyle = '#e4dfd8';
    ctx.fill();

    // Eyelid shadow across top of eyeball
    ctx.save();
    ctx.clip();
    const eyeShadow = ctx.createLinearGradient(x, y - eyeH, x, y + eyeH);
    eyeShadow.addColorStop(0, 'rgba(50, 42, 36, 0.6)');
    eyeShadow.addColorStop(0.4, 'rgba(100, 90, 80, 0.1)');
    eyeShadow.addColorStop(1, 'rgba(230, 225, 218, 0.1)');
    ctx.fillStyle = eyeShadow;
    ctx.fillRect(x - eyeW, y - eyeH, eyeW * 2, eyeH * 2);

    // Iris
    const irisR = eyeH * 1.25;
    const irisGrad = ctx.createRadialGradient(x, y, irisR * 0.2, x, y, irisR);
    irisGrad.addColorStop(0, '#5a4632');
    irisGrad.addColorStop(0.5, eyeColor);
    irisGrad.addColorStop(0.85, '#261c14');
    irisGrad.addColorStop(1, '#110b07');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(x, y, irisR, 0, Math.PI * 2);
    ctx.fill();

    // Iris fine radial striations
    ctx.strokeStyle = 'rgba(200, 180, 150, 0.25)';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4);
      ctx.lineTo(x + Math.cos(angle) * irisR * 0.8, y + Math.sin(angle) * irisR * 0.8);
      ctx.stroke();
    }

    // Pupil
    ctx.fillStyle = '#0a0807';
    ctx.beginPath();
    ctx.arc(x, y, irisR * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Realistic Catchlight (reflection of light source)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(x - irisR * 0.32, y - irisR * 0.32, irisR * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x + irisR * 0.25, y + irisR * 0.25, irisR * 0.09, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // clip

    // Eyelid line & Eyelashes
    ctx.strokeStyle = '#181310';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x - eyeW - 2, y);
    ctx.bezierCurveTo(x - eyeW * 0.5, y - eyeH * 1.35, x + eyeW * 0.5, y - eyeH * 1.35, x + eyeW + 2, y);
    ctx.stroke();

    // Lower eyelid subtle line
    ctx.strokeStyle = 'rgba(40, 32, 26, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - eyeW + 4, y + 2);
    ctx.bezierCurveTo(x - eyeW * 0.4, y + eyeH * 1.05, x + eyeW * 0.4, y + eyeH * 1.05, x + eyeW - 4, y + 2);
    ctx.stroke();

    // Eyelash flairs
    ctx.strokeStyle = '#181310';
    ctx.lineWidth = 1.8;
    const lashCount = gender === 'female' ? 12 : 6;
    for (let i = 0; i < lashCount; i++) {
      const t = i / (lashCount - 1);
      const lx = (x - eyeW * 0.8) + t * (eyeW * 1.6);
      const ly = y - eyeH * (1.1 - 0.4 * Math.pow(t * 2 - 1, 2));
      const angle = (isRight ? -0.2 : 0.2) + (t - 0.5) * 0.8 - Math.PI / 2;
      const len = (gender === 'female' ? 7 : 4) + Math.sin(t * Math.PI) * 4;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + Math.cos(angle) * len, ly + Math.sin(angle) * len);
      ctx.stroke();
    }

    ctx.restore();
  };

  drawEye(leftEyeX, eyeY, false);
  drawEye(rightEyeX, eyeY, true);

  // Nose bridge & soft shadows
  const noseGrad = ctx.createLinearGradient(size * 0.49, size * 0.42, size * 0.53, size * 0.5);
  noseGrad.addColorStop(0, 'rgba(40, 34, 28, 0.2)');
  noseGrad.addColorStop(0.7, 'rgba(40, 34, 28, 0.35)');
  noseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.moveTo(size * 0.49, size * 0.41);
  ctx.lineTo(size * 0.52, size * 0.5);
  ctx.lineTo(size * 0.48, size * 0.51);
  ctx.closePath();
  ctx.fill();

  // Subtle nostril shadow
  ctx.fillStyle = 'rgba(25, 20, 16, 0.5)';
  ctx.beginPath();
  ctx.ellipse(size * 0.485, size * 0.51, 6, 3, -0.2, 0, Math.PI * 2);
  ctx.ellipse(size * 0.515, size * 0.51, 6, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Lips
  const lipY = size * 0.57;
  const lipGrad = ctx.createLinearGradient(size * 0.44, lipY, size * 0.56, lipY);
  lipGrad.addColorStop(0, '#55423c');
  lipGrad.addColorStop(0.5, '#755850');
  lipGrad.addColorStop(1, '#55423c');
  ctx.fillStyle = lipGrad;
  ctx.beginPath();
  ctx.moveTo(size * 0.45, lipY);
  ctx.bezierCurveTo(size * 0.48, lipY - 8, size * 0.5, lipY - 4, size * 0.5, lipY - 6);
  ctx.bezierCurveTo(size * 0.5, lipY - 4, size * 0.52, lipY - 8, size * 0.55, lipY);
  ctx.bezierCurveTo(size * 0.53, lipY + 12, size * 0.47, lipY + 12, size * 0.45, lipY);
  ctx.fill();

  ctx.strokeStyle = '#291e1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size * 0.45, lipY);
  ctx.bezierCurveTo(size * 0.48, lipY + 1, size * 0.52, lipY + 1, size * 0.55, lipY);
  ctx.stroke();

  ctx.restore();
  return canvas;
}

// Cached sample canvases
const sampleCanvasCache = new Map<string, HTMLCanvasElement>();

export function getSampleImage(id: string): HTMLCanvasElement {
  if (sampleCanvasCache.has(id)) {
    return sampleCanvasCache.get(id)!;
  }

  const gender = id.includes('female') ? 'female' : 'male';
  const eyeColor = id.includes('female') ? '#44382c' : '#30261f';
  const canvas = createPortraitCanvas(gender, eyeColor);
  sampleCanvasCache.set(id, canvas);
  return canvas;
}

export function getSampleThumbnailUrl(id: string): string {
  const canvas = getSampleImage(id);
  // generate small thumbnail
  const thumb = document.createElement('canvas');
  thumb.width = 160;
  thumb.height = 160;
  const ctx = thumb.getContext('2d');
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, 160, 160);
    return thumb.toDataURL('image/jpeg', 0.8);
  }
  return '';
}

export const SAMPLE_PORTRAITS: SamplePortraitData[] = [
  {
    id: 'sample-female-1',
    name: 'Muse Editorial',
    subtitle: 'Warm portrait with expressive gaze',
    gender: 'female',
    thumbnailUrl: '',
  },
  {
    id: 'sample-male-1',
    name: 'Nocturne Studio',
    subtitle: 'Dramatic gaze with strong brow',
    gender: 'male',
    thumbnailUrl: '',
  },
];
