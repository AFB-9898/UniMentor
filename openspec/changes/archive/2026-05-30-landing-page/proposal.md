# Proposal: Public Landing Page

## Intent

Convert `/` from an auth-gated redirect router into a public landing page. Protected screens move under `/app/*` so unauthenticated visitors can browse mentors without signing up.

## Motivation

Currently, all unauthenticated traffic to `/` bounces to `/login`. This blocks the product's core value — mentor discovery — before users can evaluate the platform.

## Current vs Desired

| Aspect | Current | Desired |
|--------|---------|---------|
| `/` | HomePageRouter → /login | Public LandingPage (Header+Hero+MentorGrid+Footer) |
| Protected routes | Scattered under `/` | Grouped under `/app/*` |
| `/mentors` | 404 | Public mentor grid |
| Login redirect | → `/` (broken for unauthenticated) | → `/app` |
| Shared layout | None | AppLayout (Header+Footer) |

## Scope

### In Scope
- New screens: `LandingPage` at `/`, `MentorsPage` at `/mentors`
- New components: `Header`, `Hero`, `MentorGrid`, `Footer`, `AppLayout`
- Route restructure: `/` → public, `/app/*` → protected, `/mentors` → public
- Update redirect targets (login → `/app`, logout → `/`)
- Reuse `UserProfileCard` in MentorGrid

### Out of Scope
- Auth UI/logic changes
- Mentor search/filtering (plain grid only)
- E2E or visual regression tests
- Backend/API integration

## Capabilities

### New Capabilities
- `public-landing`: Public landing at `/` with Header, Hero, mentor showcase, Footer
- `mentor-browsing`: Public mentor grid at `/mentors` via `UserProfileCard`

### Modified Capabilities
None — existing specs (`mentor-profile-edit`, `mentor-sessions-view`) are unaffected.

## Approach

1. Create `AppLayout` (Header + Footer + `<Outlet />`)
2. Build `LandingPage` (Hero + MentorGrid sections + CTA)
3. Build `MentorsPage` (grid of `UserProfileCard` + `RatingStars`)
4. Wrap protected routes under `/app` with `AppLayout` + `ProtectedRoute`
5. Update login/register redirects to `/app`; update auth guards
6. Move `HomePageRouter` logic into `/app` route

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/App.tsx` | Modified | Route restructure: `/`=LandingPage, `/app/*`=protected |
| `src/components/screens/LoginPage.tsx` | Modified | Login redirect `/` → `/app` |
| `src/components/screens/RegisterPage.tsx` | Modified | Register redirect `/` → `/app` |
| `src/shared/components/ProtectedRoute.tsx` | Modified | Redirect paths `/` → `/app` |
| `src/components/screens/StudentDashboard.tsx` | Moved | Route to `/app` |
| `src/components/screens/MentorDashboard.tsx` | Moved | Route to `/app/dashboard` |
| `src/components/screens/MySessionsPage.tsx` | Moved | Route to `/app/my-sessions` |
| `src/components/screens/BookingPage.tsx` | Moved | Route to `/app/book/:mentorId` |
| `src/components/screens/RatingPage.tsx` | Moved | Route to `/app/rate/:sessionId` |
| New components | New | `LandingPage`, `MentorsPage`, `Header`, `Hero`, `MentorGrid`, `Footer`, `AppLayout` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Broken redirect chain | Medium | Audit all `navigate("/")` calls; test login→/app, logout→/ |
| Old bookmarks to `/dashboard` break | Medium | Add `/dashboard` as alias for `/app/dashboard` |
| SessionContext at `/app/*` | Low | Already handles unauthenticated state (returns []) |

## Rollback Plan

- Revert `src/App.tsx` to current route config
- Revert redirects in `LoginPage.tsx`, `RegisterPage.tsx`, `ProtectedRoute.tsx`
- Delete new component files

## Dependencies

- react-router-dom v7 (already installed)
- `UserProfileCard`, `RatingStars` (already exist)

## Success Criteria

- [ ] Unauthenticated visitor sees LandingPage at `/` (no redirect)
- [ ] `/mentors` shows all 3 mock mentors as cards
- [ ] Login redirects to `/app` (student) or `/app/dashboard` (mentor)
- [ ] `/app/*` routes require auth; unauthorized → `/login`
- [ ] Logout → `/` (LandingPage)
- [ ] `MentorProfilePage` at `/mentor/:id` still works
- [ ] `npm run build` passes with zero errors
- [ ] `npm run test` passes
