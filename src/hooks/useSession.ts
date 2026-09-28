'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getActiveSession } from '@/lib/session'
import type { Session } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseSessionResult {
  session: Session | null
  loading: boolean
  error: string | null
}

// Only accept an incoming row over the currently-held one if it's not stale.
// Both the Realtime subscription and the fallback poll below write into the
// same state, and network responses can arrive out of order — without this,
// a slow poll response can land after a newer Realtime update and silently
// regress the UI to an earlier state (e.g. final_result -> question_active
// -> final_result), which unmounts/remounts state-dependent screens like
// FinalResultScreen and re-runs their mount effects (e.g. double-writing a
// hire). A different session id (a genuinely new session row) always wins.
function applyIncoming(prev: Session | null, incoming: Session | null): Session | null {
  if (!incoming) return prev
  if (!prev || incoming.id !== prev.id) return incoming
  if (incoming.updated_at < prev.updated_at) return prev
  return incoming
}

export function useSession(lane: string): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      try {
        const active = await getActiveSession(lane)
        setSession((prev) => applyIncoming(prev, active))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session')
      } finally {
        setLoading(false)
      }

      const handleChange = (payload: RealtimePostgresChangesPayload<Session>) => {
        const incoming = payload.new as Session
        // Client-side guard: ignore events that belong to a different lane.
        // This backstops the server-side Realtime filter in case REPLICA IDENTITY
        // FULL is not set (without it, UPDATE events bypass the filter).
        if (incoming?.lane && incoming.lane !== lane) return

        if (payload.eventType === 'INSERT') {
          setSession(incoming)
        } else if (payload.eventType === 'UPDATE') {
          setSession((prev) => {
            if (!prev || incoming.id !== prev.id) return prev
            return applyIncoming(prev, incoming)
          })
        }
      }

      channel = supabase.channel(`game-session-${lane}`)
      channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessions', filter: `lane=eq.${lane}` },
          handleChange
        )
        .subscribe()
    }

    init()

    // Fallback poll — a display's Realtime WebSocket can silently go stale on
    // venue WiFi over a long-running session, in which case updates (e.g. an
    // admin action) don't arrive until the client eventually reconnects,
    // which can take up to a minute or more. Polling every 5s bounds the
    // worst case to a few seconds regardless of Realtime's connection state.
    const pollId = setInterval(() => {
      getActiveSession(lane)
        .then((fetched) => setSession((prev) => applyIncoming(prev, fetched)))
        .catch(() => {})
    }, 5000)

    return () => {
      clearInterval(pollId)
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [lane])

  return { session, loading, error }
}
