'use client'

import { useState } from 'react'
import { createSession, updateSession } from '@/lib/session'
import { useSession } from '@/hooks/useSession'
import { LanguageSelectScreen } from '@/components/controller/LanguageSelectScreen'
import { AvatarSelectScreen } from '@/components/controller/AvatarSelectScreen'
import { NameEntryScreen } from '@/components/controller/NameEntryScreen'
import { TrackSelectScreen } from '@/components/controller/TrackSelectScreen'
import { QuizScreen } from '@/components/controller/QuizScreen'
import { QuestionResultScreen } from '@/components/controller/QuestionResultScreen'
import { FinalResultScreen } from '@/components/controller/FinalResultScreen'
import type { Session } from '@/types/database'

function IdleScreen({ session }: { session: Session }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-white">Tap to Start</h1>
      <button
        onClick={() => updateSession(session.id, { state: 'language_select' })}
        className="bg-aaah-light-teal text-white font-semibold rounded-2xl px-12 py-6 text-xl hover:bg-aaah-dark-teal active:scale-95 transition-all min-h-16"
      >
        Start
      </button>
    </div>
  )
}

export default function ControllerPage() {
  const [creatingSession, setCreatingSession] = useState(false)
  const { session, loading, error } = useSession()

  // Create session once when there is none
  if (!loading && session === null && !creatingSession && !error) {
    setCreatingSession(true)
    createSession().catch(console.error)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
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
            return <LanguageSelectScreen session={session} />
          case 'avatar_select':
            return <AvatarSelectScreen session={session} />
          case 'name_entry':
            return <NameEntryScreen session={session} />
          case 'track_select':
            return <TrackSelectScreen session={session} />
          case 'question_active':
          case 'answer_submitted':
            return <QuizScreen session={session} />
          case 'question_result':
            return <QuestionResultScreen session={session} />
          case 'final_result':
            return <FinalResultScreen session={session} />
          default:
            return null
        }
      })()}
    </div>
  )
}
