import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let _client: SupabaseClient<Database> | null = null

function getClient(): SupabaseClient<Database> {
  if (!_client) {
    _client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

// Proxy so all existing callers (supabase.from, supabase.channel, etc.) work unchanged.
// Client is only instantiated on first use — never during static prerendering at build time.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop: string) {
    return getClient()[prop as keyof SupabaseClient<Database>]
  },
})
