# Design: Public Landing Page

## Technical Approach

Restructure routes into two groups (public + protected under `/app/*`), introduce `AppLayout` with `<Outlet/>` as the shared shell, and build `LandingPage` + `MentorsPage` screens composing existing atoms/organisms. Scope `SessionProvider` to protected routes only. This maps directly to the proposal's 6-step approach and satisfies specs R1–R6 + NFR1.

## Architecture Decisions

### Decision: Route structure

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `/` → LandingPage, `/app/*` → protected | Breaks existing bookmarks to `/dashboard`; needs redirect audit | ✅ **Chosen** — cleanest public/protected boundary, matches proposal |
| Keep `/` as-is, move landing to `/landing` | No bookmark breakage but `/` redirect remains confusing | ❌ Rejected — `/` is the canonical public entry point |
| `SessionProvider` wraps all routes | Simpler, but fetches sessions on every public visit | ❌ Violates NFR1 |
| `SessionProvider` scoped to `/app/*` | Requires splitting `<Routes>` into groups | ✅ **Chosen** — avoids unnecessary session fetch for visitors |

### Decision: AppLayout composition

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `Header + <Outlet/> + Footer` via `react-router-dom` layout routes | Cleanest — layout renders once, child routes fill `<Outlet/>` | ✅ **Chosen** — follows react-router v7 layout route pattern |
| Each screen imports Header/Footer individually | Duplicate imports, easy to forget either component | ❌ Rejected — violates DRY |

### Decision: SessionProvider scoping

Wrap `SessionProvider` inside the protected route group, not at the AppContent root. This means `LandingPage` and `MentorsPage` never trigger a session fetch (NFR1).

### Decision: Mock data expansion

`mockMentors` grows from 3 → 6 entries (R6). Added entries mirror existing structure (id, name, email, specialty, rating, sessionCount). No new types needed.

## Component Tree

```
<App>
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          ┌─ Public routes (no SessionProvider)
          ├── "/" → <LandingPage>
          │             ├── <Header>
          │             ├── <Hero>
          │             ├── <MentorGrid>
          │             │     └── <UserProfileCard> × N
          │             │           └── <RatingStars>
          │             └── <Footer>
          ├── "/mentors" → <AppLayout>
          │     ├── <Header>
          │     ├── <MentorGrid>
          │     │     └── <UserProfileCard> × N
          │     └── <Footer>
          ├── "/mentor/:id" → <MentorProfilePage> (unchanged)
          ├── "/login" → <LoginPage> (redirect target updated)
          ├── "/register" → <RegisterPage> (redirect target updated)
          │
          └─ Protected routes (wrapped in SessionProvider)
             └── "/app/*" → <AppLayout>
                   ├── "/app" → <StudentDashboard>
                   ├── "/app/dashboard" → <MentorDashboard>
                   ├── "/app/book/:id" → <BookingPage>
                   ├── "/app/my-sessions" → <MySessionsPage>
                   └── "/app/rate/:id" → <RatingPage>
```

## Data Flow

```
mockMentors ──→ mockMentorService.list()
                     │
              ┌──────┴──────┐
              │             │
         LandingPage   MentorsPage
              │             │
              └── MentorGrid ──┘
                      │
              UserProfileCard  ←─ RatingStars
                      │
               Props: Mentor[]
```

Public pages import `mockMentorService.list()` via `useEffect`. No session/user context is needed for rendering — the grid is always the same 6 mentors.

## Route Table

| Path | Component | Protected | Layout | Notes |
|------|-----------|-----------|--------|-------|
| `/` | `LandingPage` | No | — | Public landing, Hero + MentorGrid |
| `/mentors` | `MentorsPage` | No | `AppLayout` | Full mentor grid |
| `/login` | `LoginPage` | No (public-only) | — | Redirect → `/app` |
| `/register` | `RegisterPage` | No (public-only) | — | Redirect → `/app` |
| `/mentor/:id` | `MentorProfilePage` | No | — | Unchanged |
| `/app` | `StudentDashboard` | Yes (student) | `AppLayout` | Was `/` |
| `/app/dashboard` | `MentorDashboard` | Yes (mentor) | `AppLayout` | Was `/dashboard` |
| `/app/book/:id` | `BookingPage` | Yes (student) | `AppLayout` | Was `/book/:id` |
| `/app/my-sessions` | `MySessionsPage` | Yes | `AppLayout` | Was `/my-sessions` |
| `/app/rate/:id` | `RatingPage` | Yes (student) | `AppLayout` | Was `/rate/:id` |

## Redirect Migration

