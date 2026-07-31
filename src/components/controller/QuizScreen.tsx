'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { updateSession } from '@/lib/session'
import { getQuestionsForTrack } from '@/lib/questions'
import { t } from '@/lib/i18n'
import { StartOverButton } from '@/components/controller/StartOverButton'
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

export function QuizScreen({ session, language }: Props) {
  const strings = t(language)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  // Optimistic local index so the question advances instantly without waiting for Realtime
  const [localIndex, setLocalIndex] = useState(session.current_question)

  // Keep localIndex in sync if Supabase diverges (e.g. session reset)
  useEffect(() => {
    setLocalIndex(session.current_question)
  }, [session.current_question])

  // Reset answered flag when question advances
  useEffect(() => {
    setAnswered(false)
  }, [localIndex])

  // Load questions when track/language are set
  useEffect(() => {
    if (!session.track || !session.language) return
    getQuestionsForTrack(session.track, session.language)
      .then(setQuestions)
      .catch((err: Error) => setLoadError(err.message))
  }, [session.track, session.language])

  if (questions.length === 0 && !loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm">Loading questions...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="text-red-300 text-lg p-8">
        Failed to load questions: {loadError}
      </div>
    )
  }

  const question = questions[localIndex]

  if (!question) {
    return <div className="text-white text-lg p-8">Question not found.</div>
  }

  function handleAnswer(answer: CorrectAnswer) {
    if (answered) return
    setAnswered(true)

    const isCorrect = answer === question.correct_answer
    const newScore = session.score + (isCorrect ? 1 : 0)
    const isLast = localIndex >= 9
    const nextIndex = isLast ? localIndex : localIndex + 1

    // Advance locally after 150ms (brief visual tap feedback) — no Realtime wait needed
    setTimeout(() => {
      if (!isLast) setLocalIndex(nextIndex)
    }, 150)

    // Single write: score + next question + final state all at once
    updateSession(session.id, {
      last_answer: answer,
      last_answer_correct: isCorrect,
      score: newScore,
      current_question: nextIndex,
      state: isLast ? 'final_result' : 'question_active',
    }).catch(console.error)
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg gap-4">
      <StartOverButton session={session} language={language} />
      {/* Progress */}
      <p className="text-white text-sm font-semibold">
        {strings.questionOf(localIndex + 1, 10)}
      </p>

      {/* Question card */}
      <div className="bg-white/90 rounded-2xl p-6 w-full">
        <p className="text-aaah-dark-teal text-xl font-semibold text-center">
          {question.question_text}
        </p>
      </div>

      {/* Answer buttons */}
      <div className="flex flex-col gap-3 w-full">
        {ANSWERS.map(({ key, textKey, imageKey }) => {
          const imageUrl = question[imageKey] as string | null
          const text = question[textKey] as string | null

          return (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={answered}
              className="bg-white/90 text-aaah-dark-teal rounded-2xl p-4 w-full text-left font-semibold hover:bg-white active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
            >
              <span className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-aaah-dark-teal text-white font-bold me-3 flex-shrink-0">
                {key}
              </span>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Answer ${key}`}
                  width={200}
                  height={144}
                  className="w-full max-h-36 object-contain rounded-xl"
                />
              ) : (
                <span>{text}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
