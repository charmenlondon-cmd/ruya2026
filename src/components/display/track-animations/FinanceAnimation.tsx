'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

const W_BG = 140
const H_BG = Math.round(W_BG * (1080 / 1920)) // 79 — background (16:9)
const W_DEC = 91
const H_DEC = 91                               // card decoration (square)

// Background animation — _1 runs along the bottom
export function FinanceAnimation() {
  const anim1 = useLottieFile('/animations/Finance_1.json')

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

// Card decoration — _2 anchored to the top-left of the question card wrapper
export function FinanceCardDecoration() {
  const anim2 = useLottieFile('/animations/Finance_2.json')
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
