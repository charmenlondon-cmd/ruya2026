'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// Marketing_1: 500×500 (1:1) — card decoration
// Marketing_2: 1000×1000 (1:1) — background
const W_BG  = 120
const H_BG  = 120

const W_DEC = 120
const H_DEC = 120

export function MarketingAnimation() {
  const anim2 = useLottieFile('/animations/Marketing_2.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute opacity-80"
          style={{ width: W_BG, height: H_BG, bottom: '14px', right: 'calc(50% - 512px)' }}
        />
      )}
    </div>
  )
}

export function MarketingCardDecoration() {
  const anim1 = useLottieFile('/animations/Marketing_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 8px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
