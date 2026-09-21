# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** COMPLETE — live on Vercel, post-deploy polish applied

## Current Position

Phase: 7 of 7 — COMPLETE
Status: SHIPPED — all 7 phases done. App live at https://ruya2026.vercel.app
Last activity: 2026-09-21 — Full Arabic text-alignment audit and fix across display and controller (see Decisions log)

Progress: ████████████████████ 100%

## Live URLs

| Screen | URL |
|--------|-----|
| Display (big screen) | https://ruya2026.vercel.app/display |
| Controller (iPad) | https://ruya2026.vercel.app/controller |
| Admin (staff) | https://ruya2026.vercel.app/admin |
| Landing | https://ruya2026.vercel.app |

## Infrastructure

- **GitHub:** https://github.com/charmenlondon-cmd/ruya2026 (branch: main)
- **Vercel:** project `ruya2026`, team `charls-projects-dd19784e`
- **Supabase:** https://djjtsfaqzvoksytxzkbf.supabase.co
- **Deploy:** `vercel --prod --yes` from project root (Vercel CLI linked via `.vercel/`)
- **Deployment Protection:** disabled (was blocking public access on team account)

## Performance Metrics

**Velocity:**
- Total plans completed: 14 (12 core + 2 phase 7)
- Total execution time: ~3.5 hours across all sessions

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/3 | 52 min | 17 min |
| 02-realtime-game-engine | 2/2 | 50 min | 25 min |
| 03-question-engine | 2/2 | ~25 min | ~12 min |
| 04-controller-ui | 3/3 | ~60 min | ~20 min |
| 05-display-screen | 3/3 | ~55 min | ~18 min |
| 06-hired-network | 2/2 | ~45 min | ~22 min |
| 07-admin-deploy | 2/2 | ~30 min | ~15 min |

## Accumulated Context

### Decisions

