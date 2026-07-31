'use client'

import { updateSession } from '@/lib/session'
import type { Session } from '@/types/database'

interface Props {
  session: Session
}

export function LanguageSelectScreen({ session }: Props) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">Select Language</h2>
      <div className="flex gap-6">
        <button
          onClick={() => updateSession(session.id, { language: 'en', state: 'avatar_select' })}
          className="bg-white text-aaah-dark-teal font-semibold rounded-2xl px-12 py-6 text-xl hover:bg-aaah-light-teal/20 active:scale-95 transition-all min-h-16"
        >
          English
        </button>
        <button
          onClick={() => updateSession(session.id, { language: 'ar', state: 'avatar_select' })}
          className="bg-white text-aaah-dark-teal font-semibold rounded-2xl px-12 py-6 text-xl hover:bg-aaah-light-teal/20 active:scale-95 transition-all min-h-16"
        >
          العربية
        </button>
      </div>
    </div>
  )
}
