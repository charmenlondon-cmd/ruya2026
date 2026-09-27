'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// IT_1: 1000×1000 (1:1)   — card decoration
// IT_2: 1600×1200 (4:3)   — background
const W_BG  = 140
const H_BG  = Math.round(W_BG * (1200 / 1600)) // 105

const W_DEC = 140
const H_DEC = 140

export function ITAnimation() {
  const anim2 = useLottieFile('/animations/IT_2.json')

  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ top: 'calc(100% + 5px)', right: 0, zIndex: 1 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_BG, height: H_BG }}
      />
    </div>
  )
}

export function ITCardDecoration() {
  const anim1 = useLottieFile('/animations/IT_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 25px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
