# AGENTS.md — UniMentor Project Context

This file gives coding agents the minimum project context needed to work safely on UniMentor. Treat it as an operating contract, not as product documentation.

## Project Summary

UniMentor is an EdTech mentorship marketplace MVP that connects university students with graduate mentors for professional career guidance.

The product belongs to the **Educational Platforms (EdTech)** product line — Software Engineering II.

The MVP covers:

- mentor search with filters;
- mentor profile viewing with ratings;
- star-based rating system (1–5);
- session management with status workflow;
- reusable Atomic Design components.

## Current State

- **Components built:** `RatingStars` (atom), `SearchFilterBar` (molecule), `UserProfileCard` (organism).
- **Refactoring applied:** Extract Method (`formatDate` util), Replace Magic String (`SessionStatus` type).
- **Types defined:** `User`, `Mentor`, `Student`, `Session`, `UserRole`, `SessionStatus` in `src/types/index.ts`.
- **Tests configured:** Vitest with testing-library/react and jsdom.
- **Documentation:** Product docs under `docs/` (7 files), AGENTS.md, bilingual README.
- **Backend:** InsForge client configured at `src/backend/client.ts`.
- **Styling:** Tailwind CSS 4 via `@tailwindcss/vite` plugin.

## Primary Documents

Read these before making architectural or product decisions:

| File                                  | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `README.md`                           | Public English landing page              |
| `README.es.md`                        | Public Spanish landing page              |
| `docs/01-product-overview.md`         | Product vision and operational problem   |
| `docs/02-mvp-scope.md`                | MVP boundaries and non-goals             |
| `docs/03-domain-model.md`             | Core domain entities and relationships   |
| `docs/04-tech-stack.md`               | Intended technology choices              |
| `docs/05-architecture.md`             | Frontend architecture and layer rules    |
| `docs/06-git-workflow.md`             | Branch, issue, commit, and PR workflow   |
| `docs/07-functional-specification.md` | Requirements, rules, and acceptance flow |

Spanish counterparts exist as `.es.md` files and should stay aligned with the English documents when documentation changes are meaningful.

## Language and Documentation Rules

- Code, filenames, identifiers, commit messages, and technical artifacts use English by default.
- User-facing documentation has bilingual pairs: English source plus Spanish `.es.md` counterpart.
- When changing a numbered documentation file, update its Spanish pair unless the change is explicitly language-specific.
- Keep documentation concise, reviewable, and structured for academic evaluation.
- All React components must have English JSX. UI labels and copy are in English.

## Architecture Rules

Follow the architecture described in `docs/05-architecture.md`.

Current frontend structure:

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

Layer rules:

- Components must not call InsForge directly — use services.
- Atoms are primitive and must not depend on other components.
- Molecules combine atoms with local state.
- Organisms orchestrate atoms and molecules and may be domain-aware.
- Business rules should be pure functions when possible.

## MVP Business Rules

Preserve these unless the project owner explicitly changes scope:

- Only students can rate mentors (BR-01).
- Each session can be rated at most once (BR-02).
- Mentor average rating updates automatically (BR-03).
- Session status transitions: `pending → confirmed → completed` or `cancelled` from pending/confirmed (BR-04, BR-05).
- Rating is a 1–5 integer, no half-stars.

## Backend Direction

Backend is handled by InsForge (BaaS) with PostgreSQL. The client is at `src/backend/client.ts`.

Current documented target:

- InsForge as Backend/BaaS;
- PostgreSQL as database;
- InsForge Auth for authentication;
- InsForge Storage for file uploads (avatars).

Before implementing backend integration, confirm:

1. whether InsForge is still the selected backend path;
2. environment variables (`VITE_INSFORGE_URL`, `VITE_INSFORGE_PUBLISHABLE_KEY`);
3. seed data required for frontend and tests.

## Git Workflow

Follow `docs/06-git-workflow.md`.

Permanent branch:

- `main` — default, stable, deployable.

Commit format:

```text
type(scope): short description
```

Examples:

```text
feat(rating-stars): add interactive star rating component
refactor(utils): extract date formatting to formatDate util
docs(agents): add project agent context
```

Rules:

- Keep commits atomic and reviewable.
- PRs for significant changes.
- No complex branching strategy for individual academic project.
- Do not commit, push, merge, or publish unless the user explicitly asks.

## Commands

Use these commands when relevant:

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite build
npm run test       # Run Vitest tests once
npm run test:watch # Run tests in watch mode
```

Notes:

- Run `npm run build` before reporting implementation work as complete when code changes affect the app.
- Run `npm run test` to verify tests pass after changes.

## Do Not Do Without Approval

- Do not introduce a different backend stack without asking.
- Do not install major UI libraries without asking.
- Do not remove bilingual documentation structure.
- Do not collapse domain rules into JSX components.
- Do not create large multi-area rewrites without a plan.
- Do not commit, push, or create PRs without explicit user approval.
- Do not build new backend services or databases outside InsForge.
- Do not add real-time features, chat, or payment logic.
