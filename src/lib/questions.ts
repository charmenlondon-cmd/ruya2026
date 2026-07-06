import { supabase } from '@/lib/supabase'
import type { Question, Track, Language } from '@/types/database'

export async function getQuestionsForTrack(
  track: Track,
  language: Language
): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('track', track)
    .eq('language', language)
    .order('question_no', { ascending: true })

  if (error) {
    throw new Error(`Failed to load questions for ${track} (${language}): ${error.message}`)
  }

  return (data ?? []) as Question[]
}
