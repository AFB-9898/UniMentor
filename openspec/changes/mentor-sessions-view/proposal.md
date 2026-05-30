# Proposal: Mentor Sessions View with Student Names

## Intent

Mentors see no student names in their dashboard — `SessionContext` hardcodes `"student-1"` and `listByUser` only filters by `studentId`, so mentors can't even find their own sessions. The dashboard shows topic + date but no student name, making it unusable for mentors.

## Scope

### In Scope
- Fix `listByUser` to return sessions where the user is EITHER student OR mentor
- Wire `SessionContext` to use authenticated user ID from `useAuth()`
- Add student name resolution to session display
- Update `MentorDashboard` to show student name per session card
- Update `MySessionsPage` to show student name when user is a mentor
- Add a user lookup utility (names aren't on the Session type)
- Tests for all changes

### Out of Scope
- Real-time session updates
- Backend migration to InsForge
- Student avatar display in session cards
- Session cancellation by mentors

## Capabilities

### New Capabilities
- `mentor-sessions-view`: mentors can view their filtered sessions and see student names; `listByUser` returns sessions for both participant roles

### Modified Capabilities
- None — no existing session spec at the requirement level

## Approach

1. **`sessionService.listByUser`**: change filter from `s.studentId === userId` to `s.studentId === userId || s.mentorId === userId`
2. **`SessionContext`**: remove hardcoded `"student-1"`, use `user.id` from `useAuth()` (AuthProvider wraps SessionProvider in the tree)
3. **`userService.ts`** (new): provide `getUserName(id)` with a seed name map for mock data
4. **`MentorDashboard`**: render `studentName` (via `getUserName(session.studentId)`) in each upcoming session card
5. **`MySessionsPage`**: conditional display — show mentor name for student role, student name for mentor role
6. **Strict TDD**: write tests before implementation, update existing `sessionService.test.ts`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/services/sessionService.ts` | Modified | `listByUser` filters by both role IDs |
| `src/hooks/SessionContext.tsx` | Modified | Reads `user.id` from AuthContext |
| `src/components/screens/MentorDashboard.tsx` | Modified | Shows student name per session |
| `src/components/screens/MySessionsPage.tsx` | Modified | Conditional name by user role |
| `src/services/userService.ts` | New | Name lookup utility |
| `src/services/sessionService.test.ts` | Modified | Add mentor-filter tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Auth not ready when sessions load | Low | Gate on `!isLoading` from `useAuth()` |
| Circular context dependency | Low | `useAuth()` inside `SessionProvider` — tree is already linear |

## Rollback Plan

Revert to last working commit. All changes are frontend-only mock data — no database or persistent state.

## Dependencies

- `useAuth().user.id` must be available before session load
- `AuthProvider` must wrap `SessionProvider` in the component tree

## Success Criteria

- [ ] Mentor logs in → sees upcoming sessions with student names
- [ ] Student logs in → sees sessions with mentor names (unchanged)
- [ ] `listByUser("mentor-1")` returns sessions where mentorId matches
- [ ] All existing tests pass, new tests cover mentor-filter scenario
