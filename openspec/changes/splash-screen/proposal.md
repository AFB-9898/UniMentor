# Proposal: Welcome Splash Screen

## Intent
Add a branded welcome splash screen that shows on app startup while auth is loading.

## Motivation
Current app shows a plain spinner ("Cargando...") during auth check. A branded splash with the UniMentor logo and welcome message improves first impression.

## Approach
1. Create `SplashScreen` component with logo + welcome text + fade-in animation
2. Show it in `App.tsx` while `AuthProvider.isLoading` is true
3. Fade out and show landing page or dashboard based on auth state

## Files
- **Create**: `src/components/screens/SplashScreen.tsx`
- **Modify**: `src/App.tsx`
- **Tests**: `src/components/screens/SplashScreen.test.tsx`
