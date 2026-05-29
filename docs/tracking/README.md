# UniMentor — Tracking de Avances

> Este archivo documenta el progreso del proyecto issue por issue, con fechas y detalles de cada avance.

---

## 📊 Estado General

| Prioridad | Total | Pendiente | En Progreso | Completada |
|-----------|-------|-----------|-------------|------------|
| 🔴 Alta | 6 | 0 | 0 | 6 |
| 🟡 Media | 6 | 0 | 0 | 6 |
| 🟡 Media | 8 | 1 | 0 | 7 |
| 🟢 Baja | 4 | 2 | 1 | 1 |
| **Total** | **18** | **3** | **1** | **14** |

---

## 🔴 Prioridad Alta

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 5 | Configurar InsForge client y env vars | ✅ Completada | 2026-05-27 | 2026-05-27 | SDK instalado, `.env` configurado, proyecto creado en InsForge |
| 1 | Crear tablas en InsForge | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 tablas (users, mentors, students, sessions) + índices via migración |
| 2 | Implementar seed data | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 usuarios (3 mentores + 1 estudiante) + 4 sesiones de ejemplo |
| 3 | Implementar capa de servicios | ✅ Completada | 2026-05-27 | 2026-05-27 | TDD: 19 tests, 3 servicios (mentor, session, rating) |
| 4 | Login / Register | ✅ Completada | 2026-05-27 | 2026-05-28 | LoginPage, RegisterPage, authService + tests, AuthContext, ProtectedRoute |
| 18 | Mentor Dashboard | ✅ Completada | 2026-05-28 | 2026-05-28 | Dashboard de mentor con stats, sesiones próximas, redirección inteligente por rol |

## 🟡 Prioridad Media

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 6 | Proteger rutas por rol | ✅ Completada | 2026-05-27 | 2026-05-28 | ProtectedRoute con roles, PublicOnlyRoute, redirección a /login |
| 16 | Dark/Light mode toggle | ✅ Completada | 2026-05-28 | 2026-05-28 | ThemeProvider conectado, ThemeToggle, localStorage + prefers-color-scheme |
| 7 | MentorProfilePage | ✅ Completada | 2026-05-28 | 2026-05-28 | Pantalla /mentor/:id con perfil completo, bio, loading/404 states, breadcrumb |
| 8 | RatingPage | ✅ Completada | 2026-05-28 | 2026-05-28 | Pantalla /rate/:id con flujo completo: form, confirmación, estados de error |
| 9 | Student Dashboard | ✅ Completada | 2026-05-28 | 2026-05-28 | Dashboard de estudiante con stats, búsqueda, cards de mentores, sin secciones demo |
| 10 | Unificar BookingPage con SessionBookingForm | ✅ Completada | 2026-05-28 | 2026-05-28 | BookingPage usa SessionBookingForm con RHF+Zod, dark mode, sin datos duplicados |
| 19 | Edición inline de perfil de mentor | ✅ Completada | 2026-05-28 | 2026-05-28 | Editar bio y especialidades inline desde el perfil público propio. TDD, 74 tests |
| 20 | Vista de sesiones del mentor | ✅ Completada | 2026-05-28 | 2026-05-28 | Sessions con nombres de estudiantes. SessionContext usa auth real, listByUser filtra por rol. TDD, 85 tests |

## 🟢 Prioridad Baja

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 11 | Centralizar mock data en src/data/ | ✅ Completada | 2026-05-29 | 2026-05-29 | mockMentors extraído a src/data/mockMentors.ts, mentorService.ts lo importa |
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

### 2026-05-28 — MentorProfilePage (#7)

**Issues trabajadas:** #7
**Detalle:**
- Creado `src/components/screens/MentorProfilePage.tsx` en `/mentor/:mentorId`
- Usa `mockMentorService.getById()` para obtener datos
- Breadcrumb de navegación (Inicio → Nombre del mentor)
- `UserProfileCard` en variante `detailed` para el header del perfil
- Sección de biografía con texto completo
- Sección de especialidades con badges
- Estados: loading (skeleton animado), no encontrado (404 con link a inicio)
- Botón "Agendar sesión" que navega a `/book/:mentorId`
- Link "Ver perfil" agregado desde las tarjetas de HomePage
- Agregados `bio` a los datos mock de mentores en `mentorService.ts`

**Build:** ✅ | **Tests:** 53 pasando ✅ | **Issue #7 completada** ✅

### 2026-05-28 — RatingPage (#8)

**Issues trabajadas:** #8
**Detalle:**
- Creado `src/components/screens/RatingPage.tsx` en `/rate/:sessionId`
- Ruta protegida para estudiantes (`ProtectedRoute roles={["student"]}`)
- Fetch de sesión via `mockSessionService.getById()` + mentor via `mockMentorService.getById()`
- `RatingStars` interactivo (1-5) con labels textuales (Muy malo → Excelente)
- Estados manejados: loading (skeleton), no encontrado, no completada, ya calificada, form, submitting, error, success
- Submit via `mockRatingService.submitRating()` que valida BR-01, BR-02, BR-03
- Confirmación visual con estrellas + puntuación
- Botón "Calificar sesión" agregado en `MySessionsPage` para sesiones completadas sin rating
- `SessionContext`: ahora carga sesiones semilla al montar + función `rateSession` para mantener estado local sincronizado
- Removido `rating: 4` de la sesión semilla #1 para que sea calificable en demo

**Build:** ✅ | **Tests:** 53 pasando ✅ | **Issue #8 completada** ✅

