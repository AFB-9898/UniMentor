# UniMentor — Modelo de Dominio

> Este documento define las entidades de negocio principales, las relaciones y las reglas que conforman el MVP.

📄 Leer en: [English](03-domain-model.md) | **Español**

---

## Resumen Ejecutivo

UniMentor se construye alrededor de dos tipos de actores — estudiantes y mentores — conectados a través de sesiones. Un tipo base `User` agrupa los campos comunes, mientras que `Mentor` y `Student` lo extienden con atributos específicos de cada rol. La entidad `Session` representa la interacción principal: una reserva entre un estudiante y un mentor con un ciclo de vida de transiciones de estado.

## Entidades Principales

| Entidad   | Propósito                                                     |
| --------- | ------------------------------------------------------------- |
| `User`    | Identidad base: nombre, email, rol, avatar, bio, fecha de creación |
| `Mentor`  | Extiende User con lista de especialidades, calificación promedio, conteo de sesiones |
| `Student` | Extiende User con campos de universidad y carrera             |
| `Session` | Una reserva de mentoría que vincula a un estudiante y un mentor |

## Definición en TypeScript

```typescript
export type UserRole = "student" | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Mentor extends User {
  role: "mentor";
  specialty: string[];
  rating: number;
  sessionCount: number;
}

export interface Student extends User {
  role: "student";
  university: string;
  career: string;
}

export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  status: SessionStatus;
  date: string;
  topic: string;
  notes?: string;
  rating?: number;
  createdAt: string;
}
```

## Relaciones entre Entidades

```text
User (base)
├── Mentor (extiende User) — tiene muchas Sessions
│     └── specialty: string[]
│     └── rating: number (promedio)
│     └── sessionCount: number
│
├── Student (extiende User) — tiene muchas Sessions
│     └── university: string
│     └── career: string
│
Session
  ├── mentorId → Mentor
  ├── studentId → Student
  ├── status: SessionStatus
  └── rating?: number (se asigna al completar)
```

## Reglas de Negocio

| Regla                                            | Explicación                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| Un mentor puede tener múltiples sesiones         | Un mentor puede ser reservado por muchos estudiantes diferentes           |
| Un estudiante puede reservar múltiples sesiones  | Un estudiante puede reservar con diferentes mentores a lo largo del tiempo |
| El flujo de estado de sesión es lineal           | `pending → confirmed → completed` o `cancelled` en cualquier punto        |
| La calificación se asigna después de la sesión   | El campo `rating` se establece solo cuando el estado pasa a `completed`   |
| La calificación es un entero único (1–5)         | Las estrellas se corresponden directamente con valores enteros, sin medias estrellas en el MVP |
| La calificación promedio se actualiza automáticamente | `Mentor.rating` se recalcula a partir de todas las calificaciones de sesiones completadas |

## Enumeraciones

| Enumeración   | Valores                                         |
| ------------- | ----------------------------------------------- |
| `UserRole`    | `"student"`, `"mentor"`                         |
| `SessionStatus` | `"pending"`, `"confirmed"`, `"completed"`, `"cancelled"` |

## Documentos Relacionados

- [Alcance del MVP](02-mvp-scope.es.md)
- [Especificación Funcional](07-functional-specification.es.md)
- [Stack Tecnológico](04-tech-stack.es.md)
