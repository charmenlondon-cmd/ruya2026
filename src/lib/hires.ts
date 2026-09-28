import { supabase } from '@/lib/supabase'
import type { Session } from '@/types/database'

export async function createHire(session: Session): Promise<void> {
  // Guard: skip only if this exact game's hire was already written.
  // session_id alone is NOT unique per game — a lane's session row is reused
  // across every game played on it, so matching on session_id alone would
  // block every hire after the first one on that lane.
  const { data: existing } = await supabase
    .from('hires')
    .select('id')
    .eq('session_id', session.id)
    .eq('player_name', session.player_name!)
    .eq('avatar_id', session.avatar_id!)
    .eq('track', session.track!)
    .eq('score', session.score)
    .maybeSingle()

  if (existing) return

  const { error } = await supabase.from('hires').insert({
    session_id: session.id,
    player_name: session.player_name!,
    avatar_id: session.avatar_id!,
    track: session.track!,
    score: session.score,
  })
  if (error) throw new Error(`Failed to create hire: ${error.message}`)
}
