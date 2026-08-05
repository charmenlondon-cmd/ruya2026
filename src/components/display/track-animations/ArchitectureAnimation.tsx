'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// A&D_1: 1703×1024 (1.66:1) — room scene, background
// A&D_2: 1000×700  (1.43:1) — architect at desk, card decoration
const W_BG  = 200
const H_BG  = Math.round(W_BG * (1024 / 1703))  // 120

const W_DEC = 200
const H_DEC = Math.round(W_DEC * (700 / 1000))   // 140

// Background animation — room scene sits at the bottom
export function ArchitectureAnimation() {
  const anim1 = useLottieFile('/animations/A%26D_1.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute bottom-0 opacity-80"
          style={{ width: W_BG, height: H_BG, right: 'calc(50% - 492px)' }}
        />
      )}
    </div>
  )
}

// Card decoration — architect at desk, anchored to top-left of question card
export function ArchitectureCardDecoration() {
  const anim2 = useLottieFile('/animations/A%26D_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: 'calc(100% - 30px)', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W_DEC, height: H_DEC }}
      />
    </div>
  )
}
