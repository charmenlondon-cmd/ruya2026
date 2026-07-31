import { supabase } from '@/lib/supabase'
import type { Session } from '@/types/database'

export async function createHire(session: Session): Promise<void> {
  const { error } = await supabase.from('hires').insert({
    session_id: session.id,
    player_name: session.player_name!,
    avatar_id: session.avatar_id!,
    track: session.track!,
    score: session.score,
  })
  if (error) throw new Error(`Failed to create hire: ${error.message}`)
}
