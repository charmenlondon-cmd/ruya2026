'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

const W = 200
const H1 = Math.round(W * (1080 / 1920)) // 113 — card decoration
const H2 = Math.round(W * (500 / 500))   // 200 — background (square)

// Background animation — _2 runs along the bottom (same position as Engineering _1)
export function FinanceAnimation() {
  const anim2 = useLottieFile('/animations/Finance_2.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute bottom-0 opacity-80"
          style={{ width: W, height: H2, right: 'calc(50% - 492px)' }}
        />
      )}
    </div>
  )
}

// Card decoration — _1 anchored to the top-left of the question card (same as Engineering _2)
export function FinanceCardDecoration() {
  const anim1 = useLottieFile('/animations/Finance_1.json')
  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: '100%', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W, height: H1 }}
      />
    </div>
  )
}
