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

export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<Session | null>(null)

  // Keep ref in sync with state to avoid stale closures in realtime handler
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      try {
        const active = await getActiveSession()
        setSession(active)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session')
      } finally {
        setLoading(false)
      }

      const handleChange = (payload: RealtimePostgresChangesPayload<Session>) => {
        if (payload.eventType === 'INSERT') {
          setSession(payload.new as Session)
        } else if (payload.eventType === 'UPDATE') {
          if (sessionRef.current && (payload.new as Session).id === sessionRef.current.id) {
            setSession(payload.new as Session)
          }
        }
      }

      channel = supabase.channel('game-session')
      channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessions' },
          handleChange
        )
        .subscribe()
    }

    init()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return { session, loading, error }
}
