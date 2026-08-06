'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSession, updateSession } from '@/lib/session'
import { useSession } from '@/hooks/useSession'
import { t } from '@/lib/i18n'
import { LanguageSelectScreen } from '@/components/controller/LanguageSelectScreen'
import { AvatarSelectScreen } from '@/components/controller/AvatarSelectScreen'
import { NameEntryScreen } from '@/components/controller/NameEntryScreen'
import { TrackSelectScreen } from '@/components/controller/TrackSelectScreen'
import { QuizScreen } from '@/components/controller/QuizScreen'
import { FinalResultScreen } from '@/components/controller/FinalResultScreen'
import type { Language, Session } from '@/types/database'

function IdleScreen({ session }: { session: Session }) {
  const lang: Language = session.language ?? 'en'
  const strings = t(lang)
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-4xl font-bold text-white/70">Explore your skills.</p>
      <button
        onClick={() => updateSession(session.id, { state: 'language_select' })}
        className="bg-aaah-light-teal text-white font-normal rounded-2xl px-12 py-6 text-xl hover:bg-aaah-dark-teal active:scale-95 transition-all min-h-16"
      >
        {strings.tapToStart}
      </button>
    </div>
  )
}

function ControllerInner() {
  const searchParams = useSearchParams()
  const lane = searchParams.get('lane') ?? '1'

  const [creatingSession, setCreatingSession] = useState(false)
  const { session, loading, error } = useSession(lane)

  if (!loading && session === null && !creatingSession && !error) {
    setCreatingSession(true)
    createSession(lane).catch(console.error)
  }

  const language: Language = session?.language ?? 'en'
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir} className="min-h-screen flex flex-col items-center justify-center p-6">
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      )}

      {!loading && error && (
        <p className="text-red-300 text-lg">Error: {error}</p>
      )}

      {!loading && !error && session && (() => {
        switch (session.state) {
          case 'idle':
          case 'screensaver':
            return <IdleScreen session={session} />
          case 'language_select':
            return <LanguageSelectScreen session={session} language={language} />
          case 'avatar_select':
            return <AvatarSelectScreen session={session} language={language} />
          case 'name_entry':
            return <NameEntryScreen session={session} language={language} />
          case 'track_select':
            return <TrackSelectScreen session={session} language={language} />
          case 'question_active':
          case 'answer_submitted':
            return <QuizScreen session={session} language={language} />
          case 'final_result':
            return <FinalResultScreen session={session} language={language} />
          default:
            return null
        }
      })()}
    </div>
  )
}

export default function ControllerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    }>
      <ControllerInner />
    </Suspense>
  )
}
