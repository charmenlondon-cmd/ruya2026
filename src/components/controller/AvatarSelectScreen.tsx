'use client'

import Image from 'next/image'
import { updateSession } from '@/lib/session'
import type { Session } from '@/types/database'

interface Props {
  session: Session
}

const FEMALE_AVATARS = [1, 2, 3, 4, 5].map((n) => `female-avatar-${n}`)
const MALE_AVATARS = [1, 2, 3, 4, 5].map((n) => `male-avatar-${n}`)
const ALL_AVATARS = [...FEMALE_AVATARS, ...MALE_AVATARS]

export function AvatarSelectScreen({ session }: Props) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6">Choose Your Avatar</h2>
      <div className="grid grid-cols-5 gap-4">
        {ALL_AVATARS.map((avatarId) => (
          <button
            key={avatarId}
            onClick={() => updateSession(session.id, { avatar_id: avatarId, state: 'name_entry' })}
            className="flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-all p-1 min-h-16"
          >
            <Image
              src={`/avatars/${avatarId}.png`}
              alt={avatarId.replace(/-/g, ' ')}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
