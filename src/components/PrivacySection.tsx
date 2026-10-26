import React from 'react';
import { Lock, Cpu, EyeOff, ShieldCheck } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-20 bg-[#171715] text-[#F3EFE6] relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,#fff_0px,#fff_1px,transparent_1px,transparent_40px)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242320] border border-[#2E2D29] text-[10px] font-mono tracking-[0.25em] uppercase text-[#B5A68C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B5A68C]" />
              Zero-Cloud Processing Guarantee
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F3EFE6]">
              Your face stays yours.
            </h2>

            <p className="text-base sm:text-lg text-[#B5A68C]/80 font-light leading-relaxed max-w-xl">
              Your photo is processed directly in your browser using the HTML5 Canvas API. The standard transformation does not upload your image to any server, database, or cloud service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#2E2D29]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#F3EFE6]">
                  <Cpu className="w-4 h-4 text-[#B5A68C]" />
                  Client Canvas
                </div>
                <p className="text-xs text-[#777168] leading-relaxed">
                  Pixels are manipulated right on your local device GPU/CPU.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#F3EFE6]">
                  <EyeOff className="w-4 h-4 text-[#B5A68C]" />
                  No Facial Tracking
                </div>
                <p className="text-xs text-[#777168] leading-relaxed">
                  No face embeddings, biometric scanning, or external AI models.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#F3EFE6]">
                  <Lock className="w-4 h-4 text-[#B5A68C]" />
                  Session Ephemeral
                </div>
                <p className="text-xs text-[#777168] leading-relaxed">
                  Refreshing or closing the tab immediately purges the photo from memory.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#21211E] border border-[#2E2D29] p-6 rounded-sm space-y-4">
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#777168] border-b border-[#2E2D29] pb-3">
              Data Flow Verification
            </div>

            <div className="space-y-3 font-mono text-xs text-[#B5A68C]">
              <div className="flex items-center justify-between p-2.5 bg-[#171715] rounded border border-[#2E2D29]">
                <span>Image Ingestion</span>
                <span className="text-[#8E7D62]">Browser Memory (Blob)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#171715] rounded border border-[#2E2D29]">
                <span>Grayscale & Veil Pipeline</span>
                <span className="text-[#8E7D62]">Local Canvas 2D</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#171715] rounded border border-[#2E2D29]">
                <span>Network Requests</span>
                <span className="text-emerald-400 font-semibold">0 bytes sent</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#171715] rounded border border-[#2E2D29]">
                <span>File Export</span>
                <span className="text-[#8E7D62]">Direct Browser Save</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
