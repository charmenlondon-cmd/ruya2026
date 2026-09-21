'use client'

import { useState, useEffect, useRef } from 'react'
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
  // Per-question correctness — needed to adjust score correctly when going back and re-answering
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Record<number, boolean>>({})
  // Generation counter: incrementing this invalidates any in-flight advance timers
  const genRef = useRef(0)

  // Keep localIndex in sync if Supabase diverges (e.g. session reset)
  useEffect(() => {
    setLocalIndex(session.current_question)
  }, [session.current_question])

  // Reset answered flag when question index changes
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
    const isLast = localIndex >= 9
    const nextIndex = isLast ? localIndex : localIndex + 1

    // If this question was previously answered (player went back and is re-answering),
    // subtract the old contribution before adding the new one
    const prevCorrect = answeredCorrectly[localIndex]
    const scoreDelta = (isCorrect ? 1 : 0) - (prevCorrect !== undefined ? (prevCorrect ? 1 : 0) : 0)
    const newScore = session.score + scoreDelta

    setAnsweredCorrectly(prev => ({ ...prev, [localIndex]: isCorrect }))

    // Tag this sequence so handleBack can cancel it if pressed before it completes
    const gen = ++genRef.current

    // Advance local display immediately for instant tap feedback
    setTimeout(() => {
      if (genRef.current !== gen) return
      if (!isLast) setLocalIndex(nextIndex)
    }, 150)

    // Write 1: mark answer_submitted so the display can briefly highlight the selection
    updateSession(session.id, {
      last_answer: answer,
      last_answer_correct: isCorrect,
      score: newScore,
      state: 'answer_submitted',
    }).then(() => {
      // Write 2: advance display to next question after 1200ms
      setTimeout(() => {
        if (genRef.current !== gen) return
        updateSession(session.id, {
          current_question: nextIndex,
          state: isLast ? 'final_result' : 'question_active',
        }).catch(console.error)
      }, 1200)
    }).catch(console.error)
  }

  function handleBack() {
    const prevIndex = localIndex - 1
    if (prevIndex < 0 || answered) return

    // Invalidate any in-flight advance timers from the previous answer
    genRef.current++

    // Undo the previous question's score contribution so the player can re-answer cleanly.
    // Delete it from answeredCorrectly so handleAnswer treats it as a fresh first answer.
    const wasCorrect = answeredCorrectly[prevIndex]
    const scoreAdjust = wasCorrect === true ? -1 : 0

    setAnsweredCorrectly(prev => {
      const next = { ...prev }
      delete next[prevIndex]
      return next
    })

    setLocalIndex(prevIndex)
    setAnswered(false)

    updateSession(session.id, {
      score: session.score + scoreAdjust,
      current_question: prevIndex,
      state: 'question_active',
      last_answer: null,
      last_answer_correct: null,
    }).catch(console.error)
  }

  const canGoBack = localIndex > 0 && !answered

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg gap-4">
      <StartOverButton session={session} language={language} />

      {/* Progress row — spacer left keeps counter centred, Back sits on the right */}
      <div className="flex items-center w-full">
        <div className="flex-1" />
        <p className="text-white text-sm font-semibold">
          {strings.questionOf(localIndex + 1, 10)}
        </p>
        <div className="flex-1 flex justify-end">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="text-white/50 text-sm font-medium hover:text-white/80 active:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/20"
            >
              {strings.back}
            </button>
          )}
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white/90 rounded-2xl p-6 w-full">
        <p
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          lang={language}
          className="text-aaah-dark-teal text-xl font-semibold text-center"
        >
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
              className="bg-white/90 text-aaah-dark-teal rounded-2xl p-4 w-full font-semibold hover:bg-white active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
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
                <span
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  lang={language}
                  className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {text}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
