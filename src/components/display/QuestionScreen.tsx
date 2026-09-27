'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getQuestionsForTrack } from '@/lib/questions'
import { t } from '@/lib/i18n'
import { TrackAnimation, TrackCardDecoration } from '@/components/display/track-animations'
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

// Rendered twice: once invisible (reserves the ORIGINAL height in normal
// flow so nothing below it shifts), once visible+bigger as an absolute
// overlay on top. Keeps the bar's top edge fixed and the rest of the
// layout untouched while the bar itself grows ~50%.
function TopBarContent({ session, strings, big }: { session: Session; strings: ReturnType<typeof t>; big: boolean }) {
  return (
    <div
      className={`flex items-center justify-between bg-black/20 backdrop-blur-sm ${big ? 'px-12 py-[18px]' : 'px-8 py-3'}`}
    >
      <div className={`flex items-center ${big ? 'gap-[18px]' : 'gap-3'}`}>
        {session.avatar_id && (
          <Image
            src={`/avatars/${session.avatar_id}.png`}
            width={big ? 42 : 28}
            height={big ? 42 : 28}
            className="rounded-full"
            alt="Player avatar"
          />
        )}
        <span className={`font-bold text-white ${big ? 'text-3xl' : 'text-xl'}`}>{session.player_name}</span>
        {session.track && (
          <span className={`text-aaah-light-teal ${big ? 'text-2xl' : 'text-base'}`}>
            {strings.trackName(session.track)}
          </span>
        )}
      </div>
      <span className={`text-white font-semibold ${big ? 'text-2xl' : 'text-base'}`}>
        {strings.questionOf(session.current_question + 1, 10)}
      </span>
    </div>
  )
}

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
      {/* Top bar — invisible spacer keeps original height in flow, the
          visible bar overlays on top at 1.5x size without pushing content */}
      <div className="relative">
        <div className="invisible" aria-hidden="true">
          <TopBarContent session={session} strings={strings} big={false} />
        </div>
        <div className="absolute inset-x-0 top-0 z-20">
          <TopBarContent session={session} strings={strings} big={true} />
        </div>
      </div>

      {/* Main content — pt-40 clears every track's floating decoration
          (tallest, Operations, now pokes up ~132px after the 2026-09-27 resize) */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 pt-40 pb-6 relative">
        {/* Content column — TrackAnimation is scoped to THIS box (not the full
            screen width) so it always anchors beside the cards, not off in
            empty space on a screen much wider than the content. */}
        <div className="relative w-full max-w-4xl flex flex-col gap-5">
          {session.track && <TrackAnimation track={session.track} />}

          {/* Wrapper gives TrackCardDecoration a clean relative anchor above the card */}
          <div className="relative w-full z-10">
            {session.track && <TrackCardDecoration track={session.track} />}
            {/* Question card */}
            <div className="bg-white/90 rounded-3xl p-7 w-full">
              <p
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                lang={language}
                className="text-aaah-dark-teal text-2xl font-semibold text-center leading-relaxed"
              >
                {question.question_text}
              </p>
            </div>
          </div>

          {/* Answer options — always LTR visual order for A/B/C */}
          <div className="grid grid-cols-3 gap-4 w-full relative z-10" dir="ltr">
            {ANSWERS.map(({ key, textKey, imageKey }) => {
              const imageUrl = question[imageKey] as string | null
              const text = question[textKey] as string | null
              const isSelected = session.state === 'answer_submitted' && session.last_answer === key

              return (
                <div
                  key={key}
                  className={`rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                    isSelected
                      ? 'bg-aaah-light-teal/90 ring-4 ring-white scale-105'
                      : 'bg-white/80'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-aaah-dark-teal text-white text-lg font-bold flex items-center justify-center flex-shrink-0">
                    {key}
                  </div>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`Answer ${key}`}
                      width={220}
                      height={150}
                      className="object-contain rounded-xl w-full max-h-32"
                    />
                  ) : (
                    <p
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                      lang={language}
                      className={`text-aaah-dark-teal text-lg font-semibold w-full ${
                        language === 'ar' ? 'text-right' : 'text-center'
                      }`}
                    >
                      {text}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
