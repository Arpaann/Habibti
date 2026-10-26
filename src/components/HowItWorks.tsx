import React from 'react';
import { UploadCloud, Sliders, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload your photo',
      description: 'Select any selfie or portrait (JPEG, PNG, WebP). Your image never leaves your browser.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Adjust veil & gaze',
      description: 'Position your eyes inside the natural feathered slit. Customize fabric pleats, contrast, and film grain.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Download high-res',
      description: 'Export an uncompressed 1:1 or 4:5 editorial portrait ready for social media or print. No watermarks.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-[#DCD3C4]/60 bg-[#E9E2D5]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#777168] mb-2">
            The Three-Step Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171715] font-normal tracking-tight">
            Effortless editorial transformation.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#F3EFE6] border border-[#DCD3C4] p-8 rounded-sm shadow-subtle hover:border-[#B5A68C] transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl text-[#B5A68C] group-hover:text-[#171715] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#E9E2D5] flex items-center justify-center text-[#242320]">
                    <Icon className="w-5 h-5 text-[#777168] group-hover:text-[#171715] transition-colors" />
                  </div>
                </div>

                <h3 className="font-serif text-xl text-[#171715] font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#777168] leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
