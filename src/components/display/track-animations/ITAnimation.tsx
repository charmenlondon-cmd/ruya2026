'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// IT_1: 1000×1000 (1:1)   — background
// IT_2: 1600×1200 (4:3)   — card decoration
const W_BG  = 200
const H_BG  = 200

const W_DEC = 200
const H_DEC = Math.round(W_DEC * (1200 / 1600)) // 150

export function ITAnimation() {
  const anim1 = useLottieFile('/animations/IT_1.json')

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

export function ITCardDecoration() {
  const anim2 = useLottieFile('/animations/IT_2.json')
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
