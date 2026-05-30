# Public Landing Page Specification

## Purpose

Convert `/` from an auth-gated redirect router into a public landing page. Protected screens move under `/app/*` so visitors can browse mentors without signing up.

## Route Structure

| Path | Access | Component | Layout |
|------|--------|-----------|--------|
| `/` | Public | `LandingPage` (Hero+MentorGrid+Footer) | — |
| `/login` | Public-only | `LoginPage` | — |
| `/register` | Public-only | `RegisterPage` | — |
| `/mentors` | Public | `MentorsPage` | `AppLayout` |
| `/mentor/:id` | Public | `MentorProfilePage` | — |
| `/app` | Protected (student) | `StudentDashboard` | `AppLayout` |
| `/app/dashboard` | Protected (mentor) | `MentorDashboard` | `AppLayout` |
| `/app/book/:id` | Protected (student) | `BookingPage` | `AppLayout` |
| `/app/my-sessions` | Protected | `MySessionsPage` | `AppLayout` |
| `/app/rate/:id` | Protected (student) | `RatingPage` | `AppLayout` |

## Requirements

### R1: Public Landing Page

`/` MUST render `LandingPage` without requiring auth. Auth state MUST NOT affect the render.

- GIVEN any visitor — WHEN navigating to `/` — THEN LandingPage SHALL render (Header, Hero, MentorGrid, Footer)

### R2: Mentor Browsing

`/mentors` MUST show a grid of `UserProfileCard` components publicly.

- GIVEN any visitor at `/mentors` — THEN each mentor card SHALL show name, specialty, rating, and link to `/mentor/:id`
- GIVEN an empty mentor list — THEN an empty-state message SHALL display

### R3: Protected Routes Under `/app/*`

All `/app/*` routes MUST require auth. Unauthenticated visitors SHALL redirect to `/login`.

- GIVEN an unauthenticated visitor at `/app` — THEN redirect to `/login`
- GIVEN an authenticated student at `/app` — THEN render StudentDashboard
- GIVEN an authenticated mentor at `/app/dashboard` — THEN render MentorDashboard

### R4: Redirect Correctness

All post-auth redirects MUST point to the correct `/app/*` target.

| File | From | To | Trigger |
|------|------|----|---------|
| `LoginPage.tsx` | `navigate("/")` | `navigate("/app")` | Login success |
| `RegisterPage.tsx` | `navigate("/")` | `navigate("/app")` | Register success |
| `ProtectedRoute.tsx:30` | `<Navigate to="/">` | `<Navigate to="/app">` | Wrong role |
| `ProtectedRoute.tsx:48` | `<Navigate to="/">` | `<Navigate to="/app">` | Auth→PublicOnly |
| `BookingPage.tsx` | `/my-sessions` | `/app/my-sessions` | Booking done |
| `RatingPage.tsx` | `/my-sessions` | `/app/my-sessions` | Rating done |
| `StudentDashboard.tsx` | `/book/${id}` | `/app/book/${id}` | Book click |
| `MentorProfilePage.tsx` | `/book/${id}` | `/app/book/${id}` | Book click |
| `MySessionsPage.tsx` | `<Link to="/">` | `<Link to="/app">` | Inicio / CTAs |

Logout redirects (`navigate("/")`) in `StudentDashboard` and `MentorDashboard` MUST stay unchanged — they already target the landing page.

### R5: AppLayout

Protected pages MUST share `AppLayout` (Header + Footer + `<Outlet />`).

- GIVEN any protected route under `/app` — WHEN it renders — THEN Header at top and Footer at bottom SHALL wrap the content

### R6: Mock Data

`mockMentors` MUST contain at least 6 mentors for a compelling grid.

- GIVEN `mockMentors` is loaded — THEN at least 6 entries SHALL exist
- GIVEN LandingPage or MentorsPage — THEN all mentors SHALL render in the grid

## Non-Functional Requirements

- **NFR1** — Public routes MUST NOT be wrapped in `SessionProvider` (no session fetch for visitors)
- **NFR2** — `npm run build` MUST pass with zero errors
- **NFR3** — `npm run test` MUST pass with all existing tests green

## Acceptance Criteria

- [ ] AC1: Unauthenticated visitor sees LandingPage at `/` (no redirect)
- [ ] AC2: `/mentors` shows 6+ mentors as cards
- [ ] AC3: `/app` redirects unauthenticated → `/login`
- [ ] AC4: Login → `/app` (student) or `/app/dashboard` (mentor)
- [ ] AC5: Register → `/app`
- [ ] AC6: Logout → `/` (LandingPage)
- [ ] AC7: All `/app/*` routes render inside AppLayout
- [ ] AC8: `/mentor/:id` remains public and unchanged
- [ ] AC9: Public routes skip SessionProvider
- [ ] AC10: `npm run build` and `npm run test` pass
