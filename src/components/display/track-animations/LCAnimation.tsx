'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// LC_1: 1000×1000 (1:1)    — background
// LC_2: 710×618  (~8:7)    — card decoration
const W_BG  = 140
const H_BG  = 140

const W_DEC = 140
const H_DEC = Math.round(W_DEC * (618 / 710)) // 122

export function LCAnimation() {
  const anim1 = useLottieFile('/animations/LC_1.json')

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

export function LCCardDecoration() {
  const anim2 = useLottieFile('/animations/LC_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 10px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
