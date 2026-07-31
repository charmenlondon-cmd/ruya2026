'use client'

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

interface Props {
  hires: Hire[]
}

export default function HiredNetworkScreen({ hires }: Props) {
  const keyframes = hires.map((hire) => {
    const sid = hire.id.replace(/-/g, '_')
    // Each waypoint: random direction, large travel — ±45vw horizontal, ±40vh vertical
    const tx = (n: number) => `${((seed(hire.id, n) - 0.5) * 90).toFixed(1)}vw`
    const ty = (n: number) => `${((seed(hire.id, n + 10) - 0.5) * 80).toFixed(1)}vh`
    return `
      @keyframes drift_${sid} {
        0%   { transform: translate(0,       0); }
        16%  { transform: translate(${tx(1)}, ${ty(1)}); }
        33%  { transform: translate(${tx(2)}, ${ty(2)}); }
        50%  { transform: translate(${tx(3)}, ${ty(3)}); }
        66%  { transform: translate(${tx(4)}, ${ty(4)}); }
        83%  { transform: translate(${tx(5)}, ${ty(5)}); }
        100% { transform: translate(0,       0); }
      }`
  }).join('\n')

  return (
    <div style={{ position: 'relative', flex: 1, background: '#020617', overflow: 'hidden' }}>
      <style>{`
        ${keyframes}
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* AAAH logo — centred, faint backdrop */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.12, pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/aaah-logo-white.png" alt="" style={{ width: 160 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>

      {hires.length === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', color: '#475569' }}>
          <p style={{ fontSize: 18 }}>No hires yet today</p>
        </div>
      )}

      {hires.map((hire) => {
        const sid = hire.id.replace(/-/g, '_')
        const r1 = seed(hire.id, 0)
        const r2 = seed(hire.id, 20)

        // Anchor: spread across screen, kept away from edges so cards start visible
        const left = 15 + r1 * 70
        const top  = 15 + r2 * 70

        // Slow enough to feel dreamy; negative delay = already in motion on mount
        const dur   = (45 + r1 * 35).toFixed(0)
        const delay = (-(r2 * 70)).toFixed(0)

        return (
          // Outer div: absolute anchor + centering — static transform, no animation conflict
          <div
            key={hire.id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
              animation: 'fadeIn 0.8s ease-out',
            }}
          >
            {/* Inner div: drift animation only — transform is entirely the animation's domain */}
            <div style={{
              textAlign: 'center',
              animation: `drift_${sid} ${dur}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: `3px solid ${TRACK_COLOR[hire.track] ?? '#ffffff'}`,
                overflow: 'hidden',
                margin: '0 auto 6px',
                background: TRACK_COLOR[hire.track] ?? '#334155',
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
              <p style={{ color: TRACK_COLOR[hire.track] ?? '#94a3b8', fontSize: 11, margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {hire.track}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
