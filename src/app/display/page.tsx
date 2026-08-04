'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { useHires } from '@/hooks/useHires'
import { WaitingScreen } from '@/components/display/WaitingScreen'
import { QuestionScreen } from '@/components/display/QuestionScreen'
import { FinalResultScreen } from '@/components/display/FinalResultScreen'
import { ScreensaverScreen } from '@/components/display/ScreensaverScreen'
import HiredNetworkScreen from '@/components/display/HiredNetworkScreen'
import type { Language } from '@/types/database'

function DisplayInner() {
  const searchParams = useSearchParams()
  const lane = searchParams.get('lane') ?? '1'

  const { session, loading, error } = useSession(lane)
  const hires = useHires()
  const [showHiredNetwork, setShowHiredNetwork] = useState(false)

  useEffect(() => {
    if (!session || session.state === 'idle' || session.state === 'screensaver') {
      const timer = setTimeout(() => setShowHiredNetwork(true), 60_000)
      return () => clearTimeout(timer)
    } else {
      setShowHiredNetwork(false)
    }
  }, [session?.state])

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

      {!loading && !error && (() => {
        if (!session) {
          return showHiredNetwork
            ? <HiredNetworkScreen hires={hires} />
            : <ScreensaverScreen />
        }

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
            return <FinalResultScreen session={session} language={language} />

          case 'idle':
          case 'screensaver':
          default:
            return showHiredNetwork
              ? <HiredNetworkScreen hires={hires} />
              : <ScreensaverScreen />
        }
      })()}
    </div>
  )
}

export default function DisplayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-16 h-16" />
      </div>
    }>
      <DisplayInner />
    </Suspense>
  )
}
