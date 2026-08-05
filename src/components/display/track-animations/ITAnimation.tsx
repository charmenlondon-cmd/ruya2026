'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// IT_1: 1000×1000 (1:1)   — card decoration
// IT_2: 1600×1200 (4:3)   — background
const W_BG  = 200
const H_BG  = Math.round(W_BG * (1200 / 1600)) // 150

const W_DEC = 200
const H_DEC = 200

export function ITAnimation() {
  const anim2 = useLottieFile('/animations/IT_2.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute opacity-80"
          style={{ width: W_BG, height: H_BG, bottom: '24px', right: 'calc(50% - 512px)' }}
        />
      )}
    </div>
  )
}

export function ITCardDecoration() {
  const anim1 = useLottieFile('/animations/IT_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 23px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
