# Tasks: Inline Mentor Profile Edit

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200-300 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Service Layer (TDD)

- [x] 1.1 RED: Add tests for `updateProfile` in `mentorService.test.ts` — success returns updated Mentor; invalid id rejects
- [x] 1.2 GREEN: Add `updateProfile(id, data)` to `MentorService` interface + `mockMentorService` — mutate in-memory array

## Phase 2: Component Tests (TDD)

- [x] 2.1 RED: Create `MentorProfilePage.test.tsx` — ownership gating (R1), bio paragraph↔textarea (R2), specialty add/remove (R3)
- [x] 2.2 RED: Add tests for save calls service (R4), cancel revert (R5), loading disables (R6), error inline (R7), double-save guard (R8)

## Phase 3: Component Implementation

- [x] 3.1 GREEN: Add `useAuth`, ownership check, edit state (`isEditing`, `draftBio`, `draftSpecialties`, `isSaving`, `saveError`) to `MentorProfilePage.tsx`
- [x] 3.2 GREEN: Add inline bio editor — paragraph↔textarea toggle on Edit/Cancel with placeholder for empty state
- [x] 3.3 GREEN: Add inline specialties editor — tag add/remove controls visible only in edit mode
- [x] 3.4 GREEN: Wire save (`updateProfile`) and cancel (revert originals), with `isSaving` loading guard and inline error display

## Phase 4: Verification

- [x] 4.1 Run `npm run test` — all tests pass (74 tests, 10 suites)
- [x] 4.2 Run `npm run build` — no type errors (Vite build ✅)
