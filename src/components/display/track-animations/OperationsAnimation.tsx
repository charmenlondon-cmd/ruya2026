'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

// Operations_1: 200×200  (1:1) — card decoration
// Operations_2: 1000×600 (5:3) — background
const W_BG  = 200
const H_BG  = Math.round(W_BG * (600 / 1000)) // 120

const W_DEC = 200
const H_DEC = 200

export function OperationsAnimation() {
  const anim2 = useLottieFile('/animations/Operations_2.json')

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

export function OperationsCardDecoration() {
  const anim1 = useLottieFile('/animations/Operations_1.json')
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
