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

  // Load questions when track/language are set
  useEffect(() => {
    if (!session.track || !session.language) return
    getQuestionsForTrack(session.track, session.language)
      .then(setQuestions)
      .catch((err: Error) => setLoadError(err.message))
  }, [session.track, session.language])

  // Reset answered flag when question changes
  useEffect(() => {
    setAnswered(false)
  }, [session.current_question])

  // Auto-advance from answer_submitted to next question or final result after 600ms
  useEffect(() => {
    if (session.state !== 'answer_submitted') return
    const timer = setTimeout(() => {
      if (session.current_question < 9) {
        updateSession(session.id, {
          current_question: session.current_question + 1,
          state: 'question_active',
        }).catch(console.error)
      } else {
        updateSession(session.id, { state: 'final_result' }).catch(console.error)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [session.state, session.id, session.current_question])

  // Loading state
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

  const question = questions[session.current_question]

  if (!question) {
    return <div className="text-white text-lg p-8">Question not found.</div>
  }

  function handleAnswer(answer: CorrectAnswer) {
    if (answered || session.state !== 'question_active') return
    setAnswered(true)
    const isCorrect = answer === question.correct_answer
    const newScore = session.score + (isCorrect ? 1 : 0)
    updateSession(session.id, {
      last_answer: answer,
      last_answer_correct: isCorrect,
      score: newScore,
      state: 'answer_submitted',
    }).catch(console.error)
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg gap-4">
      <StartOverButton session={session} language={language} />
      {/* Progress */}
      <p className="text-white text-sm font-semibold">
        {strings.questionOf(session.current_question + 1, 10)}
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
              <span className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-aaah-dark-teal text-white font-bold mr-3 flex-shrink-0">
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
