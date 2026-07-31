'use client'

import type { CSSProperties } from 'react'
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

function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  }
  return Math.abs(h) / 2147483647
}

interface Props {
  hires: Hire[]
}

export default function HiredNetworkScreen({ hires }: Props) {
  return (
    <div style={{ position: 'relative', flex: 1, background: '#020617', overflow: 'hidden' }}>
      <style>{`
        @keyframes drift {
          0%   { transform: translate(calc(-50% + 0px),         calc(-50% + 0px)); }
          25%  { transform: translate(calc(-50% + var(--tx1)), calc(-50% + var(--ty1))); }
          50%  { transform: translate(calc(-50% + var(--tx2)), calc(-50% + var(--ty2))); }
          75%  { transform: translate(calc(-50% + var(--tx3)), calc(-50% + var(--ty3))); }
          100% { transform: translate(calc(-50% + 0px),         calc(-50% + 0px)); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* AAAH logo centred, subtle */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.12, zIndex: 0, pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/aaah-logo-white.png"
          alt=""
          style={{ width: 160 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      {/* Empty state */}
      {hires.length === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#475569' }}>
          <p style={{ fontSize: 18 }}>No hires yet today</p>
        </div>
      )}

      {/* Hire nodes */}
      {hires.map((hire) => {
        const r1 = seedFromId(hire.id)
        const r2 = seedFromId(hire.id + '_y')
        const r3 = seedFromId(hire.id + '_x2')
        const r4 = seedFromId(hire.id + '_y2')
        const r5 = seedFromId(hire.id + '_x3')
        const r6 = seedFromId(hire.id + '_y3')

        // Starting anchor spread across the screen
        const left = 15 + r1 * 70
        const top = 15 + r2 * 70

        // Drift waypoints: ±25vw horizontally, ±20vh vertically — crosses most of the screen
        const tx1 = `${(r3 - 0.5) * 50}vw`
        const ty1 = `${(r4 - 0.5) * 40}vh`
        const tx2 = `${(r5 - 0.5) * 50}vw`
        const ty2 = `${(r6 - 0.5) * 40}vh`
        const tx3 = `${(r1 - 0.5) * 50}vw`
        const ty3 = `${(r2 - 0.5) * 40}vh`

        // 45–75s per cycle; negative delay so all cards are already moving on mount
        const animDuration = `${45 + r1 * 30}s`
        const animDelay = `${-r2 * 60}s`

        const style = {
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          textAlign: 'center',
          animation: `drift ${animDuration} ease-in-out infinite, fadeIn 0.8s ease-out`,
          animationDelay: `${animDelay}, 0s`,
          '--tx1': tx1,
          '--ty1': ty1,
          '--tx2': tx2,
          '--ty2': ty2,
          '--tx3': tx3,
          '--ty3': ty3,
        } as CSSProperties & Record<string, string>

        return (
          <div key={hire.id} style={style}>
            {/* Avatar circle */}
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
            {/* Name */}
            <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, margin: '0 0 2px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {hire.player_name}
            </p>
            {/* Track */}
            <p style={{ color: TRACK_COLOR[hire.track] ?? '#94a3b8', fontSize: 11, margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {hire.track}
            </p>
          </div>
        )
      })}
    </div>
  )
}
