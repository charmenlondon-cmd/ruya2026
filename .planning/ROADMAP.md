# Roadmap: Ruya Careers Fair 2026 — Interactive Game

## Overview

Seven phases build a two-screen interactive careers fair game: an iPad controller and a large display screen communicating via Supabase Realtime. Starting with the Next.js scaffold and Supabase schema, the project progresses through the session state engine, question loading, both screen UIs, the animated hired network, and finally admin tooling and Vercel deployment.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js scaffold, Supabase schema, AAAH branding, route layout
- [x] **Phase 2: Realtime Game Engine** - Session state machine, Supabase Realtime channel, controller↔display sync
- [x] **Phase 3: Question Engine** - Load questions from Supabase, CSV seed script, image-answer support
- [x] **Phase 4: Controller UI** - iPad: language/avatar/name/track selection + quiz A/B/C buttons + RTL
- [ ] **Phase 5: Display Screen** - Question display, player info, results screen, screensaver mode
- [ ] **Phase 6: Hired Network** - D3/Canvas animated "hired" visualization growing through the day
- [ ] **Phase 7: Admin Panel & Deploy** - /admin controls, session management, Vercel deployment

## Phase Details

### Phase 1: Foundation
**Goal**: Working Next.js app with Supabase connected, AAAH branding applied, and all routes scaffolded (/controller, /display, /admin)
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard Next.js + Supabase scaffold patterns)
**Plans**: TBD

Plans:
- [x] 01-01: Next.js App Router project init with TypeScript, Tailwind, and folder structure
- [x] 01-02: Supabase schema (sessions, questions, hires tables) + client setup
- [x] 01-03: AAAH branding (Montserrat font, teal palette, logo assets, base layout)

### Phase 2: Realtime Game Engine
**Goal**: Full session state machine running with controller and display synced in real time via Supabase Realtime
**Depends on**: Phase 1
**Research**: Likely (Supabase Realtime — broadcast vs presence patterns, channel setup)
**Research topics**: Supabase Realtime channels API, broadcast vs presence, reconnect handling, channel naming strategy
**Plans**: TBD

Plans:
- [x] 02-01: Session state machine (idle → language_select → ... → screensaver) with Supabase persistence
- [x] 02-02: Supabase Realtime channel — controller broadcasts state, display subscribes and mirrors

### Phase 3: Question Engine
**Goal**: All 100 questions loadable from Supabase with Arabic support and image-based answers working
**Depends on**: Phase 1
**Research**: Unlikely (standard DB queries once schema exists)
**Plans**: TBD

Plans:
- [x] 03-01: CSV seed script — parse Question Matrix.csv and seed all 100 questions (EN + AR) to Supabase
- [x] 03-02: Question loader — fetch questions by track and language at runtime, with image-answer URL support

### Phase 4: Controller UI
**Goal**: Full iPad controller flow from language selection through quiz completion, with Arabic RTL throughout
**Depends on**: Phase 2, Phase 3
**Research**: Unlikely (internal React UI, established component patterns)
**Plans**: TBD

Plans:
- [x] 04-01: Onboarding flow — language select, avatar select (10 avatars), name entry, track select (10 tracks)
- [x] 04-02: Quiz interface — A/B/C answer buttons, question number indicator, answer submission
- [ ] 04-03: Arabic RTL layout — full RTL support across all controller screens

### Phase 5: Display Screen
**Goal**: Large display shows live question state, player info, results, and screensaver — all driven by Realtime sync
**Depends on**: Phase 2, Phase 3
**Research**: Unlikely (internal React UI)
**Plans**: TBD

Plans:
- [ ] 05-01: Question display — current question, answer options, player info panel
- [ ] 05-02: Result screens — "You're Hired" and "We'll Get Back to You" with branding
- [ ] 05-03: Screensaver mode — idle state with AAAH branding animation

### Phase 6: Hired Network
**Goal**: Animated visualization on the display screen shows hired players clustered by track around the AAAH logo, growing through the day
**Depends on**: Phase 5
**Research**: Likely (D3.js + Canvas + Framer Motion — complex animated visualization)
**Research topics**: D3 force simulation on Canvas, Framer Motion + Canvas interop, SVG vs Canvas for 100+ nodes, smooth node entry animations
**Plans**: TBD

Plans:
- [ ] 06-01: Static hired network — render avatar nodes clustered by track around AAAH logo
- [ ] 06-02: Live growth — new hires animate in when players score 7–10, network updates in real time

### Phase 7: Admin Panel & Deploy
**Goal**: Admin panel operational with full session control, and app deployed to Vercel
**Depends on**: Phase 6
**Research**: Unlikely (standard admin UI, Vercel config is well-documented)
**Plans**: TBD

Plans:
- [ ] 07-01: Admin panel — start/reset session, clear player, clear hires, screensaver toggle, session state viewer
- [ ] 07-02: Vercel deployment — env vars, project config, production smoke test

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-07-03 |
| 2. Realtime Game Engine | 2/2 | Complete | 2026-07-06 |
| 3. Question Engine | 2/2 | Complete | 2026-07-06 |
| 4. Controller UI | 3/3 | Complete | 2026-07-31 |
| 5. Display Screen | 0/3 | Not started | - |
| 6. Hired Network | 0/2 | Not started | - |
| 7. Admin Panel & Deploy | 0/2 | Not started | - |
