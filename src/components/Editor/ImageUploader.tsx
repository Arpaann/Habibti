import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ImageSource } from '../../types';
import { SAMPLE_PORTRAITS, getSampleImage } from '../../constants/sampleImages';

interface ImageUploaderProps {
  onImageLoaded: (source: ImageSource) => void;
  isLoadingSample?: boolean;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  isLoadingSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported format. Please upload a JPEG, PNG, or WebP photo.');
      return;
    }

    // Validate size (20MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select an image under 20 MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMessage('Failed to read the file. The image may be corrupt or unreadable.');
    };

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => {
        setErrorMessage('Failed to decode the image. Please try a different photo.');
      };
      img.onload = () => {
        onImageLoaded({
          img,
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          dataUrl,
        });
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    try {
      const sample = SAMPLE_PORTRAITS.find((s) => s.id === sampleId) || SAMPLE_PORTRAITS[0];
      const canvas = getSampleImage(sample.id);

      onImageLoaded({
        img: canvas,
        name: `${sample.name}.jpg`,
        width: canvas.width,
        height: canvas.height,
        aspectRatio: canvas.width / canvas.height,
      });
    } catch {
      setErrorMessage('Failed to load sample image.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-sm p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#171715] bg-[#E9E2D5]'
            : 'border-[#DCD3C4] bg-[#F3EFE6] hover:border-[#B5A68C] hover:bg-[#E9E2D5]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E9E2D5] flex items-center justify-center text-[#242320] shadow-sm">
            <Upload className="w-6 h-6 text-[#777168]" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-serif font-medium text-[#171715]">
              Drop your portrait here, or <span className="underline underline-offset-4 decoration-[#B5A68C]">browse</span>
            </p>
            <p className="text-xs text-[#777168] font-mono tracking-wider">
              Supports JPEG, PNG, WebP (up to 20 MB)
            </p>
          </div>

          <p className="text-[11px] text-[#777168] max-w-sm font-light">
            Front-facing portraits or close-up selfies with visible eyes produce the best veiled transformation.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Upload Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Try with sample portraits */}
      <div className="border-t border-[#DCD3C4] pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777168] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B5A68C]" />
            Or try an instant sample portrait:
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SAMPLE_PORTRAITS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              disabled={isLoadingSample}
              className="flex items-center gap-3 p-3 bg-[#E9E2D5] hover:bg-[#ded5c5] border border-[#DCD3C4] rounded-sm text-left transition-all group disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded bg-[#171715] flex items-center justify-center text-[#B5A68C] shrink-0">
                <ImageIcon className="w-5 h-5 text-[#B5A68C]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-serif font-medium text-[#171715] truncate">
                  {sample.name}
                </p>
                <p className="text-[10px] text-[#777168] truncate font-mono">
                  {sample.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
