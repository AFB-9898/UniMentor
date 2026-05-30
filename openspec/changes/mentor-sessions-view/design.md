# Design: Mentor Sessions View with Student Names

## Technical Approach

Three-layer fix: (1) widen `listByUser` filter to match both participant roles, (2) wire `SessionProvider` to real auth user instead of hardcoded `"student-1"`, (3) introduce `userService` for display name resolution. Components consume names via a single `getUserName()` utility — no new context or prop drilling.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `listByUser` uses OR filter vs. two separate methods | OR keeps API simple; separate methods anticipate role-specific queries later | **OR filter** — MVP scope doesn't warrant split |
| Inline name map vs. `userService` module | Inline is faster but duplicates across components (MySessionsPage already has its own) | **`userService`** — single source of truth, directly testable |
| `getUserName` in SessionContext vs. component-level | Context would couple session data to display concerns | **Component-level** — pure function, no wiring overhead |
| MySessionsPage reads `useAuth()` vs. receiving role as prop | Prop would require App.tsx changes for no benefit | **`useAuth()` directly** — minimal coupling, existing pattern |

## Data Flow

```
AuthProvider (resolves user.id)
       │
       ▼
SessionProvider — gates on !isLoading → listByUser(user.id)
       │                              (returns sessions where user is student OR mentor)
       ▼
Component (reads sessions from useSessions())
       │
       ├─ MentorDashboard → getUserName(session.studentId)  [student name in card]
       └─ MySessionsPage  → getUserName(role === "mentor" ? session.studentId : session.mentorId)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/sessionService.ts` | Modify | `listByUser` filter: `s.studentId === userId \|\| s.mentorId === userId` |
| `src/hooks/SessionContext.tsx` | Modify | Import `useAuth()`, gate on `isLoading`, call `listByUser(user.id)` |
| `src/services/userService.ts` | Create | `getUserName(id)` with seed name map; fallback `"Usuario desconocido"` |
| `src/components/screens/MentorDashboard.tsx` | Modify | Import `getUserName`, render student name in each session card |
| `src/components/screens/MySessionsPage.tsx` | Modify | Import `useAuth()` + `getUserName`, conditional display by role |

## Interfaces / Contracts

```typescript
// src/services/userService.ts
const nameMap: Record<string, string> = {
  "student-1": "Ana López",
  "1": "Carlos Mendoza",
  "2": "María García",
  "3": "Luis Torres",
  "s1": "Abraham Estudiante",
};

export function getUserName(id: string): string;
// Returns nameMap[id] ?? "Usuario desconocido"
```

**SessionProvider contract change**: `useEffect` now depends on `[user, isLoading]` instead of `[]`.

```typescript
// Before
useEffect(() => { mockSessionService.listByUser("student-1").then(setSessions); }, []);

// After
const { user, isLoading } = useAuth();
useEffect(() => {
  if (isLoading || !user) return;
  mockSessionService.listByUser(user.id).then(setSessions);
}, [user, isLoading]);
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `listByUser` returns mentor-matched sessions | `await import`, assert mentorId in results |
| Unit | `listByUser` still returns student-matched sessions | Assert existing student query backward compat |
| Unit | `getUserName` known ID → returns name | Direct call, expect mapped name |
| Unit | `getUserName` unknown ID → returns fallback | Direct call, expect `"Usuario desconocido"` |
| Integration | SessionContext loads by user.id | Mock `useAuth`, assert `listByUser` call with correct ID |
| Integration | SessionContext gates on isLoading | Mock `isLoading: true`, assert no fetch |
| Integration | SessionContext empty for unauthenticated | Mock `user: null`, assert sessions empty |
| Integration | MentorDashboard shows student name | Mock context+auth, render, assert student name in card |
| Integration | MySessionsPage shows student name for mentor role | Mock `role: "mentor"`, assert `getUserName(session.studentId)` rendered |
| Integration | MySessionsPage shows mentor name for student role | Mock `role: "student"`, assert existing mentor name behavior |

## Migration / Rollout

No migration required. Seed data already includes both mentor and student references. The new `userService` name map covers all existing user IDs.

## Open Questions

None — all decisions documented. The seed data has `studentId: "student-1"` while auth mock student uses `id: "s1"` (existing mismatch), but `userService` includes both entries so name resolution works regardless.
