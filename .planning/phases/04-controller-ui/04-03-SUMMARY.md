---
phase: 04-controller-ui
plan: 03
subsystem: ui
tags: [react, next.js, i18n, rtl, arabic, tailwind, ux]

# Dependency graph
requires:
  - phase: 04-02
    provides: QuizScreen, QuestionResultScreen, FinalResultScreen, full gameplay loop
  - phase: 04-01
    provides: controller page orchestrator, LanguageSelectScreen, AvatarSelectScreen, NameEntryScreen, TrackSelectScreen
provides:
  - src/lib/i18n.ts — t(language) function returning typed EN/AR string maps
  - src/components/controller/StartOverButton.tsx — shared session-reset button
  - All 7 controller screens accept language prop and display bilingual strings
  - All 7 controller screens have a Start Over ghost button for mid-session resets
  - controller/page.tsx wires dir="rtl"/"ltr" to outermost wrapper from session.language
affects: [05-display-screen]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - i18n via t(language) typed string map — no external library, compile-time safe
    - dir="rtl"/"ltr" on outermost wrapper propagates RTL automatically to all children
    - language prop passed from page orchestrator to every screen component
    - StartOverButton positioned absolute top-right within relative-positioned screen wrapper

key-files:
  created:
    - src/lib/i18n.ts
    - src/components/controller/StartOverButton.tsx
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
  - "StartOverButton is a shared component (not inlined) to keep the reset payload in one place"
  - "FinalResultScreen keeps Play Again as primary CTA; StartOverButton sits in corner as consistent UX pattern"

patterns-established:
  - "i18n via t(language).key — no library overhead, fully typed, tree-shakeable"
  - "Shared corner button pattern for cross-cutting session controls"

issues-created: []

# Metrics
duration: ~25min total (Task 1 ~15min + Task 2 ~10min)
completed: 2026-07-31
---

# Phase 04-03: Arabic RTL i18n + Start Over Button

**Bilingual EN/AR controller UI with RTL layout and a UX safety-net Start Over button on every screen**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-31
- **Completed:** 2026-07-31
- **Tasks:** 2/2 complete
- **Files modified:** 10

## Accomplishments

- Created `src/lib/i18n.ts` with `t(language)` returning fully typed EN/AR string maps including `startOver` key
- Arabic translations cover all 10 tracks and all UI strings across every screen
- `dir="rtl"` / `dir="ltr"` applied to controller page outermost div based on `session.language`
- All 7 screen components updated with `language: Language` prop and `t(language).key` calls
- Language selector buttons stay bilingual by design (they are the chooser, not localised)
- Created `StartOverButton` shared component: ghost text button positioned absolute top-right, resets session to idle and clears all player fields (language, player_name, avatar_id, track, score, current_question, last_answer, last_answer_correct)
- StartOverButton added to all 7 screens (LanguageSelect through FinalResult); not on idle/screensaver which is the start itself

## Task Commits

1. **Task 1: Bilingual string map and RTL wiring** - `adc4b02` (feat)
2. **Task 2: Start Over button on all screens** - `475367a` (feat)

Also committed by orchestrator:
- `e9ea75a` — fix(04-03): allow Supabase storage hostname for next/image

## Files Created/Modified

- `src/lib/i18n.ts` — Created. t(language) returning typed EN/AR string objects; added startOver key
- `src/components/controller/StartOverButton.tsx` — Created. Shared ghost button that resets session to idle
- `src/app/controller/page.tsx` — Added dir attribute, language prop propagation to screens, i18n for IdleScreen
- `src/components/controller/LanguageSelectScreen.tsx` — title uses i18n; StartOverButton added; wrapper is relative
- `src/components/controller/AvatarSelectScreen.tsx` — title uses i18n; StartOverButton added
- `src/components/controller/NameEntryScreen.tsx` — title, placeholder, button use i18n; StartOverButton added
- `src/components/controller/TrackSelectScreen.tsx` — title and track labels use i18n; StartOverButton added
- `src/components/controller/QuizScreen.tsx` — progress indicator uses i18n; StartOverButton added
- `src/components/controller/QuestionResultScreen.tsx` — all text uses i18n; StartOverButton added
- `src/components/controller/FinalResultScreen.tsx` — all text uses i18n; StartOverButton added (Play Again remains primary CTA)

## Decisions Made

- `t(language)` pattern chosen over React Context: keeps components stateless/pure, no provider wrapping needed, zero runtime overhead
- `dir` applied once to page wrapper div — HTML cascade propagates direction to all children automatically
- LanguageSelectScreen buttons stay hardcoded "English" / "العربية" — these are the selectors, not UI text to localise
- `StartOverButton` extracted as a shared component so the full reset payload lives in exactly one place
- FinalResultScreen: Play Again (primary CTA) and Start Over (corner ghost) both do the same reset — consistent UX, familiar label for fair staff

## Deviations from Plan

None — plan executed exactly as written. Two user requirements added post human-verify (Start Over button + image hostname fix) both completed.

## Issues Encountered

None.

## Next Phase Readiness

- Phase 04 (Controller UI) is complete — all 3 plans done
- TypeScript clean (npx tsc --noEmit), npm run build passes
- Ready for Phase 05: Display Screen

---
*Phase: 04-controller-ui*
*Completed: 2026-07-31*
