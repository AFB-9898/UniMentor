# UniMentor — Tracking de Avances

> Este archivo documenta el progreso del proyecto issue por issue, con fechas y detalles de cada avance.

---

## 📊 Estado General

| Prioridad | Total | Pendiente | En Progreso | Completada |
|-----------|-------|-----------|-------------|------------|
| 🔴 Alta | 5 | 4 | 0 | 1 |
| 🟡 Media | 5 | 5 | 0 | 0 |
| 🟢 Baja | 4 | 4 | 0 | 0 |
| **Total** | **14** | **13** | **0** | **1** |

---

## 🔴 Prioridad Alta

| # | Issue | Estado | Inicio | Término | Notas |
|---|-------|--------|--------|---------|-------|
| 5 | Configurar InsForge client y env vars | ✅ Completada | 2026-05-27 | 2026-05-27 | SDK instalado, `.env` configurado, proyecto creado en InsForge |
| 1 | Crear tablas en InsForge | ⏳ Pendiente | — | — | — |
| 2 | Implementar seed data | ⏳ Pendiente | — | — | — |
| 3 | Implementar capa de servicios | ⏳ Pendiente | — | — | — |
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
