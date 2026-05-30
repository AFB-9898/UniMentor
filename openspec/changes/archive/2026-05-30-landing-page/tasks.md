# Tasks: Public Landing Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~700–850 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Components + Routes (~400 lines) → PR 2: Redirects + Tests (~350 lines) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + Components + Route Restructuring | PR 1 | Target: main. All new components + App.tsx restructure. Component tests included. |
| 2 | Redirect Migration + Integration Tests | PR 2 | Target: main. All 11 redirect targets + integration/redirect tests. |

> **TDD note**: `strict_tdd: true` in config — write the test (RED) before each implementation (GREEN), then refactor. Tests are listed in Phase 5 for organizational clarity, not execution order.

## Phase 1: Foundation
- [ ] 1.1 Expand `mockMentors` from 3→6 entries (`src/data/mockMentors.ts`)
- [ ] 1.2 Add optional `className` prop to ThemeToggle (`src/components/atoms/ThemeToggle.tsx`)

## Phase 2: New Components
- [ ] 2.1 Create `Header` organism — nav with logo, links (Home, Mentores), ThemeToggle, auth buttons or user avatar (`src/components/organisms/Header.tsx`)
- [ ] 2.2 Create `Hero` molecule — value proposition + CTA ("Explorar mentores") (`src/components/molecules/Hero.tsx`)
- [ ] 2.3 Create `Footer` organism — links + copyright (`src/components/organisms/Footer.tsx`)
- [ ] 2.4 Create `MentorGrid` organism — grid of UserProfileCards, loading skeleton, empty state (`src/components/organisms/MentorGrid.tsx`)
- [ ] 2.5 Create `AppLayout` — Header + `<Outlet />` + Footer (`src/components/organisms/AppLayout.tsx`)
- [ ] 2.6 Create `LandingPage` — compose Hero + MentorGrid + Footer (`src/components/screens/LandingPage.tsx`)
- [ ] 2.7 Create `MentorsPage` — full MentorGrid under AppLayout (`src/components/screens/MentorsPage.tsx`)

## Phase 3: Route Restructuring
- [ ] 3.1 Restructure `App.tsx`: `/`→LandingPage, `/mentors`→MentorsPage (public), `/app/*`→protected routes
- [ ] 3.2 Move `SessionProvider` inside `/app/*` route group only (NFR1 — no session fetch for public pages)

## Phase 4: Redirect Migration
- [x] 4.1 Update `LoginPage.tsx` + `RegisterPage.tsx`: `navigate("/")`→`navigate("/app")`
- [x] 4.2 Update `ProtectedRoute.tsx`: wrong-role + PublicOnly redirects → `/app`
- [x] 4.3 Update `BookingPage.tsx`: `/my-sessions`→`/app/my-sessions`, `to="/"`→`to="/app"`
- [x] 4.4 Update `RatingPage.tsx`: all `/my-sessions`→`/app/my-sessions` (8 link occurrences)
- [x] 4.5 Update `MySessionsPage.tsx`: `to="/"`→`to="/app"` (3 links)
- [x] 4.6 Update `StudentDashboard.tsx`: links + navigate to `/app` prefix
- [x] 4.7 Update `MentorDashboard.tsx` + `MentorProfilePage.tsx`: redirects to `/app` prefix

## Phase 5: Tests
- [x] 5.1 Test `Header`: login/register when unauth, user name+avatar when authed
- [x] 5.2 Test `MentorGrid`: loading skeleton, empty state message, renders mentor cards
- [x] 5.3 Test `LandingPage`: renders Hero + MentorGrid + Footer sections
- [x] 5.4 Test `MentorsPage`: renders all mentors grid under AppLayout
- [ ] 5.5 Integration: login redirects to `/app`, register redirects to `/app`
- [ ] 5.6 Integration: unauthenticated `/app/*` redirects to `/login`
- [x] 5.7 `npm run build` + `npm run test` pass (zero errors, all green)
