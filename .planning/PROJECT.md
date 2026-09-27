# Ruya Careers Fair 2026 — Interactive Game

## What This Is

A two-screen interactive careers fair game for the Ruya Careers Fair 2026, hosted by Abdulla Al Arif Holding. An iPad acts as the player controller while a large display screen runs the game. Players choose a language (English or Arabic), select an avatar and career track, then answer 10 questions to find out if they'd be hired. Players who score 7–10 are added to a live animated "new hires" network on the big screen that grows throughout the day.

## Core Value

All four of these are non-negotiable — none can be compromised:
- **Stunning display experience** — the big screen is the visual centrepiece of the stand
- **Reliability end-to-end** — runs without a hitch from first player to last, under event pressure
- **The animated hired network** — grows visibly through the day and becomes a talking point
- **Smooth player experience** — every player regardless of language or track has a fun, memorable few minutes

## Requirements

### Validated

- [x] Two simultaneous lanes — `/controller?lane=1` + `/display?lane=1`, `/controller?lane=2` + `/display?lane=2` — run independent games with a shared hires pool
- [x] Display with no active session shows screensaver (not a blank "waiting" state)
- [x] Hired network logo + tagline centred correctly on all screen sizes
- [x] Result screen: "You're Hired!" heading removed; congratulations sub-message retained
- [x] Track name shown on result screen (controller and display)
- [x] Hires network tagline updated to "Building Foundations. Launching Futures."
- [x] Track selection prompt updated to "What's your area of interest?" (EN + AR)
- [x] Controller idle screen shows "Explore your skills." above the start prompt
- [x] HR Q9 converted to visual question — A/B/C image answers live in DB and deployed
- [x] Architecture & Design Q6 Arabic row fixed — now uses image answers (was text only)

### Active

- [ ] Language selection (English / Arabic with full RTL layout support)
- [ ] Avatar selection (10 avatars: 5 male, 5 female)
- [ ] Name entry
- [ ] Career track selection (10 tracks)
- [ ] Quiz flow: 10 questions per track, dynamically loaded from Supabase
- [ ] Questions support both text and image-based answer options (A/B/C)
- [ ] Large display screen (`/display`) shows question, answers, player info
- [ ] iPad controller (`/display`) shows only A/B/C buttons and question number
- [ ] Realtime sync between controller and display via Supabase Realtime (internet-only)
- [ ] Scoring: 7–10 = "You're Hired", 0–6 = "We'll Get Back to You"
- [ ] Animated hires network on display — avatars clustered by track around AAAH logo
- [ ] Admin page (`/admin`): start/reset session, clear player, clear hires, screensaver mode, view session state, seed questions
- [ ] Full AAAH branding: Montserrat font, dark teal / light teal gradient palette
- [ ] Arabic RTL layout throughout
- [ ] iPad Safari compatible
- [ ] Vercel-deployable

### Out of Scope

- Leaderboard / player scoring table — not needed, would distract from the game
- Player accounts / login — sessions are anonymous and ephemeral by design
- In-app question editor — questions managed directly via Supabase table
- Post-event analytics dashboard — no reporting built into the app

## Context

**The event:** Ruya Careers Fair 2026, run by Abdulla Al Arif Holding (AAAH). Target audience: Emirati teenagers and young adults exploring career paths.

**Two-screen setup:** iPad (controller, `/controller`) + large display screen (`/display`). They communicate exclusively via Supabase Realtime over the internet — no assumption of shared local network.

**Questions:** 100 questions total (10 tracks × 10 questions), fully loaded from Supabase at runtime. Arabic translations exist for all 100. Four questions use image-based answer options (A/B/C images) rather than text — Architecture & Design Q6, HR Q9, Legal & Compliance Q6, Operations & Supply Chain Q4.

