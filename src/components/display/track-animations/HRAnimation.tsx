'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// HR_1: 1000×1000 (1:1) — background
// HR_2: 450×450  (1:1) — card decoration
const W_BG  = 200
const H_BG  = 200

const W_DEC = 130
const H_DEC = 130

export function HRAnimation() {
  const anim1 = useLottieFile('/animations/HR_1.json')

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

export function HRCardDecoration() {
  const anim2 = useLottieFile('/animations/HR_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 2px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
