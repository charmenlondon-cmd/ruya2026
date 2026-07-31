'use client'

import Image from 'next/image'

/**
 * ScreensaverScreen — baseline idle state shown when no game is active.
 *
 * Phase 6 note: The hired-network visualization (D3/Canvas) will be rendered
 * as an absolutely-positioned layer behind this content. Content layer is at
 * z-10, background glow at z-0, so the network layer can slot in at z-5.
 */
export function ScreensaverScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>

      {/* Background radial glow behind the logo — z-0 */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Content layer — z-10, gently floating */}
      <div
        className="flex flex-col items-center gap-8 z-10"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      >
        <Image
          src="/logos/aaah-logo-white.png"
          width={280}
          height={75}
          className="h-20 w-auto object-contain opacity-90"
          alt="Abdulla Al Arif Holding"
          priority
        />

        <h1 className="text-6xl font-bold text-white text-center">
          Ruya Careers Fair 2026
        </h1>

        <p className="text-3xl text-aaah-light-teal text-center animate-pulse">
          Pick up the iPad to start playing!
        </p>
      </div>
    </div>
  )
}
