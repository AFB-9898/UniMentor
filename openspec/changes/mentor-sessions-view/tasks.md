# Tasks: Mentor Sessions View

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200–280 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full mentor-sessions-view change | single PR | main branch; all changes + tests in one PR |

## Phase 1: Service Layer (TDD)

- [x] 1.1 [RED] Write tests for `getUserName(id)` — known ID → returns name, unknown → returns fallback
- [x] 1.2 [GREEN] Create `src/services/userService.ts` with `getUserName()` and seed name map
- [x] 1.3 [RED] Add test: `listByUser("1")` returns sessions where `mentorId === "1"`
- [x] 1.4 [GREEN] Modify `sessionService.listByUser` to OR filter: `s.studentId === userId \|\| s.mentorId === userId`
- [x] 1.5 Export `getUserName` from `src/services/index.ts`

## Phase 2: Context Layer (TDD)

- [x] 2.1 [RED] Write tests for `SessionContext` — loads by `user.id`, gates on `isLoading`, empty when unauthenticated
- [x] 2.2 [GREEN] Modify `SessionContext.tsx` — import `useAuth()`, gate on `!isLoading && user`, call `listByUser(user.id)`

## Phase 3: Component Layer (TDD)

- [x] 3.1 [RED] Write test: `MentorDashboard` renders student name in upcoming session cards
- [x] 3.2 [GREEN] Modify `MentorDashboard.tsx` — import `getUserName`, render student name per card
- [x] 3.3 [RED] Write test: `MySessionsPage` shows student name when `role=mentor`, mentor name when `role=student`
- [x] 3.4 [GREEN] Modify `MySessionsPage.tsx` — import `useAuth` + `getUserName`, conditional display by role

## Phase 4: Verification

- [x] 4.1 Run `npm run test` — all tests pass (existing + new)
- [x] 4.2 Run `npm run build` — no type errors
