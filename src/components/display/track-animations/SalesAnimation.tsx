'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// Sales_1: 500×500  (1:1)   — background
// Sales_2: 1300×1000 (13:10) — card decoration
const W_BG  = 200
const H_BG  = 200

const W_DEC = 200
const H_DEC = Math.round(W_DEC * (1000 / 1300)) // 154

export function SalesAnimation() {
  const anim1 = useLottieFile('/animations/Sales_1.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute opacity-80"
          style={{ width: W_BG, height: H_BG, bottom: '24px', right: 'calc(50% - 512px)' }}
        />
      )}
    </div>
  )
}

export function SalesCardDecoration() {
  const anim2 = useLottieFile('/animations/Sales_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: '100%', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
