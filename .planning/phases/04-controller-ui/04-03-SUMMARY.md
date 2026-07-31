---
phase: 04-controller-ui
plan: 03
subsystem: ui
tags: [react, next.js, i18n, rtl, arabic, tailwind]

# Dependency graph
requires:
  - phase: 04-02
    provides: QuizScreen, QuestionResultScreen, FinalResultScreen, full gameplay loop
  - phase: 04-01
    provides: controller page orchestrator, LanguageSelectScreen, AvatarSelectScreen, NameEntryScreen, TrackSelectScreen
provides:
  - src/lib/i18n.ts — t(language) function returning typed EN/AR string maps
  - All 7 controller screens accept language prop and display bilingual strings
  - controller/page.tsx wires dir="rtl"/"ltr" to outermost wrapper from session.language
affects: [05-display-screen]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - i18n via t(language) typed string map — no external library, compile-time safe
    - dir="rtl"/"ltr" on outermost wrapper propagates RTL automatically to all children
    - language prop passed from page orchestrator to every screen component

key-files:
  created:
    - src/lib/i18n.ts
  modified:
    - src/app/controller/page.tsx
    - src/components/controller/LanguageSelectScreen.tsx
    - src/components/controller/AvatarSelectScreen.tsx
    - src/components/controller/NameEntryScreen.tsx
    - src/components/controller/TrackSelectScreen.tsx
    - src/components/controller/QuizScreen.tsx
    - src/components/controller/QuestionResultScreen.tsx
    - src/components/controller/FinalResultScreen.tsx

key-decisions:
  - "t(language) pattern chosen over React Context to keep components pure and testable"
  - "dir applied to outermost page wrapper div — single source of truth for layout direction"
  - "Language buttons in LanguageSelectScreen stay hardcoded EN/AR by design (they are the selector)"

patterns-established:
  - "i18n via t(language).key — no library overhead, fully typed, tree-shakeable"

issues-created: []

# Metrics
duration: ~15min (Task 1 complete; plan paused at human-verify checkpoint)
completed: 2026-07-31
---

# Phase 04-03: Arabic RTL i18n Summary

**Bilingual EN/AR string map via t(language) in i18n.ts; dir="rtl" wired to controller page wrapper; all 7 screens localised — pending human verification**

## Performance

- **Duration:** ~15 min (Task 1)
- **Started:** 2026-07-31
- **Completed:** 2026-07-31 (partial — checkpoint before Task 2)
- **Tasks:** 1/2 complete (Task 2 is human-verify checkpoint)
- **Files modified:** 9

## Accomplishments
- Created `src/lib/i18n.ts` with `t(language)` returning fully typed EN/AR string maps
- Arabic translations cover all 10 tracks and all UI strings across every screen
- `dir="rtl"` / `dir="ltr"` applied to controller page outermost div based on `session.language`
- All 7 screen components updated with `language: Language` prop and `t(language).key` calls
- Language selector buttons stay bilingual by design (they are the chooser, not localised)

## Task Commits

1. **Task 1: Bilingual string map and RTL wiring** - `adc4b02` (feat)

## Files Created/Modified
- `src/lib/i18n.ts` — Created. t(language) returning typed EN/AR string objects
- `src/app/controller/page.tsx` — Added dir attribute, language prop propagation to screens, i18n for IdleScreen
- `src/components/controller/LanguageSelectScreen.tsx` — title uses t(language).selectLanguage; language buttons stay bilingual
- `src/components/controller/AvatarSelectScreen.tsx` — title uses t(language).chooseAvatar
- `src/components/controller/NameEntryScreen.tsx` — title, placeholder, button use i18n
- `src/components/controller/TrackSelectScreen.tsx` — title and track labels use i18n (Arabic track names)
- `src/components/controller/QuizScreen.tsx` — progress indicator uses t(language).questionOf()
- `src/components/controller/QuestionResultScreen.tsx` — correct/incorrect text, score, next/final buttons use i18n
- `src/components/controller/FinalResultScreen.tsx` — final score, outcome headings, messages, play again use i18n

## Decisions Made
- `t(language)` pattern chosen over React Context: keeps components stateless/pure, no provider wrapping needed, zero runtime overhead
- `dir` applied once to page wrapper div — HTML cascade propagates direction to all children automatically
- LanguageSelectScreen buttons stay hardcoded "English" / "العربية" — these are the selectors, not UI text to localise

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- Task 1 complete and committed (adc4b02)
- Awaiting human verification of Arabic flow (Task 2 checkpoint)
- After approval: plan is complete, Phase 04 is complete, ready for Phase 05 (Display Screen)

---
*Phase: 04-controller-ui*
*Completed: 2026-07-31*
