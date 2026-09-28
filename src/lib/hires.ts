import { supabase } from '@/lib/supabase'
import type { Session } from '@/types/database'

export async function createHire(session: Session): Promise<void> {
  // Atomic insert-or-skip via the DB's own unique constraint
  // (hires_unique_game: session_id, player_name, avatar_id, track, score) —
  // enforced by Postgres itself, so it can't be raced no matter how many
  // devices/tabs try to write the same game's result at once. A prior
  // check-then-insert guard here was inherently racy: two concurrent callers
  // could both pass the "does it exist" check before either finished
  // inserting, producing duplicate rows (confirmed live, multiple times).
  const { error } = await supabase.from('hires').upsert(
    {
      session_id: session.id,
      player_name: session.player_name!,
      avatar_id: session.avatar_id!,
      track: session.track!,
      score: session.score,
    },
    { onConflict: 'session_id,player_name,avatar_id,track,score', ignoreDuplicates: true }
  )
  if (error) throw new Error(`Failed to create hire: ${error.message}`)
}
