---
phase: 05-display-screen
plan: 03
subsystem: ui
tags: [react, nextjs, tailwind, supabase-realtime, animation, screensaver, display]

# Dependency graph
requires:
  - phase: 05-02
    provides: FinalResultScreen, display/page.tsx with 3-screen routing
provides:
  - ScreensaverScreen with CSS float animation and AAAH branding
  - display/page.tsx routing all 10 session states (idle/screensaver → ScreensaverScreen)
  - Phase 6 extension point: z-0 glow / z-10 content layer ready for D3 network at z-5
  - Answer highlight on display: selected card turns teal + white ring during answer_submitted state
  - Two-write answer flow: controller writes answer_submitted first, advances after 1200ms
affects: [06-hired-network]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS keyframe via inline <style> tag
    - z-index layering for future canvas overlay
    - Two-write Realtime pattern for display feedback

key-files:
  created:
    - src/components/display/ScreensaverScreen.tsx
  modified:
    - src/app/display/page.tsx
    - src/components/display/QuestionScreen.tsx
    - src/components/controller/QuizScreen.tsx

key-decisions:
  - "CSS-only float animation via inline <style> keyframe — no Framer Motion; Phase 6 adds D3/Canvas"
  - "Content at z-10, glow at z-0 — Phase 6 network slots in at z-5 without refactoring"
  - "Two-write answer flow: controller writes answer_submitted first, then advances after 1200ms so display can highlight the selected answer via Realtime"
  - "Answer highlight: selected card gets bg-aaah-teal + ring-4 ring-white during answer_submitted state"

patterns-established:
  - "Inline <style> for custom keyframes not representable in Tailwind arbitrary syntax"
  - "Phase 6 readiness: z-index layering documented in component comment"
  - "Two-write Realtime pattern: intermediate state write + delayed final state write for display feedback"

issues-created: []

# Metrics
duration: ~35min
completed: 2026-07-31
---

# Phase 05-03: Display Screen — Screensaver + Full QA Summary

**Animated AAAH screensaver completes all 4 display screens; answer highlight via two-write Realtime pattern verified end-to-end by human QA**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-07-31
- **Completed:** 2026-07-31
- **Tasks:** 2/2
- **Files modified:** 4

## Accomplishments

- ScreensaverScreen built: floating AAAH logo, "Ruya Careers Fair 2026" heading, pulsing invite tagline, CSS-only float animation, z-layer reserved for Phase 6 D3/Canvas network overlay
- display/page.tsx now routes all 10 session states — idle and screensaver map to ScreensaverScreen, no state falls through
- Answer highlight on display: QuestionScreen highlights the submitted answer card (teal bg + white ring) during the ~1200ms answer_submitted window
- Two-write fix in controller QuizScreen: writes answer_submitted first, schedules advance after 1200ms, giving Realtime time to propagate to display
- Human QA approved all 4 screens: ScreensaverScreen, WaitingScreen, QuestionScreen, FinalResultScreen — including RTL Arabic layout

## Task Commits

1. **Task 1: ScreensaverScreen + wire into display page** - `5b228b9` (feat)
2. **Task 1b: Answer highlight on display** - `72806e4` (fix)
3. **Task 1c: Two-write answer flow fix** - `d47bf0c` (fix)
4. **Task 2: Human verification — approved** (checkpoint, no commit)

**Plan metadata:** *(this commit)*

## Files Created/Modified

- `src/components/display/ScreensaverScreen.tsx` — Created. Animated screensaver with AAAH logo, heading, pulsing tagline, CSS float keyframe via inline `<style>`, radial glow at z-0, content at z-10 (Phase 6 network slots at z-5)
- `src/app/display/page.tsx` — Added ScreensaverScreen import; idle/screensaver/default cases now route to `<ScreensaverScreen />`
- `src/components/display/QuestionScreen.tsx` — Answer cards conditionally styled teal + white ring when session state is `answer_submitted` and card matches `session.current_answer`
- `src/components/controller/QuizScreen.tsx` — Two-write flow: write `answer_submitted` on tap, then `setTimeout(1200ms)` before writing question advance

## Decisions Made

- CSS-only float animation via inline `<style>` keyframe — avoids verbose Tailwind arbitrary keyframe syntax; no Framer Motion needed until Phase 6
- Content at z-10, glow at z-0 — Phase 6 D3/Canvas network layer slots in at z-5 without touching this component
- Two-write answer pattern (answer_submitted → delay → advance) ensures display has time to receive and render the highlight before the question changes

## Deviations from Plan

### Additions During Checkpoint Resolution

**1. Answer highlight on display (QuestionScreen)**
- **Found during:** Task 2 (human verification)
- **Issue:** Display showed no visual feedback when controller submitted an answer — the 1200ms window between tap and advance was silent on the TV
- **Fix:** QuestionScreen checks `session.state === 'answer_submitted'` and `card.value === session.current_answer`; matching card gets `bg-aaah-teal text-white ring-4 ring-white` highlight classes
- **Files modified:** `src/components/display/QuestionScreen.tsx`
- **Committed in:** `72806e4`

**2. Two-write answer flow fix (controller QuizScreen)**
- **Found during:** Task 2 (human verification) — answer_submitted state was being written but immediately overwritten by the advance write in the same tick
- **Issue:** Controller was writing answer_submitted and immediately advancing; display never had time to receive the intermediate state via Realtime
- **Fix:** Separated into two writes: immediate write of answer_submitted (+ current_answer), then `setTimeout(1200ms)` before writing the question advance. Previous auto-advance timer removed.
- **Files modified:** `src/components/controller/QuizScreen.tsx`
- **Committed in:** `d47bf0c`

---

**Total deviations:** 2 additions (both required for display answer feedback to work)
**Impact on plan:** Both additions complete the intended display feedback behaviour — not scope creep.

## Issues Encountered

None during planned Task 1. Two additions made during checkpoint resolution to complete the answer feedback loop on the display.

## Next Phase Readiness

- Phase 5 complete — all 4 display screens verified and working
- Phase 6 (Hired Network) can begin: ScreensaverScreen already reserves z-5 for the D3/Canvas network overlay
- No blockers

---
*Phase: 05-display-screen*
*Completed: 2026-07-31*
