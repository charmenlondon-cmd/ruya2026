'use client'

import { updateSession } from '@/lib/session'
import { t } from '@/lib/i18n'
import type { Language, Session } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

/**
 * Subtle "Start Over" ghost button rendered in the top-right corner of every
 * controller screen (except idle/screensaver which IS the start).
 * Resets the session to idle and clears all player data so the next person
 * can start fresh — essential at a careers fair where strangers pick up the iPad.
 */
export function StartOverButton({ session, language }: Props) {
  const strings = t(language)

  function handleStartOver() {
    updateSession(session.id, {
      state: 'idle',
      language: null,
      player_name: null,
      avatar_id: null,
      track: null,
      current_question: 0,
      score: 0,
      last_answer: null,
      last_answer_correct: null,
    }).catch(console.error)
  }

  return (
    <button
      onClick={handleStartOver}
      className="absolute top-4 right-4 text-white/50 text-sm font-medium hover:text-white/80 active:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/20"
    >
      {strings.startOver}
    </button>
  )
}
