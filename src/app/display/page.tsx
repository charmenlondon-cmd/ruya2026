'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { useHires } from '@/hooks/useHires'
import { useDisplayScale } from '@/hooks/useDisplayScale'
import { useAutoReloadOnNewDeploy } from '@/hooks/useAutoReloadOnNewDeploy'
import { FullscreenButton } from '@/components/display/FullscreenButton'
import { WaitingScreen } from '@/components/display/WaitingScreen'
import { QuestionScreen } from '@/components/display/QuestionScreen'
import { FinalResultScreen } from '@/components/display/FinalResultScreen'
import { ScreensaverScreen } from '@/components/display/ScreensaverScreen'
import HiredNetworkScreen from '@/components/display/HiredNetworkScreen'
import type { Language } from '@/types/database'

function DisplayInner() {
  useAutoReloadOnNewDeploy()

  const searchParams = useSearchParams()
  const lane = searchParams.get('lane') ?? '1'

  // Some venue displays (TVs, esp. cheap ones) apply overscan/zoom that crops
  // the edges of the signal instead of showing the full frame. We can't fix
  // that from the browser, so instead we render everything a bit smaller and
  // centred, inside a "TV-safe" margin, so the crop always lands on empty
  // background instead of on real content. Staff can tune this live from the
  // admin panel per lane; ?scale=0.85 (etc.) is a manual one-off override.
  const scaleParam = Number(searchParams.get('scale'))
  const urlScale = scaleParam > 0 && scaleParam <= 1 ? scaleParam : null
  const tvSafeScale = useDisplayScale(lane, urlScale)

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

  // 'screensaver' is a state the admin panel's "Force Screensaver" button sets
  // deliberately (normal gameplay only ever rests at 'idle') — it means "show
  // the network animation right now", not "start the same 60s countdown as a
  // natural pause between players". showHiredNetwork still governs the
  // natural idle->network transition.
  const showNetworkNow = showHiredNetwork || session?.state === 'screensaver'

  // The hired-network/screensaver screens are ambient background visuals with
  // no buttons or fine print to protect — unlike the quiz screens, there's no
  // downside to letting them fill the true screen edge-to-edge (even if a
  // bouncing avatar clips slightly), and they look broken shrunk down inside
  // the TV-safe margin. So they render outside the scaled wrapper, at 100%.
  const isAmbientScreen = !loading && !error && (!session || session.state === 'idle' || session.state === 'screensaver')

  const content = (() => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-16 h-16" />
        </div>
      )
    }

    if (error) {
      return <p className="text-white text-xl text-center p-8">Error: {error}</p>
    }

    if (!session) {
      return showNetworkNow
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
        return showNetworkNow
          ? <HiredNetworkScreen hires={hires} />
          : <ScreensaverScreen />
    }
  })()

  return (
    <div className="fixed inset-0 overflow-hidden bg-aaah-near-black">
      <FullscreenButton />
      <div
        dir={dir}
        className="h-screen w-screen overflow-hidden flex flex-col"
        style={
          isAmbientScreen
            ? undefined
            : { transform: `scale(${tvSafeScale})`, transformOrigin: 'top center' }
        }
      >
        {content}
      </div>
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
