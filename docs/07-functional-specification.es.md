# UniMentor — Especificación Funcional

> Este documento consolida los requisitos del MVP, los actores, las reglas de negocio y los criterios de aceptación.

📄 Leer en: [English](07-functional-specification.md) | **Español**

---

## Actores

| Actor      | Responsabilidades                                                       |
| ---------- | ----------------------------------------------------------------------- |
| Estudiante | Buscar mentores, ver perfiles, reservar sesiones, calificar sesiones completadas |
| Mentor     | Mantener su perfil, recibir reservas, completar sesiones, construir reputación |

## Requisitos Funcionales

### RF-01: Explorar y Buscar Mentores

**Descripción:** Un estudiante puede explorar los mentores disponibles y buscar por nombre o palabra clave.

**Criterios de Aceptación:**
- Un input de búsqueda está visible en la pantalla de descubrimiento de mentores.
- Escribir un nombre filtra la lista de mentores mostrada en tiempo real.
- La búsqueda no distingue mayúsculas/minúsculas y coincide con nombres parciales.
- Una búsqueda vacía devuelve todos los mentores.

---

### RF-02: Filtrar Resultados de Búsqueda por Especialidad y Calificación

**Descripción:** Un estudiante puede refinar los resultados de búsqueda de mentores usando filtros configurables.

**Criterios de Aceptación:**
- Se proporcionan filtros desplegables para especialidad y calificación mínima.
- Seleccionar una especialidad muestra solo los mentores con esa etiqueta.
- Seleccionar una calificación mínima muestra solo los mentores cuyo promedio es ≥ ese valor.
- Los filtros pueden combinarse con la búsqueda por texto.
- Una opción "limpiar todo" restablece todos los filtros.

---

### RF-03: Ver Perfil de Mentor con Calificación

**Descripción:** Un estudiante puede ver el perfil detallado de un mentor, incluyendo su calificación y conteo de sesiones.

**Criterios de Aceptación:**
- El perfil muestra el nombre, avatar, email y biografía del mentor.
- El perfil muestra las especialidades del mentor como etiquetas.
- La calificación promedio por estrellas se muestra usando el componente RatingStars.
- El número total de sesiones completadas se muestra.
- Una variante "compacta" se usa en resultados de búsqueda; una variante "detallada" se usa en la página de perfil completo.

---

### RF-04: Calificar a un Mentor Después de una Sesión

**Descripción:** Un estudiante puede calificar a un mentor de 1 a 5 estrellas después de una sesión completada.

**Criterios de Aceptación:**
- Una interfaz de calificación (RatingStars en modo interactivo) se muestra para las sesiones completadas.
- El estudiante puede hacer clic en cualquier estrella (1–5) para enviar su calificación.
- Cada sesión puede calificarse como máximo una vez.
- Una vez enviada, la calificación se vuelve de solo lectura.
- La calificación promedio del mentor se actualiza para reflejar la nueva puntuación.

---

### RF-05: Visualizar Estado e Historial de Sesiones

**Descripción:** Un estudiante puede ver su historial de sesiones con indicadores de estado.

**Criterios de Aceptación:**
- Cada sesión muestra su estado actual: pendiente, confirmada, completada o cancelada.
- Las sesiones se listan en orden cronológico (las más recientes primero).
- La etiqueta de estado utiliza la terminología consistente del tipo `SessionStatus`.
- Cada entrada de sesión muestra el nombre del mentor, la fecha y el tema.
- Las sesiones completadas incluyen la calificación si se asignó una.

## Reglas de Negocio

| ID    | Regla                                                                   | Justificación                                                |
| ----- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| RN-01 | Solo los estudiantes pueden calificar mentores                          | Evita la autocalificación y asegura que el feedback provenga de los mentorizados |
| RN-02 | Cada sesión puede calificarse como máximo una vez                       | Evita calificaciones duplicadas o infladas                   |
| RN-03 | La calificación promedio del mentor se actualiza automáticamente al agregar una nueva | Mantiene los datos del perfil consistentes sin recálculo manual |
| RN-04 | Las transiciones de estado de sesión deben seguir: `pending → confirmed → completed` | Un ciclo de vida claro previene cambios de estado inválidos  |
| RN-05 | Una sesión puede cancelarse desde el estado `pending` o `confirmed`     | Flexibilidad antes de la finalización, consistencia después  |

## Flujo de Estados de Sesión

```text
                  ┌──────────┐
                  │ PENDING  │
                  └────┬─────┘
                       │
                  ┌────▼─────┐
           ┌───── │ CONFIRMED│ ──────┐
           │      └────┬─────┘       │
           │           │             │
      ┌────▼────┐ ┌────▼─────┐       │
      │CANCELLED│ │COMPLETED │       │
      └─────────┘ └──────────┘       │
                                      │
           Cualquier estado → CANCELLED│
           (desde pending o confirmed) │
           └───────────────────────────┘
```

## Requisitos No Funcionales

| Área             | Requisito                                                     |
| ---------------- | ------------------------------------------------------------- |
| Mantenibilidad   | Capas de Atomic Design con separación clara de responsabilidades |
| Seguridad de tipos | Todos los props y tipos de dominio definidos en TypeScript    |
| Testeabilidad    | Componentes principales y funciones utilitarias cubiertas por pruebas unitarias |
| Reusabilidad     | Al menos 3 componentes diseñados para reutilización en todo el producto |
| Desplegabilidad  | El MVP puede construirse y desplegarse mediante Vercel        |

## Documentos Relacionados

- [Visión General del Producto](01-product-overview.es.md)
- [Alcance del MVP](02-mvp-scope.es.md)
- [Modelo de Dominio](03-domain-model.es.md)
