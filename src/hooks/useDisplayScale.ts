'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  DEFAULT_DISPLAY_SCALE,
  displayScaleChannelName,
  getStoredDisplayScale,
  setStoredDisplayScale,
} from '@/lib/displayScale'

// urlOverride (from ?scale=) always wins when present, but is not persisted —
// it's a one-off manual override for the current page load only.
export function useDisplayScale(lane: string, urlOverride: number | null): number {
  const [scale, setScale] = useState<number>(() => getStoredDisplayScale(lane) ?? DEFAULT_DISPLAY_SCALE)

  useEffect(() => {
    const stored = getStoredDisplayScale(lane)
    if (stored) setScale(stored)

    const channel = supabase.channel(displayScaleChannelName(lane))
    channel
      .on('broadcast', { event: 'scale' }, ({ payload }) => {
        const next = Number((payload as { scale?: number } | null)?.scale)
        if (next > 0 && next <= 1) {
          setScale(next)
          setStoredDisplayScale(lane, next)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lane])

  return urlOverride ?? scale
}
