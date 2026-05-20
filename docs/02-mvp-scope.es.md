# UniMentor — Alcance del MVP

> Este documento define lo que incluye el MVP, lo que excluye intencionalmente y qué decisiones protegen el alcance de la entrega.

📄 Leer en: [English](02-mvp-scope.md) | **Español**

---

## Objetivo del MVP

Construir un MVP funcional de un marketplace de mentorías que permita a los estudiantes descubrir, evaluar, reservar y calificar mentores, mientras que los mentores gestionan sus sesiones y su perfil profesional — todo con una arquitectura de componentes limpia y reutilizable.

## Dentro del Alcance

| Característica                   | Descripción                                                      |
| -------------------------------- | ---------------------------------------------------------------- |
| Búsqueda de mentores con filtros | Buscar mentores por nombre y filtrar por especialidad y calificación mínima |
| Visualización de perfil de mentor | Perfil detallado con calificación, etiquetas de especialidad y conteo de sesiones |
| Sistema de calificación por estrellas | Calificar mentores de 1 a 5 estrellas después de una sesión completada |
| Gestión de sesiones              | Ver estado de la sesión e historial básico (pendiente → confirmada → ...) |
| Biblioteca de componentes reutilizables | 3 componentes Atomic Design (RatingStars, SearchFilterBar, UserProfileCard) |
| Evidencia de refactorización     | 2 técnicas aplicadas (Extract Method, Replace Magic String)      |

## Decisiones Clave de Alcance

| Área                  | Decisión                                                         |
| --------------------- | ---------------------------------------------------------------- |
| Titularidad de la calificación | Solo los estudiantes pueden calificar mentores, nunca al revés |
| Una calificación por sesión | Cada sesión permite exactamente una calificación, asignada al completarse |
| Sin pagos             | Las sesiones se reservan y gestionan dentro de la app; los pagos quedan fuera del alcance |
| Sin chat en tiempo real | La comunicación entre estudiantes y mentores no es parte del MVP |
| Backend como BaaS     | InsForge gestiona Postgres, Auth y Storage — no hay backend personalizado |

## Fuera del Alcance

- Procesamiento de pagos o planes de suscripción.
- Mensajería o chat en tiempo real.
- Panel de administración con controles de usuario y moderación.
- Apps móviles nativas (iOS/Android).
- Videoconferencias o integración con calendarios.
- Notificaciones por correo electrónico o recordatorios.
- Analíticas avanzadas o dashboards de reportes.

## Criterios de Éxito

| Criterio                                            | Verificación                                                   |
| --------------------------------------------------- | -------------------------------------------------------------- |
| 3 componentes reutilizables implementados           | RatingStars (átomo), SearchFilterBar (molécula), UserProfileCard (organismo) |
| 2 técnicas de refactorización aplicadas con antes/después | Extract Method en `formatDate.ts`, Replace Magic String en types |
| Todos los componentes compilan con `npm run build`  | `tsc -b && vite build` se ejecuta sin errores                  |
| Los componentes aceptan props tipadas               | Interfaces TypeScript definidas para todos los props de componentes |
| Los componentes son testeables                      | Pruebas unitarias pasan con `vitest run`                       |

## Documentos Relacionados

- [Visión General del Producto](01-product-overview.es.md)
- [Especificación Funcional](07-functional-specification.es.md)
- [Arquitectura](05-architecture.es.md)
