import type { ComponentType } from 'react'
import type { Track } from '@/types/database'
import { EngineeringAnimation } from './EngineeringAnimation'

const ANIMATIONS: Partial<Record<Track, ComponentType>> = {
  'Engineering': EngineeringAnimation,
}

export function TrackAnimation({ track }: { track: Track }) {
  const Animation = ANIMATIONS[track]
  if (!Animation) return null
  return <Animation />
}
