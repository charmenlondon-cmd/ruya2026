---
phase: 04-controller-ui
plan: 02
subsystem: ui
tags: [react, next.js, supabase, tailwind, quiz, gameplay]

# Dependency graph
requires:
  - phase: 04-01
    provides: controller page orchestrator and onboarding screens
  - phase: 03-02
    provides: getQuestionsForTrack question loader
  - phase: 02-01
    provides: updateSession, session state machine
provides:
  - QuizScreen component (question display, A/B/C answer buttons, auto-advance)
  - QuestionResultScreen component (correct/incorrect feedback, running score)
  - FinalResultScreen component (final score, hired/not-hired outcome, play again)
  - createHire() function writing to Supabase hires table
  - Full gameplay loop: question_active → answer_submitted → question_result → final_result → idle
affects: [05-display-screen, 06-hired-network]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useRef guard for one-shot side effects on mount (createHire)
    - useEffect with session.state dependency for timed auto-advance
    - answered boolean local state to prevent double-taps

key-files:
  created:
    - src/components/controller/QuizScreen.tsx
    - src/components/controller/QuestionResultScreen.tsx
    - src/components/controller/FinalResultScreen.tsx
    - src/lib/hires.ts
  modified:
    - src/app/controller/page.tsx

key-decisions:
  - "createHire called on FinalResultScreen mount with useRef(false) guard — prevents duplicate inserts on re-renders"
  - "answered local state disables buttons immediately on tap — prevents race conditions before Supabase response"
  - "Auto-advance answer_submitted → question_result via 1500ms setTimeout in useEffect — display screen gets time to show submitted state"

issues-created: []

# Metrics
duration: ~20min
completed: 2026-07-31
---

# Phase 4 Plan 02: Quiz Flow Summary

**Full gameplay loop: 10 A/B/C questions with per-question feedback, final score screen, and hire records written to Supabase for scores >=7**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-31
- **Completed:** 2026-07-31
- **Tasks:** 2/2
- **Files modified:** 5

## Accomplishments

- QuizScreen loads questions for selected track/language, renders question text and A/B/C buttons (image or text answers), tracks answered state locally, writes score/last_answer/state to Supabase on tap, auto-advances to question_result after 1500ms
- QuestionResultScreen shows correct/incorrect with coloured icon, running score, and Next Question / See Final Score button
- FinalResultScreen shows avatar, player name, final score, hired/not-hired outcome; calls createHire once via useRef guard; Play Again resets all session fields to idle
- hires.ts createHire() function inserts session_id, player_name, avatar_id, track, score to Supabase hires table

## Task Commits

1. **Task 1: QuizScreen — question display and answer submission** - `6e788cc` (feat)
2. **Task 2: Result screens and hire logic** - `2b4ebb0` (feat)

## Files Created/Modified

- `src/components/controller/QuizScreen.tsx` - Question display, A/B/C answer buttons, auto-advance timer
- `src/components/controller/QuestionResultScreen.tsx` - Per-question correct/incorrect feedback and next button
- `src/components/controller/FinalResultScreen.tsx` - Final score, hired outcome, play again reset
- `src/lib/hires.ts` - createHire() writes to Supabase hires table
- `src/app/controller/page.tsx` - Added QuizScreen/QuestionResultScreen/FinalResultScreen routes

## Decisions Made

- **useRef(false) guard for createHire** — prevents duplicate inserts when React strict mode double-fires effects or component re-mounts
- **`answered` local state** — disables buttons immediately on tap so user cannot tap twice before Supabase responds; reset on current_question change for each new question
- **1500ms auto-advance** — gives display screen time to reflect answer_submitted state before moving on

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Full controller gameplay loop complete: onboarding → 10 questions → per-question results → final screen → play again
- TypeScript clean, build passes
- Ready for Plan 04-03: Arabic RTL layout across all controller screens

---
*Phase: 04-controller-ui*
*Completed: 2026-07-31*
