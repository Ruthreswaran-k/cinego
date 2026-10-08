import React from 'react';

interface CinematicBackgroundProps {
  variant?: 'cinema' | 'admin' | 'manager';
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({ variant = 'cinema' }) => {
  const primaryGlow =
    variant === 'admin'
      ? 'rgba(225, 29, 72, 0.14)'
      : variant === 'manager'
      ? 'rgba(217, 119, 6, 0.12)'
      : 'rgba(229, 9, 20, 0.15)';

  const secondaryGlow =
    variant === 'admin'
      ? 'rgba(99, 102, 241, 0.10)'
      : variant === 'manager'
      ? 'rgba(16, 185, 129, 0.10)'
      : 'rgba(245, 197, 24, 0.08)';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* 1. Deep Rich Cosmic Dark Base */}
      <div className="absolute inset-0 bg-[#070709]" />

      {/* 2. Hardware-Accelerated 3D Atmospheric Radial Gradients (0% GPU Overhead) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 65% 50% at 20% 0%, ${primaryGlow} 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 85% 25%, ${secondaryGlow} 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 50% 90%, rgba(30, 27, 75, 0.18) 0%, transparent 75%)
          `,
        }}
      />

      {/* 3. Subtle 3D Spatial Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 95%)',
        }}
      />

      {/* 4. Elegant Cinema Spotlight Cone (CSS Accelerated) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[850px] opacity-[0.07] pointer-events-none"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(255,255,255,0.2) 48%, rgba(229,9,20,0.3) 50%, rgba(255,255,255,0.2) 52%, transparent 60%)',
          filter: 'blur(40px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* 5. Edge Vignette for Focus */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80" />
    </div>
  );
};
