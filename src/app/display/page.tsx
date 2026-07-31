'use client'

import { useSession } from '@/hooks/useSession'
import { WaitingScreen } from '@/components/display/WaitingScreen'
import { QuestionScreen } from '@/components/display/QuestionScreen'
import type { Language } from '@/types/database'

export default function DisplayPage() {
  const { session, loading, error } = useSession()

  const language: Language = session?.language ?? 'en'
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir} className="min-h-[calc(100vh-56px)] flex flex-col">
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-16 h-16" />
        </div>
      )}

      {!loading && error && (
        <p className="text-white text-xl text-center p-8">Error: {error}</p>
      )}

      {!loading && !error && !session && (
        <p className="text-white text-xl text-center p-8">Waiting for session…</p>
      )}

      {!loading && !error && session && (() => {
        switch (session.state) {
          case 'language_select':
          case 'avatar_select':
          case 'name_entry':
          case 'track_select':
            return <WaitingScreen session={session} language={language} />

          case 'question_active':
          case 'answer_submitted':
          case 'question_result':
            return <QuestionScreen session={session} language={language} />

          case 'final_result':
            return (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-white text-5xl font-bold">The results are in…</p>
              </div>
            )

          case 'idle':
          case 'screensaver':
          default:
            return (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <h1 className="text-white text-6xl font-bold">Ruya Careers Fair 2026</h1>
                <p className="text-aaah-light-teal text-2xl">Pick up the iPad to start playing!</p>
              </div>
            )
        }
      })()}
    </div>
  )
}
