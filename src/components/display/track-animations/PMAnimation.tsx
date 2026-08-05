'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// PM_1: 700×500  (7:5) — background
// PM_2: 1250×1000 (5:4) — card decoration
const W_BG  = 140
const H_BG  = Math.round(W_BG * (500 / 700))  // 100

const W_DEC = 140
const H_DEC = Math.round(W_DEC * (1000 / 1250)) // 112

export function PMAnimation() {
  const anim1 = useLottieFile('/animations/PM_1.json')

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

export function PMCardDecoration() {
  const anim2 = useLottieFile('/animations/PM_2.json')
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
