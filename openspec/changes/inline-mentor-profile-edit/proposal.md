# Proposal: Inline Mentor Profile Edit

## Intent

Mentors cannot update their bio or specialties through the UI today. They need inline editing on their own profile page to change these fields without navigating to a separate form — reducing friction and keeping the profile workflow self-contained.

## Scope

### In Scope
- Edit-mode toggle for the bio section (paragraph → textarea)
- Tag-based specialty editor (add new tag, remove existing tag)
- Save/Cancel controls with local state persistence via mock service
- Ownership check: edit mode only when `useAuth().user.id === mentorId`
- `updateProfile` method on `MentorService` interface + mock
- Tests for edit flow, ownership gating, save/cancel revert, loading/error states

### Out of Scope
- Avatar upload or image editing
- Full profile settings page
- Backend/InsForge integration — stays on mock service
- Password, email, or role changes
- Session booking flow changes

## Capabilities

### New Capabilities
- `mentor-profile-edit`: inline editing of bio (textarea) and specialties (tag add/remove) on the mentor's own profile page, with save and cancel controls

### Modified Capabilities
- None (no existing specs in `openspec/specs/`)

## Approach

Extend `MentorProfilePage` with local edit state (`isEditing`, draft fields). On mount, compare `useAuth().user.id` to the route `mentorId`. When they match, render an "Edit" button in the bio and specialties sections. Clicking it switches those sections to editable controls. Save calls `mockMentorService.updateProfile()` and updates local state. Cancel reverts to the original `mentor` values. Follow Strict TDD: write component and service tests first, then implement.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/services/mentorService.ts` | Modified | Add `updateProfile(id, data)` to interface + mock |
| `src/services/mentorService.test.ts` | Modified | Tests for `updateProfile` (success, invalid id) |
| `src/components/screens/MentorProfilePage.tsx` | Modified | Add edit mode, inline editors, save/cancel |
| `src/components/screens/MentorProfilePage.test.tsx` | New | Tests: ownership gating, edit/save/cancel flow, render states |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Auth state not yet resolved when page mounts | Low | Show read-only until auth resolves; no edit button flash |
| Mock data lost on reload after edit | Low | Acceptable for MVP — InsForge integration is deferred |
| Bio textarea layout shift | Low | Use `min-h` + consistent padding to match read-only height |

## Rollback Plan

Revert `MentorProfilePage.tsx` and `mentorService.ts`. Delete `MentorProfilePage.test.tsx`. If conflicts, restore from `main` via `git checkout main -- <files>`.

## Dependencies

- Issue #19 scope acceptance
- `useAuth()` must expose the current user with a stable `id`

## Success Criteria

- [ ] Mentor viewing own profile sees Edit button and can toggle edit mode on bio + specialties
- [ ] Other users viewing the same profile see read-only (no Edit button)
- [ ] Save persists via `updateProfile`; Cancel restores original values
- [ ] All new and existing tests pass: `npm run test`
