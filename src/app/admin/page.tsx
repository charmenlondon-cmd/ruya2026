'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { createSession, updateSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import type { Session } from '@/types/database'

function LanePanel({ lane, session, loading }: { lane: string; session: Session | null; loading: boolean }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label)
    setMessage(null)
    try {
      await fn()
      setMessage(`${label} — done`)
    } catch (err) {
      setMessage(`${label} — failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(null)
    }
  }

  async function handleNewSession() {
    await createSession(lane)
  }

  async function handleResetToIdle() {
    if (!session) return
    await updateSession(session.id, {
      state: 'idle',
      language: null,
      player_name: null,
      avatar_id: null,
      track: null,
      current_question: 0,
      score: 0,
      last_answer: null,
      last_answer_correct: null,
    })
  }

  async function handleScreensaver() {
    if (!session) return
    await updateSession(session.id, { state: 'screensaver' })
  }

  const btn = (label: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      disabled={busy !== null}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: '#0D5C6B',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: busy !== null ? 'not-allowed' : 'pointer',
        opacity: busy !== null ? 0.6 : 1,
      }}
    >
      {busy === label ? 'Working…' : label}
    </button>
  )

  return (
    <div style={{ flex: 1, minWidth: 280 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Lane {lane}</h2>
      <p style={{ fontSize: 12, color: '#475569', marginBottom: 20, fontFamily: 'monospace' }}>
        /controller?lane={lane} → /display?lane={lane}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {btn('New Session', () => run('New Session', handleNewSession))}
        {btn('Reset to Idle', () => run('Reset to Idle', handleResetToIdle))}
        {btn('Force Screensaver', () => run('Force Screensaver', handleScreensaver))}
      </div>

      {message && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: message.includes('failed') ? '#450a0a' : '#052e16',
          color: message.includes('failed') ? '#fca5a5' : '#86efac',
          fontSize: 13,
          marginBottom: 16,
        }}>
          {message}
        </div>
      )}

      <p style={{ fontSize: 11, color: '#7BBFC6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Live State</p>
      {loading ? (
        <p style={{ color: '#64748b', fontSize: 13 }}>Loading…</p>
      ) : session ? (
        <pre style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 8,
          padding: 16,
          fontSize: 11,
          color: '#94a3b8',
          overflowX: 'auto',
          lineHeight: 1.6,
        }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : (
        <p style={{ color: '#64748b', fontSize: 13 }}>No session. Use <strong>New Session</strong> to create one.</p>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { session: session1, loading: loading1 } = useSession('1')
  const { session: session2, loading: loading2 } = useSession('2')
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label)
    setMessage(null)
    try {
      await fn()
      setMessage(`${label} — done`)
    } catch (err) {
      setMessage(`${label} — failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(null)
    }
  }

  async function handleClearHires() {
    const { error } = await supabase.from('hires').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw new Error(error.message)
  }

  return (
    <main style={{ padding: '40px 48px', maxWidth: 1280, margin: '0 auto', fontFamily: 'Montserrat, sans-serif', color: '#fff' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Panel</h1>
      <p style={{ color: '#7BBFC6', marginBottom: 40, fontSize: 14 }}>Ruya Careers Fair 2026 — Staff Controls</p>

      {/* Per-lane controls */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#7BBFC6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Game Lanes</h2>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <LanePanel lane="1" session={session1} loading={loading1} />
          <div style={{ width: 1, background: '#1e293b', alignSelf: 'stretch', flexShrink: 0 }} />
          <LanePanel lane="2" session={session2} loading={loading2} />
        </div>
      </section>

      {/* Global hires controls */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#7BBFC6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Hires Network (shared across both lanes)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button
            onClick={() => run('Clear All Hires', handleClearHires)}
            disabled={busy !== null}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: busy !== null ? 'not-allowed' : 'pointer',
              opacity: busy !== null ? 0.6 : 1,
              minWidth: 200,
            }}
          >
            {busy === 'Clear All Hires' ? 'Working…' : 'Clear All Hires'}
          </button>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
          Removes all hire records — both displays will show an empty network. Cannot be undone.
        </p>
      </section>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: message.includes('failed') ? '#450a0a' : '#052e16',
          color: message.includes('failed') ? '#fca5a5' : '#86efac',
          fontSize: 14,
        }}>
          {message}
        </div>
      )}
    </main>
  )
}
