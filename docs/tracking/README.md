# UniMentor — Tracking de Avances

> Este archivo documenta el progreso del proyecto issue por issue, con fechas y detalles de cada avance.

---

## 📊 Estado General

| Prioridad | Total | Pendiente | En Progreso | Completada |
|-----------|-------|-----------|-------------|------------|
| 🔴 Alta | 5 | 0 | 0 | 5 |
| 🟡 Media | 6 | 4 | 0 | 2 |
| 🟢 Baja | 4 | 3 | 1 | 0 |
| **Total** | **15** | **7** | **1** | **7** |

---

## 🔴 Prioridad Alta

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 5 | Configurar InsForge client y env vars | ✅ Completada | 2026-05-27 | 2026-05-27 | SDK instalado, `.env` configurado, proyecto creado en InsForge |
| 1 | Crear tablas en InsForge | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 tablas (users, mentors, students, sessions) + índices via migración |
| 2 | Implementar seed data | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 usuarios (3 mentores + 1 estudiante) + 4 sesiones de ejemplo |
| 3 | Implementar capa de servicios | ✅ Completada | 2026-05-27 | 2026-05-27 | TDD: 19 tests, 3 servicios (mentor, session, rating) |
| 4 | Login / Register | ✅ Completada | 2026-05-27 | 2026-05-28 | LoginPage, RegisterPage, authService + tests, AuthContext, ProtectedRoute |

## 🟡 Prioridad Media

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 6 | Proteger rutas por rol | ✅ Completada | 2026-05-27 | 2026-05-28 | ProtectedRoute con roles, PublicOnlyRoute, redirección a /login |
| 16 | Dark/Light mode toggle | ✅ Completada | 2026-05-28 | 2026-05-28 | ThemeProvider conectado, ThemeToggle, localStorage + prefers-color-scheme |
| 7 | MentorProfilePage | ⏳ Pendiente | — | — | — |
| 8 | RatingPage | ⏳ Pendiente | — | — | — |
| 9 | Dashboard del estudiante | ⏳ Pendiente | — | — | — |
| 10 | Unificar BookingPage con SessionBookingForm | ⏳ Pendiente | — | — | — |

## 🟢 Prioridad Baja

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 11 | Centralizar mock data en src/data/ | ⏳ Pendiente | — | — | — |
| 12 | Reemplazar alert() por feedback visual | ⏳ En Progreso | — | — | BookingPage sin alert(), falta SessionBookingForm (línea 28) |
| 13 | Agregar estados de carga y vacío | ⏳ Pendiente | — | — | — |
| 14 | Configurar deploy en Vercel | ⏳ Pendiente | — | — | — |

---

## 📝 Bitácora de Avances

### 2026-05-27 — Configuración de InsForge (#5)

**Issues trabajadas:** #5
**Detalle:**
- Instalado `@insforge/sdk@latest`
- Creado proyecto `unimentor` en InsForge via CLI (us-east)
- Configurado `.env` con `VITE_INSFORGE_URL` y `VITE_INSFORGE_ANON_KEY`
- Actualizado `src/backend/client.ts` con cliente inicializado
- Actualizado `.env.example` con las variables correctas
- Build verificado ✅ (`npm run build` sin errores)

**Resultado:** Build ✅ | Issue #5 completada ✅

### 2026-05-27 — Creación de tablas en InsForge (#1)

**Issues trabajadas:** #1
**Detalle:**
- Creada migración SQL `20260527050431_create-tables.sql` en `migrations/`
- Tablas creadas: `users`, `mentors`, `students`, `sessions`
- Índices: `idx_sessions_mentor_id`, `idx_sessions_student_id`, `idx_sessions_status`
- Constraints: PKs, FKs, CHECKs, UNIQUEs
- Verificado via CLI: `insforge db tables` e `insforge db indexes`
- Migración aplicada con `insforge db migrations up --all`

**Resultado:** Tablas verificadas ✅ | Issue #1 completada ✅

### 2026-05-27 — Seed data (#2)

**Issues trabajadas:** #2
**Detalle:**
- Creada migración SQL con datos de desarrollo
- 3 mentores con specialties, rating y sesiones
- 1 estudiante con universidad y carrera
- 4 sesiones en distintos estados (completed, confirmed, pending, cancelled)
- Verificado con queries SQL

