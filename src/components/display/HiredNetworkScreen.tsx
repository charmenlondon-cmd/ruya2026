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
        @keyframes float {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(6px, -10px); }
          50%  { transform: translate(-4px, 8px); }
          75%  { transform: translate(8px, 4px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* AAAH logo centred, subtle */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}>
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
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#334155' }}>
          <p style={{ fontSize: 18 }}>No hires yet today</p>
        </div>
      )}

      {/* Hire nodes */}
      {hires.map((hire) => {
        const r1 = seedFromId(hire.id)
        const r2 = seedFromId(hire.id + '_y')

        const left = 10 + r1 * 80
        const top = 10 + r2 * 80
        const animDuration = `${25 + r1 * 20}s`
        const animDelay = `${-r2 * 30}s`

        return (
          <div
            key={hire.id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              animation: `float ${animDuration} ease-in-out infinite, fadeIn 0.6s ease-out`,
              animationDelay: `${animDelay}, 0s`,
            }}
          >
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
