'use client'

import { updateSession } from '@/lib/session'
import { t } from '@/lib/i18n'
import type { Language, Session, Track } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

const TRACKS: Track[] = [
  'Engineering',
  'Finance',
  'Architecture & Design',
  'Human Resources',
  'IT',
  'Legal & Compliance',
  'Marketing',
  'Operations & Supply Chain',
  'Project Management',
  'Sales & Business Development',
]

export function TrackSelectScreen({ session, language }: Props) {
  const strings = t(language)
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-white mb-6">{strings.chooseTrack}</h2>
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {TRACKS.map((track) => (
          <button
            key={track}
            onClick={() => updateSession(session.id, { track, state: 'question_active' })}
            className="bg-white/90 text-aaah-dark-teal font-semibold rounded-2xl px-4 py-4 text-sm text-center hover:bg-white active:scale-95 transition-all min-h-16"
          >
            {strings.trackName(track)}
          </button>
        ))}
      </div>
    </div>
  )
}