### 2026-05-28 — Mentor Dashboard + redirección por rol (#18)

**Issues trabajadas:** #18
**Detalle:**
- Creado `src/components/screens/MentorDashboard.tsx` en `/dashboard`
- Ruta protegida para mentores (`ProtectedRoute roles={["mentor"]}`)
- Muestra perfil del mentor (nombre, email, especialidades, rating)
- Stats rápidas: próximas sesiones, completadas, calificación
- Lista de sesiones próximas con estado y fecha
- Link a perfil público (`/mentor/:id`)
- **Redirección inteligente en HomePage:**
  - Mentor autenticado → redirige a `/dashboard`
  - Estudiante o no autenticado → marketplace actual
  - Estado loading mientras resuelve auth
- Creada issue #18 en GitHub

**Build:** ✅ | **Tests:** 53 pasando ✅ | **Issue #18 completada** ✅

### 2026-05-28 — Student Dashboard (#9)

**Issues trabajadas:** #9
**Detalle:**
- Creado `src/components/screens/StudentDashboard.tsx`
- Se muestra en `/` para estudiantes autenticados
- Mensaje de bienvenida con el nombre del estudiante
- Stats: próximas sesiones, completadas, mentores disponibles
- Búsqueda y filtrado de mentores (SearchFilterBar)
- Tarjetas de mentores con acciones "Ver perfil" y "Agendar sesión"
- Navegación a Mis Sesiones
- HomePage público se conserva para usuarios no autenticados con secciones demo
- Redirección por rol actualizada:
  - Mentor → `/dashboard`
  - Estudiante → StudentDashboard en `/`
  - No autenticado → HomePage público con demos

**Build:** ✅ | **Tests:** 53 pasando ✅ | **Issue #9 completada** ✅

### 2026-05-28 — Unificar BookingPage con SessionBookingForm (#10)

**Issues trabajadas:** #10
**Detalle:**
- Refactorizado `SessionBookingForm`:
  - Nuevo prop `defaultMentorId`: preselecciona mentor y oculta el selector
  - Nuevo prop `onSubmit`: callback en vez de `alert()`
  - Dark mode en form y labels
- `BookingPage` reescrita:
  - Usa `SessionBookingForm` con RHF + Zod en vez de useState inline
  - Mentor obtenido via `mockMentorService.getById()` (sin datos duplicados)
  - Estados: loading (skeleton) y mentor no encontrado (404)
  - Submit → `addSession` de SessionContext → navega a MySessions
- Componentes compartidos (`Input`, `Select`, `FormField`) con dark mode

**Build:** ✅ | **Tests:** 53 pasando ✅ | **Issue #10 completada** ✅

### 2026-05-28 — Inline Mentor Profile Edit (#19)

**Issues trabajadas:** #19
**Detalle:**
- Agregado `updateProfile(id, data)` a interfaz `MentorService` + mock con mutación in-place
- `MentorProfilePage` extendida con modo edición inline:
  - Ownership check via `useAuth().user.id === mentor.id` — solo el dueño edita
  - Bio: párrafo → textarea con placeholder en edición, cancelar restaura original
  - Especialidades: tags con botones add/remove en edición, cancelar restaura
  - Save → `updateProfile()` → actualiza estado local, sale de edición
  - Error → mensaje inline, se queda en edición para reintentar
  - Loading → botones deshabilitados con "Guardando..." + double-save guard
- Tests TDD: 17 tests nuevos cubriendo R1-R8 (ownership, bio, specialties, save, cancel, loading, error, double-save)

**Build:** ✅ | **Tests:** 74 pasando (10 suites) ✅ | **Issue #19 completada** ✅

### 2026-05-28 — Mentor Sessions View with Student Names (#20)

**Issues trabajadas:** #20
**Detalle:**
- Creado `src/services/userService.ts` con `getUserName(id)` y mapa de nombres + fallback
- `sessionService.listByUser` corregido: filtra por `studentId` **O** `mentorId` (antes solo studentId)
- `SessionContext` corregido:
  - Ya no hardcodea `"student-1"` — usa `useAuth().user.id`
  - Espera a que auth esté lista (`!isLoading`) antes de cargar sesiones
  - Usuarios no autenticados no gatillan fetch
- `MentorDashboard`: cada sesión próxima muestra el nombre del estudiante via `getUserName(session.studentId)`
- `MySessionsPage`: muestra nombre condicional por rol
  - Mentor → muestra nombre del estudiante
  - Estudiante → muestra nombre del mentor (comportamiento original preservado)
- Eliminado `mentorNames` hardcodeado de MySessionsPage (reemplazado por `getUserName`)
- Tests TDD: 11 tests nuevos en 4 archivos, 85 tests totales
- **Bug corregido**: el SessionContext cargaba sesiones de un estudiante fijo sin importar quién usaba la app

**Build:** ✅ | **Tests:** 85 pasando (14 suites) ✅ | **Issue #20 completada** ✅

### 2026-05-29 — Centralizar mock data (#11)

**Issues trabajadas:** #11
**Detalle:**
- Extraído `mockMentors[]` de `src/services/mentorService.ts` a `src/data/mockMentors.ts`
- `mentorService.ts` ahora importa el array desde `data/`
- Sin cambios funcionales — misma data, mismo comportamiento
- Parte de la preparación para conectar backend real

**Tests:** 85 pasando (14 suites) ✅ | **Build:** ✅ | **Issue #11 completada** ✅
