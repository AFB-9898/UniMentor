# UniMentor — Functional Specification

> This document consolidates the MVP requirements, actors, business rules, and acceptance criteria.

📄 Read this in: **English** | [Español](07-functional-specification.es.md)

---

## Actors

| Actor   | Responsibilities                                                          |
| ------- | ------------------------------------------------------------------------- |
| Student | Search mentors, view profiles, book sessions, rate completed sessions     |
| Mentor  | Maintain profile, receive bookings, complete sessions, build reputation   |

## Functional Requirements

### FR-01: Browse and Search Mentors

**Description:** A student can browse available mentors and search by name or keyword.

**Acceptance Criteria:**
- A search input is visible on the mentor discovery screen.
- Typing a name filters the displayed mentor list in real time.
- The search is case-insensitive and matches partial names.
- An empty search returns all mentors.

---

### FR-02: Filter Search Results by Specialty and Rating

**Description:** A student can refine mentor search results using configurable filters.

**Acceptance Criteria:**
- Dropdown filters are provided for specialty and minimum rating.
- Selecting a specialty shows only mentors with that specialty tag.
- Selecting a minimum rating shows only mentors whose average rating is ≥ that value.
- Filters can be combined with text search.
- A "clear all" option resets all filters.

---

### FR-03: View Mentor Profile with Rating

**Description:** A student can view a mentor's detailed profile including their rating and session count.

**Acceptance Criteria:**
- The profile displays the mentor's name, avatar, email, and bio.
- The profile shows the mentor's specialties as labelled badges.
- The average star rating is displayed using the RatingStars component.
- The total number of completed sessions is shown.
- A "compact" variant is used in search results; a "detailed" variant is used on the full profile page.

---

### FR-04: Rate a Mentor After a Session

**Description:** A student can rate a mentor from 1 to 5 stars after a completed session.

**Acceptance Criteria:**
- A rating interface (RatingStars in interactive mode) is shown for completed sessions.
- The student can click on any star (1–5) to submit their rating.
- Each session can be rated at most once.
- Once submitted, the rating becomes read-only.
- The mentor's average rating updates to reflect the new score.

---

### FR-05: Display Session Status and History

**Description:** A student can view their session history with status indicators.

**Acceptance Criteria:**
- Each session shows its current status: pending, confirmed, completed, or cancelled.
- Sessions are listed in chronological order (newest first).
- The status label uses consistent terminology matching the `SessionStatus` type.
- Each session entry shows the mentor name, date, and topic.
- Completed sessions include the rating if one was given.

## Business Rules

| ID   | Rule                                                                    | Rationale                                                   |
| ---- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| BR-01 | Only students can rate mentors                                          | Prevents self-rating and ensures feedback comes from mentees |
| BR-02 | Each session can be rated at most once                                  | Avoids duplicate or inflated ratings                        |
| BR-03 | Mentor average rating updates automatically when a new rating is added  | Keeps profile data consistent without manual recalculation  |
| BR-04 | Session status transitions must follow: `pending → confirmed → completed` | Clear lifecycle prevents invalid state changes              |
| BR-05 | A session can be cancelled from `pending` or `confirmed` state          | Flexibility before completion, consistency after            |

## Session Status Workflow

```text
                  ┌──────────┐
                  │ PENDING  │
                  └────┬─────┘
                       │
                  ┌────▼─────┐
           ┌───── │ CONFIRMED│ ──────┐
           │      └────┬─────┘       │
           │           │             │
      ┌────▼────┐ ┌────▼─────┐       │
      │CANCELLED│ │COMPLETED │       │
      └─────────┘ └──────────┘       │
                                      │
           Any state → CANCELLED      │
           (from pending or confirmed)│
           └──────────────────────────┘
```

## Non-functional Requirements

| Area            | Requirement                                                    |
| --------------- | -------------------------------------------------------------- |
| Maintainability | Atomic Design layers with clear separation of concerns         |
| Type safety     | All props and domain types defined in TypeScript                |
| Testability     | Core components and utility functions covered by unit tests    |
| Reusability     | At least 3 components designed for reuse across the product    |
| Deployability   | MVP can be built and deployed via Vercel                      |

## Related Documents

- [Product Overview](01-product-overview.md)
- [MVP Scope](02-mvp-scope.md)
- [Domain Model](03-domain-model.md)
