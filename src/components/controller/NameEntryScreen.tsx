'use client'

import { useState } from 'react'
import { updateSession } from '@/lib/session'
import { t } from '@/lib/i18n'
import type { Language, Session } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

export function NameEntryScreen({ session, language }: Props) {
  const [name, setName] = useState('')
  const strings = t(language)

  const disabled = name.trim() === ''

  function handleSubmit() {
    if (disabled) return
    updateSession(session.id, { player_name: name.trim(), state: 'track_select' })
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-white mb-6">{strings.enterName}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
        }}
        placeholder={strings.namePlaceholder}
        autoFocus
        autoComplete="off"
        className="bg-white rounded-xl border-none p-4 text-xl text-aaah-dark-teal w-full max-w-sm mb-6 outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={`bg-white text-aaah-dark-teal font-semibold rounded-2xl px-12 py-6 text-xl active:scale-95 transition-all min-h-16 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-aaah-light-teal/20'
        }`}
      >
        {strings.continue}
      </button>
    </div>
  )
}
