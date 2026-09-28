'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Hire } from '@/types/database'

export function useHires(): Hire[] {
  const [hires, setHires] = useState<Hire[]>([])

  useEffect(() => {
    supabase
      .from('hires')
      .select('*')
      .order('hired_at', { ascending: true })
      .then(({ data }) => {
        setHires(data ?? [])
      })

    const channel = supabase
      .channel('hires-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hires' },
        (payload) => {
          const incoming = payload.new as Hire
          setHires((prev) => {
            // id is the only field that's actually unique per hire — a lane's
            // session_id is reused across every game on that lane, and
            // player_name+track can coincidentally repeat, so matching on
            // either would wrongly drop distinct players from the feed.
            const duplicate = prev.some(h => h.id === incoming.id)
            return duplicate ? prev : [...prev, incoming]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return hires
}
