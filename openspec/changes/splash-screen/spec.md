# Specification: Welcome Splash Screen

## Requirements
| ID | Description | Strength |
|----|-------------|----------|
| R1 | Show splash screen while AuthProvider isLoading is true | MUST |
| R2 | Display UniMentor logo (text) and welcome message | MUST |
| R3 | Fade-in animation on mount, fade-out on exit | MUST |
| R4 | Auto-dismiss when auth finishes loading | MUST |
| R5 | After dismiss, user sees landing page (unauthenticated) or dashboard (authenticated) | MUST |

## Acceptance Criteria
- App starts → splash shows with fade-in → auth loads → splash fades out → landing or dashboard
- Splash is full-screen centered
- Animation is subtle (~1s transitions)