**Branding:**
- Company: Abdulla Al Arif Holding (AAAH)
- Font: Montserrat (files available in project folder)
- Colours: Dark teal (~#0D5C6B), light teal (~#7BBFC6), gradient between them, near-black wordmark
- Logos: Dual-language (EN+AR) and icon variants available as PNG

**Assets in project folder:**
- `Avatars/` — 10 PNG avatars (Male 1–5, Female 1–5)
- `AAAH Branding/` — logos, Montserrat font, brand guidelines PDF
- `Architecture & Design - Q6 Images/` — A/B/C image options
- `HR - Q9 Images/` — A/B/C image options
- `Legal & Compliance - Q6 Images/` — A/B/C image options
- `Operations - Q4 Images/` — A/B/C image options
- `Question Matrix.csv` — 200 rows: 100 English (rows 2–101) + 100 Arabic (rows 102–201), UTF-8 BOM encoded

**Session phases:** idle → language_select → avatar_select → name_entry → track_select → question_active → answer_submitted → question_result → final_result → screensaver

## Constraints

- **Tech Stack**: Next.js App Router, TypeScript, Tailwind CSS, Supabase, Framer Motion, D3.js/Canvas, Vercel — locked in
- **Network**: Internet-only realtime sync (Supabase) — no local network assumption
- **Device**: Must work on iPad Safari (controller) and full-screen browser (display)
- **Polish**: Premium corporate event quality — "Sony-level" finish, not a prototype aesthetic
- **Timeline**: No hard deadline, but polish is prioritised over speed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Two outcomes only (hired / not hired) | Simpler scoring, cleaner result moment | — Pending |
| Questions always read from Supabase | Enables live edits without code changes | — Pending |
| Per-answer image URLs (not per-question) | Actual asset structure has A/B/C images, not single question images | — Pending |
| Internet-only realtime (no local network) | Can't guarantee event WiFi puts both devices on same subnet | — Pending |
| Montserrat as brand font | AAAH brand guidelines, files available locally | — Pending |
| Arabic via separate Supabase rows, same table | Simpler schema, easy for staff to edit translations directly | — Pending |

---
---

## Session Log

### 2026-08-04
- Added dual-lane support for two simultaneous game instances. Requires `?lane=1` / `?lane=2` on both controller and display URLs. Hires pool remains shared across lanes.
- Fixed Supabase Realtime lane isolation: added `REPLICA IDENTITY FULL` to sessions table and a client-side lane guard in `useSession` as defence-in-depth.
- Display with no session now shows screensaver instead of "Waiting for session…".
- Fixed hired network logo/tagline centring using `position: fixed` to anchor to true viewport centre.
- Removed "You're Hired!" heading from result screen (misleading at a careers fair); kept congratulations sub-message.
- Updated hires network tagline: "Building Foundations. Launching Futures."
- Updated track selection prompt: "What's your area of interest?" (EN + AR).
- Added "Explore your skills." subtitle to controller idle screen.
- HR Q9 converted to visual question — images added to public folder, DB updated for EN + AR rows.
- A&D Q6 Arabic row corrected — was still showing text answers; now uses same image URLs as English row.
- Established that Supabase SQL access requires a personal access token (`sbp_…`) from supabase.com/dashboard/account/tokens — the service role key cannot run DDL.

### 2026-09-07
- Applied Sana Alblooshi's Arabic language review (cell notes in `Ru'ya-Student Experience.xlsx`) to the Arabic question matrix — phrasing/tone polish for the Emirati audience, no changes to correct answers, option order, tracks, or question numbers.
- 24 field edits across 22 rows in `Question Matrix Arabic.csv` (Engineering ×7 rows, Finance ×4, Marketing ×3, HR ×1, Legal & Compliance ×3, Operations & Supply Chain ×2, Project Management ×1, Architecture & Design ×1).
- Pushed the same 22 rows straight to Supabase `questions` (language=ar) via PostgREST PATCH using the `sb_secret_…` key from `.env.local`. Verified: AR 100 / EN 100 rows unchanged, English untouched. Live immediately — the game reads questions from Supabase per session, no redeploy.
- Skipped Finance Q9 — Sana's rewritten question text was truncated in the source file; left the existing DB/CSV text pending her full wording.
- Left in place (per user): HR Q6 ≈ Legal & Compliance Q9 near-duplicate (Sana's D48 comment); Sana's notes remain in the xlsx un-cleared.
- `Question Matrix Arabic.csv` / `Question Matrix.csv` are **gitignored** (`.gitignore` line 56) — not tracked, so there is no CSV commit. Supabase is the source of truth; CSV is kept in sync locally so a future `scripts/seed-questions.ts` run reproduces the same state.
- Installed Git for Windows 2.55 on this machine (`winget install -e --id Git.Git`) — was previously absent. Node/npm still not installed here.
- Tooling note: PowerShell `Invoke-RestMethod` (WinPS 5.1) is rejected by Supabase as "Forbidden use of secret API key in browser" — use `curl.exe` for PostgREST calls from this environment.

### 2026-09-14
- Added a Ru'ya-branded favicon/app icon set (`favicon.ico`, `icon.png`, `apple-icon.png`) generated from the real Ru'ya logo, composited onto an AAAH teal-gradient rounded tile — distinct from AAAH's own site favicon, per user request. Verified live on `ruya2026.vercel.app`.
- Found and fixed a Turbopack dev-cache bug along the way: this repo's OneDrive-synced folder corrupts Turbopack's dev filesystem cache (on by default since Next 16.1), crashing `next dev`. Disabled via `next.config.ts` — unrelated to the favicon but blocked local testing until fixed.
- Shipped a `manifest.ts` for Android/desktop install icons, then removed it same day — it broke iPad "Add to Home Screen" for `/controller?lane=1|2`, since iOS always launches manifest-declared web apps at the manifest's `start_url`, not the page that was open. `apple-touch-icon` alone (no manifest) is sufficient for this project.
- Diagnosed a reported "lane 1 and 2 controllers control each other" bug — traced thoroughly (local + production, code review, live reproduction) with no cross-talk found; root cause turned out to be a URL typo on one iPad (`?=lane2` instead of `?lane=2`), not a code issue.
- Fixed missing answer images on Arabic for 4 existing visual questions (Architecture & Design Q6, Legal & Compliance Q6, Operations & Supply Chain Q4, Marketing Q9) — these had `image_url` set for English only, by an earlier deliberate decision, with Arabic falling back to text. Same image URLs now written to both language rows.
- Fixed HR Q9 having no images in either language, despite an earlier session log claiming this was already done — the storage bucket never had them. Uploaded the 3 images (from user-supplied local file paths in an updated `Question Matrix.csv`) to Supabase Storage and patched both EN and AR rows.
- Git push stopped working mid-session: Windows Git Credential Manager had a stale login for a different GitHub account (`ssd-aaai`) with no access to this repo. Cleared via `cmdkey /delete` + `git credential-manager erase`; user completed a fresh OAuth login in the Chrome profile signed into `charmenlondon-cmd`. Push succeeded after.
- Installed Node.js LTS + npm on this machine via winget (previously absent) to enable local `next dev` testing.

### 2026-09-16
- Read Manal Alblooshi's (Naresco) 2026-09-15 email flagging "alignment and space removal" issues on the display screen for 35 Arabic answer options across 8 tracks (Engineering, Finance, Architecture & Design, HR, IT, Legal & Compliance, Marketing, Project Management).
- Confirmed via direct byte-for-byte comparison that live Supabase text and the original `Arabic Question Matrix.csv` were identical for all 35 flagged fields — the underlying text was never wrong.
- Found the real cause: `src/components/display/QuestionScreen.tsx`'s answer-options grid is deliberately `dir="ltr"` (keeps A/B/C cards left-to-right regardless of language), but the answer `<p>` text had no `dir` of its own, so Arabic content inherited the LTR base direction — breaking the bidi algorithm's placement of trailing punctuation, hyphens, and embedded Latin terms/brand names.
- Fixed by setting `dir={language === 'ar' ? 'rtl' : 'ltr'}` + `lang={language}` on the answer text element. Verified with before/after screenshots via `npm run dev` and a live Supabase test session (Engineering Q6, Marketing Q2) — confirmed visually fixed (e.g. a trailing period no longer glued to the wrong side of the line).
- Committed (`ff2abff`), pushed to `main`, and confirmed live on `ruya2026.vercel.app`.
- Closed the long-standing "Finance Q9 Arabic wording" deferred item (open since 2026-09-07, never actioned) — per user: Sana's truncated comment was actually a request to convert Q9 into a picture question, not a text rewrite, so there was never anything to apply. Removed from Deferred Issues; do not re-raise.

### 2026-09-27 — Event day: live TV compatibility fixes on-site

User was on-site at the careers fair with the displays live. A chain of issues surfaced one at a time on one of the venue's TVs (a cheap Geepas smart TV/Android TV box) as they were found, each diagnosed and pushed live within the session:

1. **Display rendered completely unstyled** (default serif font, no colours, no layout) on that TV, even though session data was correct. Root cause: Tailwind v4 wraps its generated CSS in `@layer` blocks (Chromium 99+, 2022); the TV's frozen/outdated bundled browser doesn't recognise `@layer` and discards the entire block rather than degrading gracefully. Fixed with `@csstools/postcss-cascade-layers` (flattens `@layer` into plain CSS, no visual change on modern browsers).
2. **Push blocked by a stale Windows git credential** for a different GitHub account (`ssd-aaai`) — same issue as 2026-09-14. Cleared via `cmdkey /delete` (PowerShell), fresh OAuth login resolved it.
3. **TV overscan/zoom cropped the bottom of the display** (confirmed top was always fully visible, only the bottom was cut). Added a scale-down wrapper to `/display` (default 90%, `transform-origin: top center` so only the bottom margin grows), then a slider + presets in the admin panel to tune it live per lane via Supabase Realtime Broadcast (no DB migration) with localStorage persistence on the receiving TV.
4. **Track decoration image collided with the header** on some tracks — each track's floating card-top decoration pokes up a different amount (83–192px depending on the Lottie asset); reserved clearance was only ~32px. Increased to a fixed buffer, later reduced once decorations were also shrunk.
5. **User feedback: everything felt too large/cramped for a wide-but-short TV screen.** Did a compacting pass: shrunk all 10 tracks' decorative Lottie icons to ~70%, shrunk the question card/answer cards/badges/images/fonts/gaps in `QuestionScreen`.
6. **Root cause found for a decoration icon appearing clipped behind an answer card:** all 10 tracks positioned their background icon via `right: calc(50% - ~512px)`, a formula that only lands correctly beside the content column on an *exact* 1920px-wide viewport. Replaced with positioning scoped to the actual content column (not the full screen) — required two iterations based on live feedback: first attempt tucked the icon *behind* the cards (wrong — user wanted it visible), corrected to anchor `top: calc(100% + 5px); right: 0` relative to the content column, matching the original pre-session look (visible, below, right-aligned).
7. **Added a "Full Screen" button** to `/display` — venue TV browsers show their own address bar; Fullscreen API requires a real tap, so auto-hiding isn't possible. Small tap-once button added; separately, the TV's own browser turned out to have a native fullscreen toggle in its menu once "Desktop site" was enabled.
8. **Enlarged the top bar ~50%** (avatar/name/track/question counter) without shifting the question card/answers beneath it, using an invisible-spacer + absolute-overlay technique — reusable if the same kind of "resize without reflowing" request comes up again.
9. **Hired-network ("screensaver") screen looked shrunk into a small box instead of filling the TV.** It was being rendered through the same TV-safe scale wrapper as the quiz screens, which made sense for protecting quiz buttons/text from overscan but had no benefit for a pure ambient animation. Made `HiredNetworkScreen`/`ScreensaverScreen` render at true full screen size, bypassing the scale entirely — confirmed correct by checking the component measures its own container's actual pixel size for avatar placement, so it now genuinely fills the real screen.
10. **User reported "Force Screensaver works on lane 2 but not lane 1."** First theory: a stale Supabase Realtime WebSocket connection on lane 1's display (added a 5s polling fallback in `useSession` as a resilience improvement — reasonable to keep, but turned out not to be the actual cause). User pushed back with the precise symptom: clicking Force Screensaver showed the plain branded "pick up the iPad" screen, not the animated network with floating avatar icons, and only switched over after the full 60-second timer. That pinpointed the real bug: the display treated the admin-only `'screensaver'` state exactly like the natural `'idle'` pause between players — both waited 60s before showing the network animation. Lane 2 only "worked" because it happened to already be past that 60s window. Fixed by making `'screensaver'` (which nothing but that button ever sets) bypass the timer and show the network immediately, while natural idle pauses keep the original delayed transition. Verified by clicking Force Screensaver on the live production admin panel and watching lane 1's display switch instantly.

Every fix was verified visually (either via Claude in Chrome against the live production URL, or against a local production build) and confirmed deployed on `ruya2026.vercel.app` before telling the user to check the venue TV. `FinalResultScreen` and `WaitingScreen` were not touched — only `QuestionScreen` — in case similar sizing issues show up there later in the event.

*Last updated: 2026-09-27*
