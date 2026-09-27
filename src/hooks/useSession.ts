'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getActiveSession } from '@/lib/session'
import type { Session } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseSessionResult {
  session: Session | null
  loading: boolean
  error: string | null
}

export function useSession(lane: string): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<Session | null>(null)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      try {
        const active = await getActiveSession(lane)
        setSession(active)
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
          if (sessionRef.current && incoming.id === sessionRef.current.id) {
            setSession(incoming)
          }
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
      getActiveSession(lane).then(setSession).catch(() => {})
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