| File | Old Target | New Target | Line(s) |
|------|-----------|------------|---------|
| `LoginPage.tsx` | `navigate("/")` | `navigate("/app")` | 25 |
| `RegisterPage.tsx` | `navigate("/")` | `navigate("/app")` | 33 |
| `ProtectedRoute.tsx` | `<Navigate to="/">` | `<Navigate to="/app">` | 30, 48 |
| `BookingPage.tsx` | `navigate("/my-sessions")` | `navigate("/app/my-sessions")` | 49 |
| `BookingPage.tsx` | `to="/"` | `to="/app"` | 85, 101 |
| `RatingPage.tsx` | `to="/my-sessions"` | `to="/app/my-sessions"` | 112, 136, 152, 172, 199, 218, 239, 255 |
| `MySessionsPage.tsx` | `to="/"` | `to="/app"` | 42, 59, 73 |
| `StudentDashboard.tsx` | `to="/my-sessions"` | `to="/app/my-sessions"` | 63 |
| `StudentDashboard.tsx` | `navigate("/book/${id}")` | `navigate("/app/book/${id}")` | 158 |
| `MentorDashboard.tsx` | `to="/my-sessions"` | `to="/app/my-sessions"` | 194 |
| `MentorProfilePage.tsx` | `navigate("/book/${id}")` | `navigate("/app/book/${id}")` | 287 |

**Unchanged** (already correct): Logout `navigate("/")` in `StudentDashboard` (69) and `MentorDashboard` (106); `MentorProfilePage` `to="/"` breadcrumb/back links (126, 141, 293, 297).

## Interfaces / Contracts

```tsx
// Header — no props, self-contained via useAuth + useTheme
// Hero — no props, static value proposition
// Footer — no props, static links + copyright

interface MentorGridProps {
  mentors: Mentor[];
  loading?: boolean;
  emptyMessage?: string;
}

interface AppLayoutProps {
  // Uses <Outlet/> from react-router-dom
}
```

New components follow existing patterns: typed inline props (not separate interface files), no service calls from molecules or organisms.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/atoms/ThemeToggle.tsx` | Modify | Add optional `className` prop for Header reuse |
| `src/components/organisms/Header.tsx` | Create | Nav bar: logo, links (Home, Mentors), ThemeToggle, auth buttons/user menu |
| `src/components/organisms/Footer.tsx` | Create | Links + copyright |
| `src/components/organisms/AppLayout.tsx` | Create | Header + `<Outlet/>` + Footer |
| `src/components/molecules/Hero.tsx` | Create | Value proposition section with CTA |
| `src/components/organisms/MentorGrid.tsx` | Create | Grid of UserProfileCards with loading/empty states |
| `src/components/screens/LandingPage.tsx` | Create | Composes Hero + MentorGrid + CTA section |
| `src/components/screens/MentorsPage.tsx` | Create | Full MentorGrid under AppLayout |
| `src/data/mockMentors.ts` | Modify | Expand 3 → 6 mentors |
| `src/App.tsx` | Modify | Restructure routes, scope SessionProvider to `/app/*` |
| `src/components/screens/LoginPage.tsx` | Modify | `navigate("/")` → `navigate("/app")` |
| `src/components/screens/RegisterPage.tsx` | Modify | `navigate("/")` → `navigate("/app")` |
| `src/shared/components/ProtectedRoute.tsx` | Modify | Wrong-role + PublicOnly redirect → `/app` |
| `src/components/screens/BookingPage.tsx` | Modify | Redirects `/my-sessions` → `/app/my-sessions`, `to="/"` → `to="/app"` |
| `src/components/screens/RatingPage.tsx` | Modify | All `/my-sessions` → `/app/my-sessions` |
| `src/components/screens/MySessionsPage.tsx` | Modify | All `to="/"` → `to="/app"` |
| `src/components/screens/StudentDashboard.tsx` | Modify | `to="/my-sessions"` → `/app/my-sessions`, `navigate("/book/${id}")` → `/app/book/${id}` |
| `src/components/screens/MentorProfilePage.tsx` | Modify | `navigate("/book/${id}")` → `/app/book/${id}` |
| `src/components/screens/MentorDashboard.tsx` | Modify | `to="/my-sessions"` → `/app/my-sessions` |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `LandingPage` renders Hero + MentorGrid + Footer | Mock `mockMentorService.list()`, render, assert sections |
| Unit | `MentorsPage` renders all 6 mentors in grid | Same pattern as existing `MentorDashboard` tests |
| Unit | `MentorGrid` shows empty state when no mentors | Pass empty array, assert empty message |
| Unit | `MentorGrid` shows skeleton when loading | Pass `loading=true`, assert skeleton elements |
| Unit | `Header` shows Login/Register when unauthenticated | Mock `useAuth`, assert login/register links visible |
| Unit | `Header` shows user name when authenticated | Mock `useAuth` with user, assert user visible, no login |
| Integration | Redirect test: Login → `/app` | Mock login, assert `navigate` called with `/app` |
| Integration | Redirect test: Register → `/app` | Same pattern |
| Integration | Protected `/app/*` → `/login` for unauthenticated | Mock `useAuth` as unauthenticated, assert redirect |
| Integration | Wrong-role redirect → `/app` | Mock student visiting `/app/dashboard`, assert redirect to `/app` |
| Build | `npm run build` | Must pass with zero errors |
| Tests | `npm run test` | All existing + new tests green |

Existing test patterns preserved: `vi.mock()` for hooks/services, `MemoryRouter` wrapper, `screen.findBy*` / `waitFor` for async loading.

## Migration / Rollout

No data migration required. Layout and route changes are purely frontend. One deploy step: update routes, create new components, update redirects, expand mock data.

## Open Questions

- None
