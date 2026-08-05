'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import type { Track } from '@/types/database'

// & must be percent-encoded in URLs even though it's fine in filenames
const TRACK_FILES: Record<Track, [string, string]> = {
  'Engineering':                  ['/animations/Engineering_1.json',  '/animations/Engineering_2.json'],
  'Architecture & Design':        ['/animations/A%26D_1.json',         '/animations/A%26D_2.json'],
  'Finance':                      ['/animations/Finance_1.json',        '/animations/Finance_2.json'],
  'Human Resources':              ['/animations/HR_1.json',             '/animations/HR_2.json'],
  'IT':                           ['/animations/IT_1.json',             '/animations/IT_2.json'],
  'Legal & Compliance':           ['/animations/L%26C_1.json',          '/animations/L%26C_2.json'],
  'Marketing':                    ['/animations/Marketing_1.json',       '/animations/Marketing_2.json'],
  'Operations & Supply Chain':    ['/animations/Operations_1.json',      '/animations/Operations_2.json'],
  'Project Management':           ['/animations/PM_1.json',              '/animations/PM_2.json'],
  'Sales & Business Development': ['/animations/Sales_1.json',           '/animations/Sales_2.json'],
}

function useLottieFile(path: string) {
  const [data, setData] = useState<object | null>(null)
  useEffect(() => {
    fetch(path)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => {})
  }, [path])
  return data
}

function TrackAnimationPlayer({ file1, file2 }: { file1: string; file2: string }) {
  const anim1 = useLottieFile(file1)
  const anim2 = useLottieFile(file2)

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute bottom-0 right-0 w-[420px] h-[420px] opacity-75"
        />
      )}
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute bottom-0 left-0 w-[420px] h-[420px] opacity-75"
        />
      )}
    </div>
  )
}

export function TrackAnimation({ track }: { track: Track }) {
  const files = TRACK_FILES[track]
  if (!files) return null
  return <TrackAnimationPlayer file1={files[0]} file2={files[1]} />
}
