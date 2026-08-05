'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// Engineering_1: 1920×1080 (16:9) — ground-level scene, sits at the bottom
// Engineering_2: 1920×800 (2.4:1)  — sits above / resting on the question card
const W = 200
const H1 = Math.round(W * (1080 / 1920)) // 113
const H2 = Math.round(W * (800 / 1920))  // 83

export function EngineeringAnimation() {
  const anim1 = useLottieFile('/animations/Engineering_1.json')
  const anim2 = useLottieFile('/animations/Engineering_2.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Runs along the bottom — right edge aligned to right margin of text boxes */}
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute bottom-0 opacity-80"
          style={{ width: W, height: H1, right: 'calc(50% - 512px)' }}
        />
      )}
      {/* Rests on top of the question card — left edge aligned to left margin of text boxes */}
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute opacity-80"
          style={{ width: W, height: H2, bottom: '76%', left: 'calc(50% - 512px)' }}
        />
      )}
    </div>
  )
}
