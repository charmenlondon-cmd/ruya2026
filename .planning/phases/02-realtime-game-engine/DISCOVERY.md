# Discovery: Phase 02 — Realtime Game Engine

**Level:** 1 (Quick Verification — inline from training data on @supabase/supabase-js v2)
**Date:** 2026-07-03

---

## Question 1: Broadcast vs postgres_changes for session state sync

**Decision: postgres_changes on the sessions table**

**Rationale:**

| Factor | postgres_changes | broadcast |
|--------|-----------------|-----------|
| Persistence | DB-backed (session survives disconnect) | Ephemeral (lost on disconnect) |
| Reconnect recovery | Display re-fetches current row on mount | Misses events while disconnected |
| Already configured | sessions in supabase_realtime publication ✓ | Requires channel.send() call |
| Latency | ~100–300ms (DB write + CDC) | ~50–100ms (direct) |
| Source of truth | DB is always authoritative | Channel message is authoritative |

For game state that must survive tab refresh, network blip, or display reconnect — postgres_changes wins. The ~200ms extra latency is imperceptible in a careers fair game.

**Pattern:**
```typescript
supabase
  .channel('game-session')
  .on('postgres_changes', {
    event: '*',           // INSERT + UPDATE
    schema: 'public',
    table: 'sessions',
    filter: `id=eq.${sessionId}`
  }, (payload) => {
    setSession(payload.new as Session)
  })
  .subscribe()
```

---

## Question 2: Session discovery — how does display find the active session?

**Decision: Both pages call getActiveSession() on mount, display subscribes to updates on that session ID**

There is always exactly one active session at a time (enforced by game flow). Both controller and display independently fetch the most recent session row on mount.

For the integration proof (Phase 2), controller creates a new session on mount; display reads the latest session and subscribes to its changes.

For robustness (implemented in useSession hook): also subscribe to INSERT events on the sessions table so display auto-discovers if a new session is created.

---

## Question 3: Reconnect handling

**Decision: Supabase client handles reconnect automatically; hook re-fetches on remount**

- `@supabase/supabase-js` v2 automatically reconnects the WebSocket on drop
- The hook does a fresh `getActiveSession()` on `useEffect` mount — catches any updates missed during disconnect
- No manual reconnect logic needed beyond standard React cleanup (unsubscribe on unmount, re-subscribe on remount)

---

## Question 4: Channel naming strategy

**Decision: Fixed channel name `game-session`**

One display + one controller pair, one active session at a time. A fixed channel name keeps setup simple. If multiple concurrent sessions were needed (they're not), the channel would be `session:${id}`.

---

## Summary of Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Realtime mechanism | postgres_changes | DB-backed, persistent, reconnect-safe |
| Session discovery | getActiveSession() on mount | Simple, no coordination needed |
| Reconnect strategy | Re-fetch on remount | Supabase auto-reconnects, hook catches drift |
| Channel name | `game-session` | Fixed, one session at a time |
| State transitions | updateSession() with partial patch | Flexible, works for all 10 state transitions |
