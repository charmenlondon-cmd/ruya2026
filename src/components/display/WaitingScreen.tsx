'use client'

import Image from 'next/image'
import { t } from '@/lib/i18n'
import type { Language, Session } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

export function WaitingScreen({ session, language }: Props) {
  const strings = t(language)
  const hasAny = session.avatar_id || session.player_name || session.track

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 py-12">
      {!hasAny && (
        <h1 className="text-white text-6xl font-bold text-center">
          AAAH Careers Fair 2026
        </h1>
      )}

      <p className="text-aaah-light-teal text-2xl font-light tracking-widest uppercase animate-pulse">
        {strings.playerJoining}
      </p>

      {session.avatar_id && (
        <Image
          src={`/avatars/${session.avatar_id}.png`}
          width={160}
          height={160}
          className="rounded-full"
          alt="Player avatar"
        />
      )}

      {session.player_name && (
        <p className="text-6xl font-bold text-white text-center">
          {session.player_name}
        </p>
      )}

      {session.track && (
        <p className="text-3xl text-aaah-light-teal text-center">
          {strings.trackName(session.track)}
        </p>
      )}
    </div>
  )
}
