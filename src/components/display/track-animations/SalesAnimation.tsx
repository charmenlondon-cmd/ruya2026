'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// Sales_1: 500×500  (1:1)   — background
// Sales_2: 1300×1000 (13:10) — card decoration
const W_BG  = 112
const H_BG  = 112

const W_DEC = 140
const H_DEC = Math.round(W_DEC * (1000 / 1300)) // 108

export function SalesAnimation() {
  const anim1 = useLottieFile('/animations/Sales_1.json')

  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ top: 'calc(100% + 5px)', right: 0, zIndex: 1 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_BG, height: H_BG }}
      />
    </div>
  )
}

export function SalesCardDecoration() {
  const anim2 = useLottieFile('/animations/Sales_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 16px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
