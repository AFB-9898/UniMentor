# UniMentor — Tech Stack

> This document explains the selected technologies and the reasons behind them.

📄 Read this in: **English** | [Español](04-tech-stack.es.md)

---

## Stack Summary

| Category           | Technology          | Version | Reason                                                |
| ------------------ | ------------------- | ------- | ----------------------------------------------------- |
| UI Framework       | React               | 19      | Component model aligns with Atomic Design             |
| Language           | TypeScript          | 5.8     | Type safety, autocompletion, compile-time validation  |
| Styling            | Tailwind CSS        | 4       | Utility-first, rapid UI iteration                     |
| Build Tool         | Vite                | 6       | Fast HMR, modern ESM-based bundling                   |
| Routing            | React Router DOM    | 7       | Standard client-side routing for SPAs                 |
| Testing            | Vitest              | 4       | Fast unit/integration testing, Vite-native            |
| Backend / BaaS     | InsForge            | —       | Postgres, Auth, Storage — reduces backend overhead    |
| Database           | PostgreSQL          | —       | Relational model fits users, sessions, ratings        |
| Authentication     | InsForge Auth       | —       | Built-in identity management                          |
| File Storage       | InsForge Storage    | —       | Avatar and document storage                           |
| Deployment         | Vercel              | —       | Simple CI/CD and preview deployments                  |

## Why This Stack

The project has a limited academic delivery window and should prioritise a functional, deployable MVP. InsForge eliminates custom backend development while preserving relational database power. React 19 + TypeScript 5.8 provide a modern, type-safe foundation. Tailwind CSS 4 with the Vite plugin enables fast, consistent UI development without CSS file overhead. Vitest integrates directly with Vite for minimal test configuration.

## Styling Strategy

Tailwind CSS is configured through the `@tailwindcss/vite` plugin and imported from `src/index.css`. Global CSS is limited to Tailwind directives, theme variables, and base resets. All component styling uses Tailwind utility classes directly in JSX.

## Component Architecture

Components follow Atomic Design layers (see [Architecture](05-architecture.md)). Each component receives typed props via TypeScript interfaces. State management is local (`useState`) or passed via props; no global state library is used in the MVP.

## Testing Targets

- `RatingStars` rendering and interaction behaviour.
- `SearchFilterBar` filter state management.
- `UserProfileCard` conditional rendering (mentor vs student).
- `formatDate` utility (Extract Method refactoring outcome).
- Type-level validation of `SessionStatus` and `UserRole`.

## Related Documents

- [Architecture](05-architecture.md)
- [Functional Specification](07-functional-specification.md)
- [Domain Model](03-domain-model.md)
