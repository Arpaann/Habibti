import React from 'react';
import { ArrowDown, Sparkles, Eye, Shield } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onTrySample: (sampleId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartCreating, onTrySample }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Background Subtle Pleat Texture Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#171715_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E2D5] border border-[#DCD3C4] text-[11px] font-mono tracking-[0.25em] uppercase text-[#777168]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E7D62] animate-pulse" />
              A Little Internet Obsession
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#171715] font-normal leading-[1.08]">
              Your eyes <br className="hidden sm:inline" />
              <span className="italic font-serif font-light text-[#777168]">tell the story.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#777168] max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Step behind the veil. Turn your photo into a monochrome, cinematic portrait inspired by the mysterious Habibti aesthetic.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartCreating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#171715] text-[#F3EFE6] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2c2b27] hover:shadow-art active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#B5A68C]" />
                Create your portrait
                <ArrowDown className="w-4 h-4 text-[#B5A68C]" />
              </button>

              <button
                onClick={() => onTrySample('sample-female-1')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#E9E2D5] border border-[#DCD3C4] text-[#242320] text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#ded5c5] transition-all"
              >
                <Eye className="w-4 h-4 text-[#777168]" />
                Try Sample Portrait
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-[11px] uppercase tracking-[0.15em] text-[#777168] font-mono">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#8E7D62]" />
                No Account
              </span>
              <span>•</span>
              <span>No Watermark</span>
              <span>•</span>
              <span>100% In-Browser</span>
            </div>
          </div>

          {/* Right Column: Visual Artwork Frame Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group cursor-pointer" onClick={onStartCreating}>
              {/* Outer Decorative Matting */}
              <div className="p-3 sm:p-4 bg-[#E9E2D5] rounded-sm shadow-art border border-[#DCD3C4]">
                <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] overflow-hidden bg-[#171715] shadow-inner">
                  {/* Veiled Portrait Artwork simulation */}
                  {/* Monochrome Face Silhouette underneath */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#3a3734] via-[#242220] to-[#121110]">
                    {/* Eyes Slit Opening */}
                    <div className="absolute top-[38%] left-[6%] right-[6%] h-[20%] rounded-full overflow-hidden shadow-2xl z-20 border-y border-[#171715]/40 flex items-center justify-center">
                      <div className="w-full h-full bg-[#2a2724] relative flex items-center justify-around px-8">
                        {/* Left Eye */}
                        <div className="relative w-12 h-6 flex items-center justify-center">
                          <div className="w-10 h-5 bg-[#dcd7d0] rounded-full overflow-hidden relative flex items-center justify-center shadow-inner">
                            <div className="w-5 h-5 rounded-full bg-[#231a13] relative flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#0d0907]" />
                              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-95" />
                            </div>
                          </div>
                          {/* Upper Eyelash line */}
                          <div className="absolute top-0 w-11 h-[2px] bg-[#120f0d] rounded-full" />
                        </div>

                        {/* Right Eye */}
                        <div className="relative w-12 h-6 flex items-center justify-center">
                          <div className="w-10 h-5 bg-[#dcd7d0] rounded-full overflow-hidden relative flex items-center justify-center shadow-inner">
                            <div className="w-5 h-5 rounded-full bg-[#231a13] relative flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#0d0907]" />
                              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-95" />
                            </div>
                          </div>
                          {/* Upper Eyelash line */}
                          <div className="absolute top-0 w-11 h-[2px] bg-[#120f0d] rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Pleated Veil Overlay above & below the slit */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          90deg,
                          rgba(199, 187, 174, 0.90) 0px,
                          rgba(215, 204, 192, 0.95) 7px,
                          rgba(182, 169, 155, 0.92) 14px,
                          rgba(164, 151, 137, 0.88) 18px
                        )`,
                        maskImage: 'radial-gradient(ellipse 90% 22% at 50% 48%, transparent 40%, black 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 22% at 50% 48%, transparent 40%, black 75%)',
                      }}
                    />

                    {/* Subtle drape lighting & film grain */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/35 pointer-events-none z-30" />
                    <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none z-30" />
                  </div>

                  {/* Editorial Tag Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 z-40 flex items-center justify-between text-[9px] font-mono tracking-[0.25em] uppercase text-[#F3EFE6]/70">
                    <span>PORTRAIT NO. 01</span>
                    <span>1:1 FINE ART</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#777168] group-hover:text-[#171715] transition-colors">
                    Click to Open Transformation Editor →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
