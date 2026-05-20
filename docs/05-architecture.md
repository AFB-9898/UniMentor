# UniMentor — Internal Architecture

> This document defines the frontend architecture, component layers, and the boundaries that keep the MVP maintainable.

📄 Read this in: **English** | [Español](05-architecture.es.md)

---

## Architecture Goals

- Keep UI components reusable through Atomic Design separation.
- Encapsulate backend access behind services — components must not call InsForge directly.
- Keep business rules out of JSX and in pure functions or services.
- Make important logic testable with well-defined interfaces.
- Maintain low coupling between components and data sources.

## Architecture Overview

```text
┌─────────────────────────────────────────────────────┐
│                    SCREENS                           │
│  (Pages: MentorSearch, MentorProfile, Dashboard...) │
├─────────────────────────────────────────────────────┤
│                    ORGANISMS                         │
│  (UserProfileCard — orchestrates atoms/molecules)   │
├─────────────────────────────────────────────────────┤
│                    MOLECULES                         │
│  (SearchFilterBar — combines inputs + local state)  │
├─────────────────────────────────────────────────────┤
│                      ATOMS                           │
│  (RatingStars — primitive, no dependencies)         │
├─────────────────────────────────────────────────────┤
│      SERVICES         │      HOOKS                  │
│  (Data access,        │  (Custom React hooks)       │
│   business logic)     │                              │
├─────────────────────────────────────────────────────┤
│                    INSFORGE (BaaS)                   │
│  (PostgreSQL, Auth, Storage, REST API)              │
└─────────────────────────────────────────────────────┘
```

Data flows downward: Screens → Organisms → Molecules → Atoms.
Data access flows sideways: Components → Services → InsForge.

## Atomic Design Layers

| Layer       | Directory     | Example                    | Characteristics                              |
| ----------- | ------------- | -------------------------- | -------------------------------------------- |
| Atoms       | `atoms/`      | `RatingStars`              | Primitive, no internal dependencies          |
| Molecules   | `molecules/`  | `SearchFilterBar`          | Combines inputs, manages local state          |
| Organisms   | `organisms/`  | `UserProfileCard`          | Orchestrates atoms + molecules, domain-aware |
| Screens     | `screens/`    | `MentorSearchScreen`       | Full pages, composition root                 |

### Atom — RatingStars

A star rating component that displays or captures a 1–5 value.

- **Props:** `value`, `interactive?`, `onChange?`, `size?`
- **Reuse contexts:** Mentor profile (display), post-session feedback (interactive), review summaries.
- **Rule:** No dependencies on other components. No direct access to backend.

### Molecule — SearchFilterBar

A search input combined with dynamic select filters.

- **Props:** `fields` (filter configuration array), `onFilter` (callback), `placeholder?`
- **Reuse contexts:** Mentor search by specialty, session history filter, student directory.
- **Rule:** Manages local filter state. Calls `onFilter` upward — never calls services directly.

### Organism — UserProfileCard

A user profile card that integrates RatingStars and displays mentor or student data.

- **Props:** `user` (Mentor | Student), `variant?` (compact | detailed), `actions?` (ReactNode)
- **Reuse contexts:** Search results, mentor profile detail, dashboard, session lists.
- **Rule:** Orchestrates child components. Aware of domain types (Mentor, Student) but delegates data access to services.

## Layer Rules

| Rule                                              | Why                                                     |
| ------------------------------------------------- | ------------------------------------------------------- |
| Components must not call InsForge directly        | Keeps UI testable and decoupled from backend            |
| Services own all data access                      | Single point of change for API calls                    |
| Atoms have no domain dependencies                 | Maximal reusability across the product line             |
| Business rules should be pure functions           | Enables reliable unit tests                             |
| Props are typed with TypeScript interfaces        | Compile-time validation, autocompletion                 |

## Current Project Structure

```text
src/
├── components/
│   ├── atoms/RatingStars.tsx
│   ├── molecules/SearchFilterBar.tsx
│   ├── organisms/UserProfileCard.tsx
│   └── screens/
├── services/
├── hooks/
├── utils/formatDate.ts
├── types/index.ts
├── backend/client.ts
├── theme/ThemeProvider.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Refactoring Techniques Applied

| Technique             | Problem                                   | Solution                                     |
| --------------------- | ----------------------------------------- | -------------------------------------------- |
| Extract Method        | Date formatting duplicated across files   | Centralised `formatDate()` in `utils/`       |
| Replace Magic String  | Session statuses as untyped string literals | Defined `SessionStatus` type in `types/`   |

## Related Documents

- [Tech Stack](04-tech-stack.md)
- [Domain Model](03-domain-model.md)
- [Functional Specification](07-functional-specification.md)
