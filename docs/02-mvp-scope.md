# UniMentor — MVP Scope

> This document defines what the MVP includes, what it intentionally excludes, and which decisions protect delivery scope.

📄 Read this in: **English** | [Español](02-mvp-scope.es.md)

---

## MVP Goal

Build a functional mentorship marketplace MVP that allows students to discover, evaluate, book, and rate mentors, while mentors manage their sessions and professional profile — all with a clean, reusable component architecture.

## In Scope

| Feature                          | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| Mentor search with filters       | Search mentors by name and filter by specialty and minimum rating  |
| Mentor profile viewing           | Detailed profile with rating, specialty badges, and session count  |
| Star rating system               | Rate mentors 1–5 stars after a completed session                   |
| Session management               | View session status and basic history (pending → confirmed → ...)  |
| Reusable component library       | 3 Atomic Design components (RatingStars, SearchFilterBar, UserProfileCard) |
| Refactoring evidence             | 2 applied techniques (Extract Method, Replace Magic String)        |

## Key Scope Decisions

| Area              | Decision                                                           |
| ----------------- | ------------------------------------------------------------------ |
| Rating ownership  | Only students can rate mentors, never the reverse                  |
| One rating per session | Each session allows exactly one rating, set at completion     |
| No payments       | Sessions are booked and tracked inside the app; payments are out of scope |
| No real-time chat | Communication between students and mentors is not part of the MVP  |
| Backend as BaaS   | InsForge handles Postgres, Auth, and Storage — no custom backend   |

## Out of Scope

- Payment processing or subscription plans.
- Real-time messaging or chat.
- Admin panel with user/moderation controls.
- Native mobile apps (iOS/Android).
- Video conferencing or calendar integration.
- Email notifications or reminders.
- Advanced analytics or reporting dashboards.

## Success Criteria

| Criterion                                          | Verification                                                    |
| -------------------------------------------------- | --------------------------------------------------------------- |
| 3 reusable components implemented                  | RatingStars (atom), SearchFilterBar (molecule), UserProfileCard (organism) |
| 2 refactoring techniques applied with before/after | Extract Method in `formatDate.ts`, Replace Magic String in types |
| All components compile with `npm run build`        | `tsc -b && vite build` succeeds without errors                  |
| Components accept typed props                      | TypeScript interfaces defined for all component props           |
| Components are testable                            | Unit tests pass with `vitest run`                               |

## Related Documents

- [Product Overview](01-product-overview.md)
- [Functional Specification](07-functional-specification.md)
- [Architecture](05-architecture.md)
