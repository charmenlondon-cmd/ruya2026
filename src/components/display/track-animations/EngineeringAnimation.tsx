'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

const W = 140
const H1 = Math.round(W * (1080 / 1920)) // 79
const H2 = Math.round(W * (800 / 1920))  // 58

// Background animation — _1 runs along the bottom of the content area
export function EngineeringAnimation() {
  const anim1 = useLottieFile('/animations/Engineering_1.json')

  if (!anim1) return null

  return (
    <div className="absolute pointer-events-none" style={{ top: 'calc(100% + 5px)', right: 0, zIndex: 1 }}>
      <Lottie
        animationData={anim1}
        loop
        className="opacity-80"
        style={{ width: W, height: H1 }}
      />
    </div>
  )
}

// Card decoration — _2 is anchored to the top-left corner of the question card
export function EngineeringCardDecoration() {
  const anim2 = useLottieFile('/animations/Engineering_2.json')
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
