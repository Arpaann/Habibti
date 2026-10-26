import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onScrollToEditor: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToEditor,
  onScrollToHowItWorks,
  onScrollToPrivacy,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#F3EFE6]/90 backdrop-blur-md border-b border-[#DCD3C4]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-left group"
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] uppercase text-[#171715] font-semibold transition-opacity group-hover:opacity-80">
                HABIBTI
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#777168] -mt-1 font-mono">
                Portraits Behind the Veil
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onScrollToHowItWorks}
              className="text-xs tracking-[0.18em] uppercase text-[#777168] hover:text-[#171715] transition-colors font-medium py-1"
            >
              How it works
            </button>
            <button
              onClick={onScrollToPrivacy}
              className="flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[#777168] hover:text-[#171715] transition-colors font-medium py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B5A68C]" />
              Privacy (100% Local)
            </button>
            <button
              onClick={onScrollToEditor}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171715] text-[#F3EFE6] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#2e2d29] active:scale-95 transition-all shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B5A68C]" />
              Create Yours
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#242320] hover:bg-[#E9E2D5] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#E9E2D5] border-b border-[#DCD3C4] px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => {
              onScrollToHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs uppercase tracking-[0.18em] text-[#242320] font-medium"
          >
            How it works
          </button>
          <button
            onClick={() => {
              onScrollToPrivacy();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-xs uppercase tracking-[0.18em] text-[#242320] font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-[#8E7D62]" />
            Privacy & 100% Local
          </button>
          <button
            onClick={() => {
              onScrollToEditor();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center py-3 rounded-full bg-[#171715] text-[#F3EFE6] text-xs uppercase tracking-[0.18em] font-medium"
          >
            Create Your Portrait
          </button>
        </div>
      )}
    </nav>
  );
};
