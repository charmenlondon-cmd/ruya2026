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

*Last updated: 2026-09-14*
