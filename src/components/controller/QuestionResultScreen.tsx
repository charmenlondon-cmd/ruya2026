'use client'

import { updateSession } from '@/lib/session'
import type { Session } from '@/types/database'

interface Props {
  session: Session
}

export function QuestionResultScreen({ session }: Props) {
  const isCorrect = session.last_answer_correct
  const questionsAnswered = session.current_question + 1

  function handleNext() {
    if (session.current_question < 9) {
      updateSession(session.id, {
        current_question: session.current_question + 1,
        state: 'question_active',
      }).catch(console.error)
    } else {
      updateSession(session.id, { state: 'final_result' }).catch(console.error)
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg gap-6">
      {/* Result card */}
      <div className="bg-white/90 rounded-2xl p-8 w-full flex flex-col items-center gap-4">
        {/* Correct/Incorrect icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isCorrect ? '✓' : '✗'}
        </div>

        {/* Result heading */}
        <h2
          className={`text-2xl font-bold ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>

        {/* Running score */}
        <p className="text-aaah-dark-teal text-lg font-semibold">
          Score: {session.score} / {questionsAnswered}
        </p>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="bg-white text-aaah-dark-teal font-semibold rounded-2xl px-10 py-5 text-lg hover:bg-white/90 active:scale-95 transition-all min-h-16"
      >
        {session.current_question < 9 ? 'Next Question →' : 'See Final Score →'}
      </button>
    </div>
  )
}
