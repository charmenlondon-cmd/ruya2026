'use client'

import Lottie from 'lottie-react'
import { useLottieFile } from './useLottieFile'

const W = 200
const H1 = Math.round(W * (1080 / 1920)) // 113
const H2 = Math.round(W * (800 / 1920))  // 83

// Background animation — _1 runs along the bottom of the content area
export function EngineeringAnimation() {
  const anim1 = useLottieFile('/animations/Engineering_1.json')

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
