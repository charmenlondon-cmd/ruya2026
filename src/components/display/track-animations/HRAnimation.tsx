'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// HR_1: 1000×1000 (1:1) — background
// HR_2: 450×450  (1:1) — card decoration
const W_BG  = 140
const H_BG  = 140

const W_DEC = 91
const H_DEC = 91

export function HRAnimation() {
  const anim1 = useLottieFile('/animations/HR_1.json')

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

export function HRCardDecoration() {
  const anim2 = useLottieFile('/animations/HR_2.json')
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
