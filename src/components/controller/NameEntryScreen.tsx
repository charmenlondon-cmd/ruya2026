'use client'

import { useState } from 'react'
import { updateSession } from '@/lib/session'
import type { Session } from '@/types/database'

interface Props {
  session: Session
}

export function NameEntryScreen({ session }: Props) {
  const [name, setName] = useState('')

  const disabled = name.trim() === ''

  function handleSubmit() {
    if (disabled) return
    updateSession(session.id, { player_name: name.trim(), state: 'track_select' })
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Enter Your Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
        }}
        placeholder="Your name"
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
        Continue
      </button>
    </div>
  )
}