**Resultado:** Datos insertados ✅ | Issue #2 completada ✅

### 2026-05-27 — Service layer con TDD (#3)

**Issues trabajadas:** #3
**Detalle:**
- 🟥 Escritos tests primero (RED): mentorService (7 tests), sessionService (6 tests), ratingService (6 tests)
- 🟩 Implementados servicios mock (GREEN)
- mentorService: list con filtros (search, specialty, minRating), getById
- sessionService: create, getById, listByUser, updateStatus
- ratingService: submitRating (valida BR-01, BR-02, BR-03), getAverage
- Test para InsForge client existente

**TDD:** ✅ Tests escritos antes de la implementación
**Tests totales:** 46 pasando (19 nuevos)
**Build:** ✅

### 2026-05-28 — Auth flow + Protected routes + Dark mode (#4, #6, #16)

**Issues trabajadas:** #4, #6, #16
**Detalle:**

**Auth — Login & Register (#4):**
- Creado `src/services/authService.ts` con interfaz `AuthService` y mock implementation
  - login(credentials), register(data), logout(), getCurrentUser()
  - 4 usuarios mock (1 student, 3 mentors) con contraseña `123456`
  - Validación de credenciales y email duplicado
- Escritos `src/services/authService.test.ts` — 7 tests (login student, login mentor, invalid credentials, register, email duplicado, logout, getCurrentUser sin sesión)
- Creado `src/hooks/AuthContext.tsx` con `AuthProvider` + hook `useAuth`
  - Estados: user, isAuthenticated, isLoading
  - Funciones: login, register, logout
  - Efecto inicial: getCurrentUser al montar
- Creado `src/components/screens/LoginPage.tsx` con:
  - Formulario de email + contraseña
  - Validación inline (campos obligatorios)
  - Error message visual (sin alert())
  - Estado submitting con botón deshabilitado
  - Link a registro y credenciales de prueba
  - Dark mode con variantes `dark:`
- Creado `src/components/screens/RegisterPage.tsx` con:
  - Formulario: nombre, email, contraseña (min 6 chars), selección de rol (student/mentor)
  - Validación inline con mensajes de error
  - Estado submitting con botón deshabilitado
  - Link a login
  - Dark mode con variantes `dark:`

**Protected Routes (#6):**
- Creado `src/shared/components/ProtectedRoute.tsx` con:
  - `ProtectedRoute`: verifica autenticación, redirect a /login si no hay sesión
  - Prop `roles` opcional para filtrar por rol (student/mentor)
  - Spinner de carga mientras se resuelve isLoading
  - `PublicOnlyRoute`: redirect a / si ya hay sesión (para login/register)
- Configurado en `src/App.tsx`:
  - `/book/:mentorId` → solo estudiantes (`roles={["student"]}`)
  - `/my-sessions` → cualquier usuario autenticado
  - `/login` y `/register` → solo público
  - Header dinámico: muestra nombre + botón cerrar sesión si autenticado, o botón "Iniciar sesión" si no

**Dark/Light mode toggle (#16):**
- Conectado `src/theme/ThemeProvider.tsx` al árbol de componentes en App.tsx
  - Persistencia en localStorage (`unimentor-theme`)
  - Preferencia del sistema como default (`prefers-color-scheme`)
  - Sincronización de clase `.dark` en `<html>` para Tailwind
  - Listener de cambios en preferencia del sistema
- Creado `src/components/atoms/ThemeToggle.tsx`:
  - Icono de sol en modo oscuro, luna en modo claro
  - Tooltip dinámico según estado
  - Estilos con `dark:` variants
- Aplicadas variantes `dark:` en todas las pantallas:
  - HomePage, BookingPage, MySessionsPage, LoginPage, RegisterPage
  - Spinners de ProtectedRoute
  - Transición suave con `transition-colors`

**Tests:** 53 pasando (9 suites, +7 nuevos de authService)
**Build:** ✅ (`npm run build` sin errores)
**Pendiente:** Working tree sin committear — auth + theme + routing
