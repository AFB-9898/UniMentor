# UniMentor — Git Workflow

> This document defines the branch, commit, and pull request workflow for an individual academic project.

📄 Read this in: **English** | [Español](06-git-workflow.es.md)

---

## Work Tracking

UniMentor uses GitHub Issues to track tasks, bugs, and documentation work. Every meaningful change should be linked to an issue for traceability in academic evaluation.

## Branch Strategy

A single permanent branch is used:

| Branch   | Purpose                                                 |
| -------- | ------------------------------------------------------- |
| `main`   | Default branch, stable and deployable version           |

For an individual academic project, this simple strategy keeps the workflow focused on implementation. Significant changes may use a pull request directly to `main`.

## Commit Format

```
type(scope): short description
```

Use the imperative present tense. Keep the subject line under 72 characters.

### Allowed Types

| Type       | When to use                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature or component                      |
| `fix`      | A bug fix                                       |
| `docs`     | Documentation changes (README, docs/, AGENTS.md) |
| `refactor` | Code restructuring without behaviour change     |
| `test`     | Adding or updating tests                        |
| `chore`    | Build config, dependencies, tooling             |

### Examples

```
feat(rating-stars): add interactive star rating component
refactor(utils): extract date formatting to formatDate util
docs(mvp-scope): document out-of-scope features
test(search-filter): add filter state change tests
chore(deps): add vitest and testing-library dependencies
```

## Atomic Commits

Keep commits atomic and reviewable:

- Each commit should represent one logical change.
- A new component should be one commit (code + types).
- A refactoring technique should be one commit (before → after).
- Documentation for a feature should be in the same commit as the feature code.

## Pull Requests

- Create PRs for significant or multi-file changes.
- Reference the related issue in the PR description.
- Include a brief summary of what changed and why.
- Ensure the build passes (`npm run build`) before requesting review.

## Final Defense Checklist

- [ ] Stable `main` branch with clean commit history.
- [ ] Updated `README.md` and `README.es.md`.
- [ ] Documentation suite under `docs/` (7 files).
- [ ] `AGENTS.md` with project context for AI agents.
- [ ] Install/run instructions documented.
- [ ] Screenshots or demo assets in `docs/mockups/`.
- [ ] Repository link: https://github.com/AFB-9898/UniMentor

## Related Documents

- [Architecture](05-architecture.md)
- [Tech Stack](04-tech-stack.md)
