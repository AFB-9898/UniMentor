# Refactorización — UniMentor

Técnicas de refactorización aplicadas al código del proyecto, con código antes/después y justificación técnica.

---

## Técnica 1 — Extract Method

### Problema detectado

El formateo de fechas estaba repetido en múltiples componentes, haciendo que cualquier cambio de formato requiriera modificar cada aparición manualmente. Esto viola el principio DRY (Don't Repeat Yourself) y aumenta la probabilidad de errores por inconsistencia.

### Código antes (ANTES)

```typescript
// En el componente SearchFilterBar.tsx:
const fechaStr = new Date(session.date).toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// En el componente UserProfileCard.tsx (código duplicado):
const createdDate = new Date(user.createdAt).toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
```

### Código después (DESPUÉS)

```typescript
// Extraído a src/utils/formatDate.ts — una sola definición reusable:
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

```typescript
// En cualquier componente que necesite formatear fechas:
import { formatDate } from "../utils/formatDate";

// Uso:
<p>{formatDate(session.date)}</p>
<p>{formatDate(user.createdAt)}</p>
```

### Beneficio obtenido

- **Mantenibilidad:** un solo punto de cambio para el formato de fecha.
- **Reutilización:** la función puede usarse en cualquier componente futuro.
- **Legibilidad:** `formatDate(fecha)` es más expresivo que 4 líneas de `toLocaleDateString`.

---

## Técnica 2 — Replace Magic String

### Problema detectado

Los estados de las sesiones (`"pending"`, `"confirmed"`, `"completed"`, `"cancelled"`) estaban escritos como strings literales en el código. Esto es propenso a errores tipográficos (ej: `"pendin"` en vez de `"pending"`) y no ofrece autocompletado ni validación en tiempo de compilación.

### Código antes (ANTES)

```typescript
// En múltiples componentes — strings literales sin tipo:
if (session.status === "pending") {
  mostrarPendiente();
}
if (session.status === "confimed") { // ← Error: mal escrito, no hay alerta
  mostrarConfirmado();
}
```

### Código después (DESPUÉS)

```typescript
// Definido en src/types/index.ts — tipo centralizado:
export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";
```

```typescript
// En los componentes — uso con TypeScript:
if (session.status === "pending") {
  mostrarPendiente();
}
// Si escribís mal, TypeScript te lo marca al instante.
```

### Beneficio obtenido

- **Type safety:** TypeScript valida el string al compilar.
- **Autocompletado:** el editor sugiere los valores válidos.
- **Mantenibilidad:** si se agrega un nuevo estado (ej: `"no_show"`), se cambia en un solo lugar.
