# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** COMPLETE — live on Vercel, post-deploy polish applied

## Current Position

Phase: 7 of 7 — COMPLETE
Status: SHIPPED — all 7 phases done. App live at https://ruya2026.vercel.app
Last activity: 2026-09-28 — auto-reload-on-deploy feature + hired-network text cleanup (see Decisions log)

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
- **Deploy:** push to `origin/main` — Vercel auto-deploys from GitHub (no manual CLI step needed)
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
- **Back button on quiz (added 2026-09-21)** — Players on Q2–Q10 can tap "Back" (top-right of the progress row) to return to the previous question and change their answer. Going back as far as Q1 is allowed; going back past Q1 is not (button hidden on Q1). Score is adjusted correctly: the previous question's contribution is subtracted before the new answer is scored, using a `Record<number, boolean>` (`answeredCorrectly`) keyed by question index. Deleting the entry on Back ensures a re-answer is treated as a fresh first answer (no double-subtract). A `genRef` generation counter invalidates any in-flight auto-advance timers (150ms local + 1200ms session update) if Back is pressed before they fire. Back is disabled while `answered` is true (after tapping an answer, during the flash window) to prevent mid-animation interruption. Strings added: `back: 'Back'` (EN) and `back: 'رجوع'` (AR) in i18n.ts. Note: `controller/page.tsx` wraps everything in `<div dir={rtl|ltr}>` — flex item order already reverses for Arabic without any `flex-row-reverse` on the button.
- **Vercel deploys automatically from GitHub (confirmed 2026-09-21)** — Pushing to `origin/main` triggers production deployment on Vercel automatically. The earlier STATE.md note about running `vercel --prod --yes` manually is stale — that step is not needed.
- **Tailwind v4's `@layer` output breaks completely on old embedded browsers (found live on-site 2026-09-27)** — one of the venue's smart TVs (a cheap Geepas model, Android TV, ships a stock browser frozen at an old Chromium version despite running Android 14) rendered `/display` as fully unstyled default HTML — no colours, no layout, default serif font — even though session data/text was correct. Root cause: Tailwind v4 wraps its entire generated stylesheet in `@layer theme, base, components, utilities` (Chromium 99+, 2022). A browser that doesn't recognise `@layer` discards the whole block, contents included, rather than degrading gracefully. Fixed by adding `@csstools/postcss-cascade-layers` to `postcss.config.mjs`, which flattens `@layer` into plain CSS using specificity-boosting `:not(#\#)` selectors to preserve the same cascade order — works on any browser with basic CSS3 support. No visual change on modern browsers (verified).
- **TV-safe display scaling, admin-controlled (2026-09-27)** — that same TV also applied overscan/zoom, cropping the *bottom* of `/display` (top was always fully visible — confirmed from the "zoomed" screenshot before any fix). `/display` now renders inside a wrapper scaled down (default 90%) with `transformOrigin: 'top center'` (anchors the top edge in place, only pulls the bottom in — a centred origin would have wasted margin at the top, which was never cropped). The scale value is controllable live, per lane, from a slider + presets in the admin panel (`src/lib/displayScale.ts`, `src/hooks/useDisplayScale.ts`) — sent over **Supabase Realtime Broadcast** (not a DB table — no migration needed, and we don't currently have Supabase DDL access from this machine, only the anon/service-role REST keys) and cached in the receiving browser's `localStorage` so a reload keeps the last value without a live sender. `?scale=0.85` on the display URL is a manual one-off override (not persisted) for typing directly if ever needed.
- **All 10 track background decorations used a viewport-width-hardcoded formula that broke on non-1920px screens (found + fixed 2026-09-27)** — each track's Lottie background icon (`src/components/display/track-animations/*.tsx`) positioned itself via `right: calc(50% - ~512px)`, which only lands beside the ~1024px-wide centered content column when the viewport is *exactly* 1920px wide (960 - 512 = 448, matching a 1024px column's margin in a 1920px viewport). On the venue TV's actual resolution this drifted inward and clipped behind an answer card. Replaced with positioning scoped to the content column itself: `TrackAnimation` now renders inside the same `max-w-4xl` wrapper as the question card + answer grid (not the full-width flex area), anchored `top: calc(100% + 5px); right: 0` — sits visibly just below the cards, right-aligned, regardless of actual screen width. Also shrunk all 10 tracks' decorative icons (background + card-top) to ~70% of their original size, and did a general compacting pass on `QuestionScreen` (smaller question card/text, smaller answer cards/badges/images, tighter gaps, `pt-40` header clearance) since these venue TVs run wider-and-shorter than the original design assumed.
- **Enlarging a UI element without shifting anything below it — invisible-spacer + absolute-overlay pattern (2026-09-27)** — used to make the QuestionScreen top bar ~50% bigger (avatar 28→42px, name/track/counter text scaled up, padding/gap scaled up) while its top edge and every element below it (decoration, question card, answer grid) stayed pixel-exact. Technique: render the bar's content twice via one shared `TopBarContent` component — once at the original size wrapped in `invisible` (keeps the original height reserved in normal flex flow, renders nothing), once at the bigger size as `position: absolute; inset-x-0; top-0; z-20` (overlays on top, removed from flow so it can't push siblings down). Reusable pattern for the same request elsewhere.
- **Full Screen button added to `/display` (2026-09-27)** — venue TV browsers show their own address bar/tab strip over the page. Browsers require a real user gesture before a page can hide its own chrome (Fullscreen API — no way to auto-trigger this). Added `src/components/display/FullscreenButton.tsx`: small bottom-right "⛶ Full Screen" button, calls `requestFullscreen()` (with a `webkitRequestFullscreen` fallback for older engines) on tap, hides itself once fullscreen is active, reappears if fullscreen is ever exited. Staff taps it once per reload/power-cycle. Separately, that TV's browser turned out to have its own native "Desktop site" → full-screen toggle in its `⋮` menu, found live on-site — worth checking a device's own browser menu before assuming a code fix is needed.
- **Stale Windows git credential blocked push a second time (2026-09-27, first seen 2026-09-14)** — Windows Git Credential Manager had a cached login for a different GitHub account (`ssd-aaai`) with no access to this repo, causing `git push` to fail with a 403 even though the commit succeeded locally. Same fix as before: `cmdkey /delete:LegacyGeneric:target=git:https://github.com` (PowerShell, not Git Bash — `/list`/`/delete` flags get mangled by MSYS path conversion in Git Bash), then a fresh OAuth login as `charmenlondon-cmd` completes on the next push. This machine's credential manager appears to revert to the wrong cached account periodically — worth checking first if a push ever gets a 403 "Permission denied" for this repo.
- **Ambient screens (HiredNetworkScreen, ScreensaverScreen) render full-bleed, bypassing the TV-safe scale (2026-09-27)** — the TV-safe scale wrapper exists to protect quiz content (buttons, question text) from TV overscan cropping. Applying it to the hired-network animation too made it look like a small floating box instead of filling the display — there's no interactive content there to protect, so no reason to shrink it. `src/app/display/page.tsx` now conditionally omits the `transform: scale(...)` style entirely when the current screen is ambient (`!session`, or `state` is `idle`/`screensaver`), rendering it at true `h-screen w-screen`. `HiredNetworkScreen` measures its own container's `offsetWidth`/`offsetHeight` at runtime for avatar placement, so this made the bounce area genuinely fill the real screen, not just look differently scaled.
- **`useSession` fallback polling added, but was NOT the actual fix for the "Force Screensaver doesn't work" report (2026-09-27)** — added a 5s `setInterval(() => getActiveSession(lane))` alongside the existing Realtime subscription in `src/hooks/useSession.ts`, on the theory that a display's Realtime WebSocket could go stale on venue WiFi (lane 2 updated instantly, lane 1 took ~60s, looked like a connectivity difference). This is a reasonable resilience improvement and was kept, but user's follow-up reproduction (`Force Screensaver → shows the plain branded screen, not the network animation, until the 60s timer completes`) revealed the *actual* bug was something else entirely (see next entry). Lesson: a plausible-sounding infra explanation for an intermittent-looking bug can be wrong even when the fix is harmless — get an exact repro before trusting the first theory.
- **`'screensaver'` session state means "show the network animation now", not "start a fresh 60s idle countdown" (2026-09-27)** — `'screensaver'` is a state ONLY ever written by the admin panel's "Force Screensaver" button; normal gameplay always rests at `'idle'` between players (confirmed by grepping every write site). The display was treating both states identically: show the plain branded `ScreensaverScreen` first, only switching to the animated `HiredNetworkScreen` after a 60s local timer (`showHiredNetwork`, set in `src/app/display/page.tsx`). Lane 2 appeared to work because it happened to already be past that 60s window when tested; lane 1 wasn't — same code, no lane-specific bug, no connectivity issue. Fixed by computing `showNetworkNow = showHiredNetwork || session?.state === 'screensaver'` — an explicit Force Screensaver now always jumps straight to the network animation, while a natural `'idle'` pause between players keeps the original 60s-delayed transition (so brief gaps don't trigger the full show). This supersedes the plain "60s inactivity timer → HiredNetworkScreen" description earlier in this log — that's still accurate for the natural-idle path only.
- **Removed the "No hires yet today" placeholder text from `HiredNetworkScreen` (2026-09-28)** — per user request, once hires are cleared the screen now just shows the logo + tagline with no extra line of text; that empty-state message wasn't wanted.
- **Auto-reload on new deploy, for `/display` only (2026-09-28)** — venue TVs run `/display` unattended for hours; every push previously meant physically refreshing each TV. Added `src/app/api/version/route.ts` (`export const dynamic = 'force-dynamic'`, returns `process.env.VERCEL_GIT_COMMIT_SHA` with `Cache-Control: no-store`) and `src/hooks/useAutoReloadOnNewDeploy.ts`, wired into `/display` only: polls `/api/version` every 60s, calls `window.location.reload()` the moment the returned commit SHA changes. Safe to fire anytime, including mid-quiz — the display is a pure reflection of the Supabase session row, so a reload just re-fetches and re-renders whatever's currently showing. Not added to `/controller` or `/admin` (those are actively attended, so a manual refresh isn't a real pain point).
- **Vercel can silently miss a GitHub push's webhook — no error, the deployment just never appears (found 2026-09-28)** — pushed commit `040d9b4` (the auto-reload feature) successfully to `origin/main` (confirmed via `git log origin/main`), but it never showed up anywhere in the Vercel dashboard's deployment list — not "Error", not "Building", just absent, while the deployment immediately before and after it both built fine. `ruya2026.vercel.app/api/version` kept 404ing (confirmed from two different networks, ruling out a single stale CDN edge) because the route simply never got deployed. Fix: `git commit --allow-empty -m "..." && git push` — a trivial follow-up push re-triggered the webhook normally and the new deployment (built on top of the "missing" commit, so all its code was included) went live within the usual ~30-60s. **Diagnostic lesson:** if a push seems to "do nothing" after the usual wait, check the Vercel deployments list for that exact commit hash before assuming the code is broken — if the commit isn't listed at all, it's an infra/webhook gap, not a build failure, and an empty re-push resolves it.

