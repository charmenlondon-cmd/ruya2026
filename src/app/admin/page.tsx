'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { createSession, updateSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const { session, loading } = useSession()
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
    await createSession()
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

  async function handleClearHires() {
    const { error } = await supabase.from('hires').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw new Error(error.message)
  }

  const btn = (label: string, onClick: () => void, danger = false) => (
    <button
      key={label}
      onClick={onClick}
      disabled={busy !== null}
      style={{
        padding: '12px 24px',
        borderRadius: 8,
        border: 'none',
        background: danger ? '#dc2626' : '#0D5C6B',
        color: '#fff',
        fontSize: 15,
        fontWeight: 600,
        cursor: busy !== null ? 'not-allowed' : 'pointer',
        opacity: busy !== null ? 0.6 : 1,
        minWidth: 200,
      }}
    >
      {busy === label ? 'Working…' : label}
    </button>
  )

  return (
    <main style={{ padding: '40px 48px', maxWidth: 720, margin: '0 auto', fontFamily: 'Montserrat, sans-serif', color: '#fff' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Panel</h1>
      <p style={{ color: '#7BBFC6', marginBottom: 40, fontSize: 14 }}>Ruya Careers Fair 2026 — Staff Controls</p>

      {/* Session controls */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#7BBFC6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Session</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {btn('New Session', () => run('New Session', handleNewSession))}
          {btn('Reset to Idle', () => run('Reset to Idle', handleResetToIdle))}
          {btn('Force Screensaver', () => run('Force Screensaver', handleScreensaver))}
        </div>
      </section>

      {/* Hires controls */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#7BBFC6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Hires Network</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {btn('Clear All Hires', () => run('Clear All Hires', handleClearHires), true)}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>Removes all hire records — the network on the display will empty. Cannot be undone.</p>
      </section>

      {/* Feedback */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: message.includes('failed') ? '#450a0a' : '#052e16',
          color: message.includes('failed') ? '#fca5a5' : '#86efac',
          fontSize: 14,
          marginBottom: 32,
        }}>
          {message}
        </div>
      )}

      {/* Session state viewer */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#7BBFC6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Live Session State</h2>
        {loading ? (
          <p style={{ color: '#64748b', fontSize: 14 }}>Loading…</p>
        ) : session ? (
          <pre style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 8,
            padding: 20,
            fontSize: 12,
            color: '#94a3b8',
            overflowX: 'auto',
            lineHeight: 1.6,
          }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        ) : (
          <p style={{ color: '#64748b', fontSize: 14 }}>No active session. Use <strong>New Session</strong> to create one.</p>
        )}
      </section>
    </main>
  )
}
