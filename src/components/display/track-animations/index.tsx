'use client'

import Lottie from 'lottie-react'
import type { Track } from '@/types/database'
import { useLottieFile } from './useLottieFile'
import { EngineeringAnimation, EngineeringCardDecoration } from './EngineeringAnimation'
import { FinanceAnimation, FinanceCardDecoration } from './FinanceAnimation'
import { ArchitectureAnimation, ArchitectureCardDecoration } from './ArchitectureAnimation'
import { HRAnimation, HRCardDecoration } from './HRAnimation'
import { ITAnimation, ITCardDecoration } from './ITAnimation'
import { LCAnimation, LCCardDecoration } from './LCAnimation'
import { MarketingAnimation, MarketingCardDecoration } from './MarketingAnimation'
import { OperationsAnimation, OperationsCardDecoration } from './OperationsAnimation'
import { PMAnimation, PMCardDecoration } from './PMAnimation'

const GENERIC_FILES: Partial<Record<Track, [string, string]>> = {
  'Architecture & Design':        ['/animations/AD_1.json',            '/animations/AD_2.json'],
  'Finance':                      ['/animations/Finance_1.json',        '/animations/Finance_2.json'],
  'Human Resources':              ['/animations/HR_1.json',             '/animations/HR_2.json'],
  'IT':                           ['/animations/IT_1.json',             '/animations/IT_2.json'],
  'Legal & Compliance':           ['/animations/LC_1.json',             '/animations/LC_2.json'],
  'Marketing':                    ['/animations/Marketing_1.json',       '/animations/Marketing_2.json'],
  'Operations & Supply Chain':    ['/animations/Operations_1.json',      '/animations/Operations_2.json'],
  'Project Management':           ['/animations/PM_1.json',             '/animations/PM_2.json'],
  'Sales & Business Development': ['/animations/Sales_1.json',          '/animations/Sales_2.json'],
}

function GenericTrackAnimation({ file1, file2 }: { file1: string; file2: string }) {
  const anim1 = useLottieFile(file1)
  const anim2 = useLottieFile(file2)

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {anim1 && (
        <Lottie
          animationData={anim1}
          loop
          className="absolute bottom-0 right-0 w-[105px] h-[105px] opacity-75"
        />
      )}
      {anim2 && (
        <Lottie
          animationData={anim2}
          loop
          className="absolute bottom-0 left-0 w-[105px] h-[105px] opacity-75"
        />
      )}
    </div>
  )
}

// Rendered as an absolute overlay in the content area (behind cards)
export function TrackAnimation({ track }: { track: Track }) {
  if (track === 'Engineering') return <EngineeringAnimation />
  if (track === 'Finance') return <FinanceAnimation />
  if (track === 'Architecture & Design') return <ArchitectureAnimation />
  if (track === 'Human Resources') return <HRAnimation />
  if (track === 'IT') return <ITAnimation />
  if (track === 'Legal & Compliance') return <LCAnimation />
  if (track === 'Marketing') return <MarketingAnimation />
  if (track === 'Operations & Supply Chain') return <OperationsAnimation />
  if (track === 'Project Management') return <PMAnimation />

  const files = GENERIC_FILES[track]
  if (!files) return null
  return <GenericTrackAnimation file1={files[0]} file2={files[1]} />
}

// Rendered inside the question card div — always anchored to the card's top-left
export function TrackCardDecoration({ track }: { track: Track }) {
  if (track === 'Engineering') return <EngineeringCardDecoration />
  if (track === 'Finance') return <FinanceCardDecoration />
  if (track === 'Architecture & Design') return <ArchitectureCardDecoration />
  if (track === 'Human Resources') return <HRCardDecoration />
  if (track === 'IT') return <ITCardDecoration />
  if (track === 'Legal & Compliance') return <LCCardDecoration />
  if (track === 'Marketing') return <MarketingCardDecoration />
  if (track === 'Operations & Supply Chain') return <OperationsCardDecoration />
  if (track === 'Project Management') return <PMCardDecoration />
  return null
}
