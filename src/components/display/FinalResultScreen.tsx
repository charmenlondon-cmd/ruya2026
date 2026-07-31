'use client'

import Image from 'next/image'
import { t } from '@/lib/i18n'
import type { Language, Session } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

export function FinalResultScreen({ session, language }: Props) {
  const isHired = session.score >= 7
  const strings = t(language)

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-12 py-8">
      {/* Avatar with optional ping ring */}
      <div className="relative">
        {isHired && (
          <div className="absolute inset-0 rounded-full border-8 border-green-400 animate-ping opacity-20" />
        )}
        {session.avatar_id && (
          <Image
            src={`/avatars/${session.avatar_id}.png`}
            alt={session.player_name ?? 'Player'}
            width={200}
            height={200}
            className={`rounded-full border-8 shadow-2xl ${
              isHired ? 'border-green-400' : 'border-aaah-light-teal'
            }`}
          />
        )}
      </div>

      {/* Player name */}
      <p className="text-7xl font-bold text-white text-center">
        {session.player_name}
      </p>

      {/* Track */}
      {session.track && (
        <p className="text-3xl text-aaah-light-teal text-center">
          {strings.trackName(session.track)}
        </p>
      )}

      {/* Score */}
      <p
        className={`text-8xl font-bold ${
          isHired ? 'text-green-400' : 'text-aaah-light-teal'
        }`}
      >
        {strings.finalScore(session.score)}
      </p>

      {/* Outcome heading */}
      <h2
        className={`text-5xl font-bold text-center ${
          isHired ? 'text-green-300' : 'text-white'
        }`}
      >
        {isHired ? strings.youreHired : strings.wellGetBack}
      </h2>

      {/* Sub-message */}
      <p className="text-2xl text-white/80 text-center max-w-2xl">
        {isHired ? strings.hiredMessage : strings.getBackMessage}
      </p>
    </div>
  )
}
