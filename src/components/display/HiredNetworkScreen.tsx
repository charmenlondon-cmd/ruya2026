'use client'

import { useEffect, useRef } from 'react'
import type { Hire } from '@/types/database'

const TRACK_COLOR: Record<string, string> = {
  'Engineering': '#60a5fa',
  'Finance': '#34d399',
  'Architecture & Design': '#f472b6',
  'Human Resources': '#fb923c',
  'IT': '#a78bfa',
  'Legal & Compliance': '#fbbf24',
  'Marketing': '#f87171',
  'Operations & Supply Chain': '#2dd4bf',
  'Project Management': '#e879f9',
  'Sales & Business Development': '#86efac',
}

function seed(id: string, n: number): number {
  let h = n * 2654435761
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(h ^ id.charCodeAt(i), 2246822519)) | 0
  }
  return (Math.abs(h) >>> 0) / 4294967295
}

interface CardProps {
  hire: Hire
  containerRef: React.RefObject<HTMLDivElement | null>
  isNew: boolean
}

function HireCard({ hire, containerRef, isNew }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isNew) return
    el.style.opacity = '0'
    let id1: number, id2: number
    id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        if (el) {
          el.style.transition = 'opacity 0.6s ease'
          el.style.opacity = '1'
        }
      })
    })
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2) }
  }, [isNew])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const r = (n: number) => seed(hire.id, n)

    // Two sine waves with different, irrational-ratio periods → complex Lissajous path
    // that covers the full container width and height over time
    const periodX = 35 * (1 + r(0) * 0.8)         // 35–63 s per x-cycle
    const periodY = 35 * (1 + r(1) * 0.8) * 1.27  // 44–80 s per y-cycle
    const phaseX  = r(2) * Math.PI * 2
    const phaseY  = r(3) * Math.PI * 2
    // Negative time offset so all cards are already mid-path on mount
    const timeOffset = -(r(4) * 600_000)  // up to 10 min back

    let animId: number

    const tick = (now: number) => {
      const container = containerRef.current
      if (!container || !el) { animId = requestAnimationFrame(tick); return }

      const W  = container.offsetWidth
      const H  = container.offsetHeight
      const cx = W / 2
      const cy = H / 2

      // Amplitude: card centre travels to within ~6% of each edge
      const ax = cx * 0.88
      const ay = cy * 0.88

      const t = (now + timeOffset) / 1000  // seconds
      const x = cx + ax * Math.sin((2 * Math.PI / periodX) * t + phaseX)
      const y = cy + ay * Math.sin((2 * Math.PI / periodY) * t + phaseY)

      // Set left/top directly — transform stays as centering offset only
      el.style.left = `${x}px`
      el.style.top  = `${y}px`

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [hire.id, containerRef])

  const color = TRACK_COLOR[hire.track] ?? '#ffffff'

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        overflow: 'hidden',
        margin: '0 auto 6px',
        background: color,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/avatars/${hire.avatar_id}.png`}
          alt={hire.player_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, margin: '0 0 2px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
        {hire.player_name}
      </p>
      <p style={{ color, fontSize: 11, margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
        {hire.track}
      </p>
    </div>
  )
}

interface Props {
  hires: Hire[]
}

export default function HiredNetworkScreen({ hires }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialIdsRef = useRef<Set<string> | null>(null)
  if (initialIdsRef.current === null) {
    initialIdsRef.current = new Set(hires.map((h) => h.id))
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', flex: 1, background: '#020617', overflow: 'hidden' }}
    >
      {/* Faint AAAH logo at centre */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.12, pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/aaah-logo-white.png" alt="" style={{ width: 160 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>

      {hires.length === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#475569' }}>
          <p style={{ fontSize: 18 }}>No hires yet today</p>
        </div>
      )}

      {hires.map((hire) => (
        <HireCard
          key={hire.id}
          hire={hire}
          containerRef={containerRef}
          isNew={!initialIdsRef.current!.has(hire.id)}
        />
      ))}
    </div>
  )
}
