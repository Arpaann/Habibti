import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  return (
    <footer className="bg-[#171715] border-t border-[#2E2D29] text-[#777168] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#2E2D29]">
          <div>
            <span className="font-serif text-2xl tracking-[0.25em] uppercase text-[#F3EFE6] font-semibold">
              HABIBTI
            </span>
            <p className="text-xs font-mono tracking-wider text-[#B5A68C] mt-1">
              An independent creative experiment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-[0.15em]">
            <button
              onClick={() =>
                setModalContent(
                  'Privacy: Habibti is 100% client-side. No images are uploaded to any server. All processing runs locally in your browser memory.'
                )
              }
              className="hover:text-[#F3EFE6] transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() =>
                setModalContent(
                  'Terms of Use: This application is provided free for personal creative transformation. You retain full ownership of your photographs and exported artworks.'
                )
              }
              className="hover:text-[#F3EFE6] transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() =>
                setModalContent(
                  'Credits: Inspired by the mysterious veiled-eye artwork aesthetic. Created as an independent client-side digital art project.'
                )
              }
              className="hover:text-[#F3EFE6] transition-colors"
            >
              Credits
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#777168]">
          <p>Not affiliated with, endorsed by, or associated with Drake or his record label.</p>
          <p>© {new Date().getFullYear()} HABIBTI. Built with React, TypeScript & HTML5 Canvas.</p>
        </div>
      </div>

      {/* Understated Modal */}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-[#21211E] border border-[#2E2D29] text-[#F3EFE6] p-6 max-w-md rounded-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif text-lg font-medium text-[#F3EFE6]">Information</h4>
            <p className="text-xs text-[#B5A68C] leading-relaxed font-light">{modalContent}</p>
            <div className="text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-[#2E2D29] hover:bg-[#3E3D39] text-xs font-mono uppercase tracking-wider rounded text-[#F3EFE6]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