- **package.json name is `ruya-careers-fair-2026`** — directory name violates npm naming rules; they don't need to match.
- **RLS omitted from schema** — anon key, event-day-only, no-auth setup.
- **questions excluded from realtime publication** — read-only after seed.
- **Manual TypeScript types in src/types/database.ts** — avoids Supabase CLI toolchain dependency.
- **Montserrat via next/font/google** — AAAH Branding/Montserrat/ folder was empty.
- **Tailwind v4 CSS-first colour tokens** — tokens defined in globals.css @theme block.
- **Database types must use type aliases not interfaces** — Supabase GenericTable requires `Row: Record<string, unknown>`.
- **useSession() takes no args** — hook auto-discovers active session via getActiveSession() + Realtime INSERT.
- **createHire guarded by useRef(false)** — prevents duplicate inserts from re-renders; also now has a DB-level session_id check.
- **1500ms auto-advance answer_submitted → question_result** — gives display time to reflect via Realtime.
- **Image answers are EN-only in Supabase** — AR rows use text descriptions; image_url is null for AR.
- **Supabase Storage bucket "question-images" is public** — CDN URLs, no auth.
- **i18n via t(language) typed string map** — no external library.
- **HiredNetworkScreen: JS requestAnimationFrame Lissajous paths** — D3 and CSS keyframe approaches all failed; rAF is definitive.
- **Lissajous period base: 35s** — doubled from original 70s at user request for faster animation.
- **useHires called at display/page level** — avoids duplicate subscriptions.
- **60s inactivity timer → HiredNetworkScreen** — fires after 60s idle/screensaver; resets on any active game state.
- **Header stays in root layout** — display page keeps AAAH header.
- **Supabase lazy-init via Proxy** — prevents `supabaseUrl is required` crash during Vercel static prerendering.
- **Vercel team account domain** — production URL is ruya2026.vercel.app (team project); deployment protection must be disabled or public access is blocked.
- **15s auto-reset on final result** — countdown shown on controller; session resets to idle automatically; display follows via Realtime.
- **Score hidden during quiz** — display QuestionScreen shows question number only; score revealed on final result screen only.
- **Hired network centre** — white AAAH logo + "Our Future Leaders" tagline at 90% opacity.
- **createHire DB guard** — checks for existing hire by session_id before inserting; silent skip if found.
- **useHires triple deduplication** — Realtime INSERT handler checks id, session_id, and player_name+track before appending.
- **Favicon/app icons generated from the real Ru'ya logo** — `src/app/favicon.ico` + `icon.png` + `apple-icon.png`, background removed, composited onto an AAAH teal-gradient rounded tile. `favicon.ico` must be saved as RGBA (Pillow defaults to RGB, which Turbopack's decoder rejects with "not in RGBA format").
- **No web app manifest** — `manifest.ts` was added then removed same day. iOS Safari's rule for a manifest with `display:'standalone'` is to always launch "Add to Home Screen" shortcuts at the manifest's `start_url`, ignoring the page that was actually open — this silently collapsed every `/controller?lane=1|2` shortcut to `/`. `apple-touch-icon` (from `apple-icon.png`) alone is enough for the iOS home-screen icon; no manifest needed for this project's use case.
- **Turbopack dev filesystem cache disabled** (`next.config.ts` → `experimental.turbopackFileSystemCacheForDev: false`) — this repo lives in a OneDrive-synced folder; OneDrive's Files On-Demand sync corrupts Turbopack's mmap'd dev cache under `.next/`, crashing `next dev` with "corrupted database" panics. Cache-on-by-default shipped in Next 16.1.
- **Answer images are shared across languages, not per-language** — the four pre-existing visual questions (A&D Q6, Legal Q6, Operations Q4, Marketing Q9) had `image_url` populated for `en` only, with `ar` rows left as null/text-only by earlier deliberate decision. Reversed 2026-09-14: same image URLs now written to both language rows, since the pictures themselves aren't language-specific.
- **HR Q9 images were never actually uploaded** — an earlier session log claimed "images added... DB updated for EN + AR", but the storage bucket never had them and both language rows had `image_url = null`. Fixed 2026-09-14: uploaded from local `HR - Q9 Images/` folder to the `question-images` bucket, both language rows patched. Trust the DB over old log entries when they disagree.
- **"Arabic alignment/spacing" bug (reported by Manal Alblooshi, Naresco, 2026-09-15 email) was a code bug, not bad data** — `QuestionScreen.tsx`'s answer-options grid is deliberately `dir="ltr"` so cards A/B/C always sit left-to-right regardless of language, but the answer `<p>` text inside it had no `dir` of its own, so Arabic text inherited the LTR base direction. That breaks the Unicode bidi algorithm's placement of punctuation, hyphens, and embedded Latin terms (brand names, acronyms) — e.g. a trailing "." rendered glued to the wrong side of the last word. Fixed 2026-09-16: answer `<p>` now sets `dir={language === 'ar' ? 'rtl' : 'ltr'}` + `lang={language}`. Verified visually (before/after screenshots via a live Supabase test session) on Engineering Q6 and Marketing Q2 — confirmed via direct DB/CSV comparison that all 35 fields Manal flagged were byte-identical to the original CSV, so no text content was ever actually wrong.
- **Sep-16 bidi fix was incomplete — block-level text alignment also broken (fixed 2026-09-21)** — The Sep-16 fix addressed the Unicode bidi algorithm (character-level punctuation direction) but did not fix block-level `text-align`. These are separate concerns: bidi controls how individual characters are ordered within a line; text-align controls how each line is positioned in its container. For single-line Arabic answers the two issues are visually indistinguishable (a narrow `<p>` that shrink-wraps to content looks right-aligned even with `text-center`). For multi-line answers (e.g. Engineering Q1 Answer B), the short last line was being centred inside a full-width container, which browsers render from the left — appearing left-aligned. A separate bug in the controller fix attempt also introduced a double-reversal: adding both `dir="rtl"` on a flex button (which reverses item order in RTL context) AND `flex-row-reverse` (which reverses it again) cancelled out, leaving LTR layout. Both were corrected in commits `820dff3`, `fff929f`, and `26d35fe` on 2026-09-21.
- **Arabic alignment fix scope — what was fixed and what was intentionally left (2026-09-21)** — Full audit of every component that renders Arabic text. Fixed: display `QuestionScreen` (answer cards: `w-full text-right dir=rtl`; question card: `dir`/`lang`), display `FinalResultScreen` (track, outcome message, wellGetBack), display `WaitingScreen` (player name, track), controller `QuizScreen` (question card and answer text `<span>`: `flex-1 text-right dir=rtl lang=ar`), controller `FinalResultScreen` (track, outcome message, wellGetBack). Intentionally NOT fixed: `HiredNetworkScreen` floating avatar name labels, and the setup-flow screen headings in `NameEntryScreen`, `TrackSelectScreen`, and `AvatarSelectScreen`. Reason: all are short single-line centred strings that cannot wrap to a second line, so the multi-line alignment failure mode cannot occur. If Manal flags anything specific on those screens the fix is the same pattern (`dir`/`lang` on the element, `text-right` for Arabic).

### Deferred Issues

- **HR Q6 ≈ Legal & Compliance Q9** — near-duplicate scenario/options (Sana's D48 comment). Left as-is by user decision (unlikely a player does both tracks).

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-09-21
Stopped at: Full Arabic text-alignment fix complete and deployed. All components that render multi-line Arabic text now have `dir`/`lang` attributes and explicit `text-right` alignment. Local `main` fully in sync with `origin/main` (commit `26d35fe`).

### Resume steps

1. Event-day prep (clearing hires, seeding any updated questions)
2. Any last-minute fixes surfaced during rehearsal
3. Untracked in git, still sitting in the project root: `Arabic Question Matrix.csv`, `Ru'ya-Student Experience.xlsx`, `Ruya Logo.htm`, `Ruya logo.png` — decide whether any should be tracked or gitignored

### How to push single-row question edits to live Supabase (no redeploy)

`scripts/seed-questions.ts` does a full wipe+reseed. For a handful of edits, PATCH PostgREST directly instead:
- Key: `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (an `sb_secret_…` key)
- Use `curl.exe`, NOT PowerShell `Invoke-RestMethod` (Supabase rejects it as "browser" use)
- `curl -s -X PATCH "$URL/rest/v1/questions?track=eq.<Track>&question_no=eq.<n>&language=eq.ar" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -H "Prefer: return=representation" --data-binary "@body.json"`
- Track names are the canonical form (`Legal & Compliance`, url-encoded), not the CSV uppercase
