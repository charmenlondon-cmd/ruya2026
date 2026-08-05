'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// A&D_1: 1703×1024 (1.66:1) — room scene
// A&D_2: 1000×700  (1.43:1) — architect at desk
const W_BG  = 200
const H_BG  = Math.round(W_BG * (700 / 1000))   // 140 — AD_2 as background

const W_DEC = 200
const H_DEC = Math.round(W_DEC * (1024 / 1703))  // 120 — AD_1 as card decoration

// Background animation — architect at desk sits at the bottom
export function ArchitectureAnimation() {
  const anim2 = useLottieFile('/animations/AD_2.json')

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

// Card decoration — room scene, anchored to top-left of question card
export function ArchitectureCardDecoration() {
  const anim1 = useLottieFile('/animations/AD_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 30px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
