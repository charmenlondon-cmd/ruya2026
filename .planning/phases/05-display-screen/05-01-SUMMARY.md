# 05-01 Summary: Display Screen — WaitingScreen + QuestionScreen

## Outcome

Plan complete. The display screen (projected TV view) now has a full real-time state machine routing all 10 session states, with two fully implemented audience-facing screens.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | i18n playerJoining + WaitingScreen | `1e640e5` | `src/lib/i18n.ts`, `src/components/display/WaitingScreen.tsx` |
| 2 | QuestionScreen + display page orchestrator | `ba3a4bc` | `src/components/display/QuestionScreen.tsx`, `src/app/display/page.tsx` |

## What Was Built

### src/lib/i18n.ts
Added `playerJoining` key to both `en` (`'A player is joining…'`) and `ar` (`'…لاعب ينضم'`) string maps. Additive only — no existing keys changed.

### src/components/display/WaitingScreen.tsx
Full-screen centred component shown during onboarding states (`language_select`, `avatar_select`, `name_entry`, `track_select`). Progressively reveals:
- "AAAH Careers Fair 2026" heading when no player info exists yet
- Animated pulsing `playerJoining` status line (always visible)
- Avatar image (160×160 rounded-full) once `session.avatar_id` is set
- Player name (`text-6xl font-bold text-white`) once `session.player_name` is set
- Track name in `text-aaah-light-teal` once `session.track` is set

### src/components/display/QuestionScreen.tsx
TV-optimised landscape layout (no click handlers — purely reactive):
- **Top bar**: avatar + player name + track (left), question counter + score (right)
- **Question card**: `bg-white/90 rounded-3xl` with `text-3xl` question text
- **3-col answer grid**: always LTR visual order for A/B/C; each cell has a dark-teal badge + text or image
- Uses `session.current_question` directly (no optimistic index — display is purely reactive)
- Loading spinner while questions fetch; error state in red

### src/app/display/page.tsx
Replaced scaffold entirely. Routes all 10 session states:
- `language_select | avatar_select | name_entry | track_select` → `<WaitingScreen />`
- `question_active | answer_submitted | question_result` → `<QuestionScreen />`
- `final_result` → inline placeholder ("The results are in…")
- `idle | screensaver | default` → inline placeholder (Ruya Careers Fair 2026 heading + start prompt)

## Verification

- `npx tsc --noEmit` — zero errors
- `npm run build` — clean build, zero warnings
- No unused imports in any file

## Decisions

- Answer grid forced `dir="ltr"` — A/B/C columns are visual (not textual flow), so they stay left-to-right even in Arabic sessions. The parent `dir="rtl"` would flip them otherwise.
- Idle/screensaver placeholder uses hardcoded English strings — this matches the plan spec (inline placeholder to be replaced in 05-03 screensaver plan).
- `t` import removed from `display/page.tsx` — idle placeholder uses hardcoded strings per spec; no unused imports.
