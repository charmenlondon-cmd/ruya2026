'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { updateSession } from '@/lib/session'
import { createHire } from '@/lib/hires'
import type { Session } from '@/types/database'

interface Props {
  session: Session
}

export function FinalResultScreen({ session }: Props) {
  const hireCreatedRef = useRef(false)
  const isHired = session.score >= 7

  // Write hire record once on mount for passing scores
  useEffect(() => {
    if (!isHired || hireCreatedRef.current) return
    hireCreatedRef.current = true
    createHire(session).catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlayAgain() {
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
    <div className="flex flex-col items-center w-full max-w-lg gap-6">
      {/* Result card */}
      <div className="bg-white/90 rounded-2xl p-8 w-full flex flex-col items-center gap-4">
        {/* Avatar */}
        {session.avatar_id && (
          <Image
            src={`/avatars/${session.avatar_id}.png`}
            alt={session.player_name ?? 'Player'}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}

        {/* Player name */}
        <p className="text-aaah-dark-teal text-2xl font-bold">
          {session.player_name}
        </p>

        {/* Final score */}
        <p
          className={`text-6xl font-bold ${
            isHired ? 'text-green-500' : 'text-aaah-dark-teal'
          }`}
        >
          {session.score} / 10
        </p>

        {/* Outcome */}
        {isHired ? (
          <>
            <h2 className="text-3xl font-bold text-green-600">
              You&apos;re Hired! 🎉
            </h2>
            <p className="text-aaah-dark-teal text-lg text-center">
              Congratulations! You&apos;re the perfect fit for AAAH.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-aaah-dark-teal">
              We&apos;ll Get Back to You
            </h2>
            <p className="text-aaah-dark-teal text-lg text-center">
              Great effort! Keep developing your skills.
            </p>
          </>
        )}
      </div>

      {/* Play Again */}
      <button
        onClick={handlePlayAgain}
        className="bg-white text-aaah-dark-teal font-semibold rounded-2xl px-10 py-5 text-lg hover:bg-white/90 active:scale-95 transition-all min-h-16"
      >
        Play Again
      </button>
    </div>
  )
}
