// Session CRUD — all state transitions go through updateSession
import { supabase } from '@/lib/supabase'
import type { Session, SessionState } from '@/types/database'
import type { Database } from '@/types/database'

type SessionUpdate = Database['public']['Tables']['sessions']['Update']

export async function getActiveSession(lane: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('lane', lane)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as Session
}

export async function createSession(lane: string): Promise<Session> {
  const insertPayload: Database['public']['Tables']['sessions']['Insert'] = {
    lane,
    state: 'idle' as SessionState,
    language: null,
    player_name: null,
    avatar_id: null,
    track: null,
    current_question: 0,
    score: 0,
    last_answer: null,
    last_answer_correct: null,
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert(insertPayload)
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create session')
  }

  return data as Session
}

export async function updateSession(id: string, patch: SessionUpdate): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update(patch as Database['public']['Tables']['sessions']['Update'])
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to update session')
  }

  return data as Session
}
