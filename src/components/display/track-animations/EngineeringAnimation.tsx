'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

export function EngineeringAnimation() {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/animations/engineering.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(setAnimationData)
      .catch(() => {})
  }, [])

  if (!animationData) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Lottie
        animationData={animationData}
        loop
        className="absolute bottom-0 right-0 w-[480px] h-[480px] opacity-80"
      />
    </div>
  )
}
