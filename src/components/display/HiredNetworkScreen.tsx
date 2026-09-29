'use client'

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
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

interface Motion {
  periodX: number
  periodY: number
  phaseX: number
  phaseY: number
  timeOffset: number
}

function motionFor(id: string): Motion {
  const r = (n: number) => seed(id, n)
  // Two sine waves with different, irrational-ratio periods → complex Lissajous path
  // that covers the full container width and height over time
  return {
    periodX: 35 * (1 + r(0) * 0.8),         // 35–63 s per x-cycle
    periodY: 35 * (1 + r(1) * 0.8) * 1.27,  // 44–80 s per y-cycle
    phaseX: r(2) * Math.PI * 2,
    phaseY: r(3) * Math.PI * 2,
    // Negative time offset so all cards are already mid-path on mount
    timeOffset: -(r(4) * 600_000),          // up to 10 min back
  }
}

// Positions via transform only (GPU-composited, no layout/paint per frame).
// translate(-50%,-50%) keeps the card centred on its path point.
function place(el: HTMLDivElement, m: Motion, W: number, H: number, now: number) {
  const cx = W / 2
  const cy = H / 2
  // Amplitude: card centre travels to within ~6% of each edge
  const ax = cx * 0.88
  const ay = cy * 0.88
  const t = (now + m.timeOffset) / 1000  // seconds
  const x = cx + ax * Math.sin((2 * Math.PI / m.periodX) * t + m.phaseX)
  const y = cy + ay * Math.sin((2 * Math.PI / m.periodY) * t + m.phaseY)
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
}

interface CardProps {
  hire: Hire
  register: (id: string, el: HTMLDivElement | null) => void
  isNew: boolean
}

function HireCard({ hire, register, isNew }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ref.current = el
    register(hire.id, el)
  }, [hire.id, register])

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

  const color = TRACK_COLOR[hire.track] ?? '#ffffff'

  // No transform in the style prop: the shared animation loop owns it, and a
  // re-render must not reset the card back to the corner.
  return (
    <div
      ref={setRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        willChange: 'transform',
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

  // One animation loop for every card. Previously each card ran its own rAF
  // loop that read the container size and then wrote left/top — with N cards
  // that forced N synchronous layouts per frame and got jerkier with every hire.
  const cardsRef = useRef(new Map<string, { el: HTMLDivElement; m: Motion }>())

  const register = useCallback((id: string, el: HTMLDivElement | null) => {
    if (!el) { cardsRef.current.delete(id); return }
    const m = motionFor(id)
    cardsRef.current.set(id, { el, m })
    // Place immediately so a newly added card never paints at the corner.
    const c = containerRef.current
    if (c) place(el, m, c.offsetWidth, c.offsetHeight, performance.now())
  }, [])

  useLayoutEffect(() => {
    let animId = 0
    const tick = (now: number) => {
      const c = containerRef.current
      if (c) {
        const W = c.offsetWidth   // one layout read per frame, then only transform writes
        const H = c.offsetHeight
        cardsRef.current.forEach(({ el, m }) => place(el, m, W, H, now))
      }
      animId = requestAnimationFrame(tick)
    }
    tick(performance.now())  // position everything before the first paint
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', flex: 1, background: '#020617', overflow: 'hidden' }}
    >
      {/* Centre logo + tagline — full-bleed overlay, flexbox-centred so it's immune to container width quirks */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/aaah-logo-white.png" alt="Abdulla Al Arif Holding" style={{ width: 200, opacity: 0.9 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <p style={{ color: '#ffffff', fontSize: 26, fontWeight: 600, marginTop: 14, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
          Building Foundations. Launching Futures.
        </p>
      </div>

      {hires.map((hire) => (
        <HireCard
          key={hire.id}
          hire={hire}
          register={register}
          isNew={!initialIdsRef.current!.has(hire.id)}
        />
      ))}
    </div>
  )
}
