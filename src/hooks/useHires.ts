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
  }, [])

  return hires
}
