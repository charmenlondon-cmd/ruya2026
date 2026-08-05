'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// PM_1: 700×500  (7:5) — card decoration
// PM_2: 1250×1000 (5:4) — background
const W_BG  = 140
const H_BG  = Math.round(W_BG * (1000 / 1250)) // 112

const W_DEC = 140
const H_DEC = Math.round(W_DEC * (500 / 700))  // 100

export function PMAnimation() {
  const anim2 = useLottieFile('/animations/PM_2.json')

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

export function PMCardDecoration() {
  const anim1 = useLottieFile('/animations/PM_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: '100%', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
