'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

const W = 200
const H1 = Math.round(W * (1080 / 1920)) // 113 — background (16:9)
const H2 = Math.round(W * (500 / 500))   // 200 — card decoration (square)

// Background animation — _1 runs along the bottom
export function FinanceAnimation() {
  const anim1 = useLottieFile('/animations/Finance_1.json')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute bottom-0 opacity-80"
          style={{ width: W, height: H1, right: 'calc(50% - 492px)' }}
        />
      )}
    </div>
  )
}

// Card decoration — _2 anchored to the top-left of the question card wrapper
export function FinanceCardDecoration() {
  const anim2 = useLottieFile('/animations/Finance_2.json')
  if (!anim2) return null

  return (
    <div className="absolute pointer-events-none" style={{ bottom: '100%', left: 0, zIndex: 10 }}>
      <Lottie
        animationData={anim2}
        loop
        className="opacity-80"
        style={{ width: W, height: H2 }}
      />
    </div>
  )
}
