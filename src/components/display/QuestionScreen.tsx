'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getQuestionsForTrack } from '@/lib/questions'
import { t } from '@/lib/i18n'
import type { Language, Session, Question, CorrectAnswer } from '@/types/database'

interface Props {
  session: Session
  language: Language
}

type AnswerDef = {
  key: CorrectAnswer
  textKey: keyof Question
  imageKey: keyof Question
}

const ANSWERS: AnswerDef[] = [
  { key: 'A', textKey: 'answer_a_text', imageKey: 'answer_a_image_url' },
  { key: 'B', textKey: 'answer_b_text', imageKey: 'answer_b_image_url' },
  { key: 'C', textKey: 'answer_c_text', imageKey: 'answer_c_image_url' },
]

export function QuestionScreen({ session, language }: Props) {
  const strings = t(language)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!session.track || !session.language) return
    getQuestionsForTrack(session.track, session.language)
      .then(setQuestions)
      .catch((err: Error) => setLoadError(err.message))
  }, [session.track, session.language])

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-300 text-2xl text-center px-8">{loadError}</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-16 h-16" />
      </div>
    )
  }

  const question = questions[session.current_question]

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white text-2xl text-center px-8">Question not found.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {session.avatar_id && (
            <Image
              src={`/avatars/${session.avatar_id}.png`}
              width={32}
              height={32}
              className="rounded-full"
              alt="Player avatar"
            />
          )}
          <span className="text-2xl font-bold text-white">{session.player_name}</span>
          {session.track && (
            <span className="text-lg text-aaah-light-teal">
              {strings.trackName(session.track)}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-white text-lg font-semibold">
            {strings.questionOf(session.current_question + 1, 10)}
          </span>
          <span className="text-white text-lg">
            {strings.score(session.score, session.current_question)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-12 py-8">
        {/* Question card */}
        <div className="bg-white/90 rounded-3xl p-10 w-full max-w-5xl">
          <p className="text-aaah-dark-teal text-3xl font-semibold text-center leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Answer options — always LTR visual order for A/B/C */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl" dir="ltr">
          {ANSWERS.map(({ key, textKey, imageKey }) => {
            const imageUrl = question[imageKey] as string | null
            const text = question[textKey] as string | null

            return (
              <div
                key={key}
                className="bg-white/80 rounded-2xl p-6 flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-aaah-dark-teal text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
                  {key}
                </div>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`Answer ${key}`}
                    width={280}
                    height={200}
                    className="object-contain rounded-xl w-full max-h-48"
                  />
                ) : (
                  <p className="text-aaah-dark-teal text-xl font-semibold text-center">
                    {text}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
