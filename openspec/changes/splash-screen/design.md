# Design: Welcome Splash Screen

## Component Tree
```
App
├── ThemeProvider
│   └── ToastProvider
│       └── AuthProvider
│           ├── SplashScreen (when isLoading)
│           └── AppContent (when !isLoading)
```

## SplashScreen Props
None — reads auth state from context.

## Flow
1. App mounts → AuthProvider starts loading
2. `isLoading === true` → SplashScreen renders
3. CSS keyframe animation: logo fades in + scales up slightly
4. `isLoading === false` → SplashScreen fades out (CSS transition)
5. After fade-out (~300ms), SplashScreen unmounts → AppContent renders

## Styling
- Full viewport: `fixed inset-0`
- Centered content: `flex items-center justify-center`
- Dark/light mode aware
- Background: `bg-gray-50 dark:bg-gray-950`
- Logo: "UniMentor" in primary color, large font
- Subtitle: "Encontrá al mentor ideal para tu futuro profesional"
- Spinner or dots animation below

## Animation
CSS approach (no extra deps):
- `@keyframes fadeInScale` for entrance
- `opacity transition` for exit
- Controlled by state: `entering` → `visible` → `leaving`