### Deferred Issues

- **HR Q6 ≈ Legal & Compliance Q9** — near-duplicate scenario/options (Sana's D48 comment). Left as-is by user decision (unlikely a player does both tracks).

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-09-28
Stopped at: Removed the "No hires yet today" text from the hired-network screen, then added an auto-reload-on-new-deploy feature so venue TVs pick up code updates on their own (`/display` only) instead of needing a manual refresh per TV. Hit a real Vercel infra hiccup along the way — one push's webhook was silently missed, so that deployment never appeared at all — resolved with an empty re-push. Confirmed live and working via the Vercel dashboard (screenshot) and a direct `/api/version` check. Local `main` fully in sync with `origin/main` (latest commit `878d6f8`).

### Resume steps

1. Continue monitoring the venue TVs through the rest of the event for any further display issues (different TVs may have different overscan/resolution quirks — the admin panel's per-lane Display Size slider is the fastest lever, no redeploy needed).
2. `FinalResultScreen` and `WaitingScreen` were NOT touched in the 2026-09-27 compacting/sizing pass — only `QuestionScreen` was. If either looks cramped or oversized on a venue TV, the same techniques (smaller cards/text, content-column-scoped decorations, invisible-spacer overlay for resizing) apply.
3. Untracked in git, still sitting in the project root: `Arabic Question Matrix.csv`, `Ru'ya-Student Experience.xlsx`, `Ruya Logo.htm`, `Ruya logo.png` — decide whether any should be tracked or gitignored.
4. If a future `git push` fails with 403 "Permission denied" for this repo, check the Windows credential manager first (see Decisions log) before assuming anything else is wrong.
5. If an admin action ever again seems to "not work" on one lane, get an exact repro (what shows on screen, not just "doesn't work") before assuming a connectivity/Realtime cause — the 2026-09-27 "Force Screensaver" bug (`'screensaver'` vs `'idle'` state semantics) looked exactly like a stale-connection symptom at first.
6. If a push ever seems to have no effect after the usual ~30-60s wait, check the Vercel dashboard's deployment list for that exact commit hash before assuming the code is broken (see the 2026-09-28 missed-webhook entry in Decisions) — an empty `git commit --allow-empty` re-push fixes it.
7. `/display` now auto-reloads within ~60s of any new deployment. `/controller` and `/admin` do not — if that becomes a pain point too, the same `useAutoReloadOnNewDeploy` hook can be added there.

### How to push single-row question edits to live Supabase (no redeploy)

`scripts/seed-questions.ts` does a full wipe+reseed. For a handful of edits, PATCH PostgREST directly instead:
- Key: `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (an `sb_secret_…` key)
- Use `curl.exe`, NOT PowerShell `Invoke-RestMethod` (Supabase rejects it as "browser" use)
- `curl -s -X PATCH "$URL/rest/v1/questions?track=eq.<Track>&question_no=eq.<n>&language=eq.ar" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -H "Prefer: return=representation" --data-binary "@body.json"`
- Track names are the canonical form (`Legal & Compliance`, url-encoded), not the CSV uppercase
