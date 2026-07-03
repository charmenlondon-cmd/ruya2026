'use client'

import { useState, useEffect } from 'react'
import { createSession, updateSession } from '@/lib/session'
import { useSession } from '@/hooks/useSession'
import type { SessionState } from '@/types/database'

const STATE_ORDER: SessionState[] = [
  'idle',
  'language_select',
  'avatar_select',
  'name_entry',
  'track_select',
  'question_active',
  'answer_submitted',
  'question_result',
  'final_result',
  'screensaver',
]

export default function ControllerPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { session, loading, error } = useSession()

  useEffect(() => {
    createSession().then((s) => {
      setSessionId(s.id)
    })
  }, [])

  async function handleNextState() {
    if (!session) return
    const current = STATE_ORDER.indexOf(session.state)
    const next = STATE_ORDER[(current + 1) % STATE_ORDER.length]
    await updateSession(session.id, { state: next })
  }

  return (
    <div className="p-8 font-mono">
      {loading && <p>Loading session...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && session && (
        <>
          <div className="text-4xl font-bold mb-4">{session.state}</div>
          <div className="text-sm text-gray-400 mb-6">Session ID: {session.id}</div>
          <button
            onClick={handleNextState}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 active:bg-gray-900"
          >
            Next State →
          </button>
        </>
      )}
      {!loading && !session && !error && (
        <p>Creating session{sessionId ? ` (${sessionId})` : ''}...</p>
      )}
    </div>
  )
}
