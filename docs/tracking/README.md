# UniMentor — Tracking de Avances

> Este archivo documenta el progreso del proyecto issue por issue, con fechas y detalles de cada avance.

---

## 📊 Estado General

| Prioridad | Total | Pendiente | En Progreso | Completada |
|-----------|-------|-----------|-------------|------------|
| 🔴 Alta | 5 | 1 | 0 | 4 |
| 🟡 Media | 5 | 5 | 0 | 0 |
| 🟢 Baja | 4 | 4 | 0 | 0 |
| **Total** | **14** | **10** | **0** | **4** |

---

## 🔴 Prioridad Alta

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 5 | Configurar InsForge client y env vars | ✅ Completada | 2026-05-27 | 2026-05-27 | SDK instalado, `.env` configurado, proyecto creado en InsForge |
| 1 | Crear tablas en InsForge | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 tablas (users, mentors, students, sessions) + índices via migración |
| 2 | Implementar seed data | ✅ Completada | 2026-05-27 | 2026-05-27 | 4 usuarios (3 mentores + 1 estudiante) + 4 sesiones de ejemplo |
| 3 | Implementar capa de servicios | ✅ Completada | 2026-05-27 | 2026-05-27 | TDD: 19 tests, 3 servicios (mentor, session, rating) |
| 4 | Login / Register | ⏳ Pendiente | — | — | — |

## 🟡 Prioridad Media

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 6 | Proteger rutas por rol | ⏳ Pendiente | — | — | — |
| 7 | MentorProfilePage | ⏳ Pendiente | — | — | — |
| 8 | RatingPage | ⏳ Pendiente | — | — | — |
| 9 | Dashboard del estudiante | ⏳ Pendiente | — | — | — |
| 10 | Unificar BookingPage con SessionBookingForm | ⏳ Pendiente | — | — | — |

## 🟢 Prioridad Baja

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 11 | Centralizar mock data en src/data/ | ⏳ Pendiente | — | — | — |
| 12 | Reemplazar alert() por feedback visual | ⏳ Pendiente | — | — | — |
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
