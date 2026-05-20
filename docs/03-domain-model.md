# UniMentor — Domain Model

> This document defines the main business entities, relationships, and rules that shape the MVP.

📄 Read this in: **English** | [Español](03-domain-model.es.md)

---

## Executive Summary

UniMentor is built around two actor types — students and mentors — connected through sessions. A `User` base type captures common fields, while `Mentor` and `Student` extend it with role-specific attributes. The `Session` entity represents the core interaction: a booking between a student and a mentor with a lifecycle of status transitions.

## Main Entities

| Entity    | Purpose                                                    |
| --------- | ---------------------------------------------------------- |
| `User`    | Base identity: name, email, role, avatar, bio, created at  |
| `Mentor`  | Extends User with specialty list, average rating, session count |
| `Student` | Extends User with university and career fields             |
| `Session` | A mentorship booking linking a student and a mentor        |

## TypeScript Definition

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

## Relationship Overview

```text
User (base)
├── Mentor (extends User) — has many Sessions
│     └── specialty: string[]
│     └── rating: number (average)
│     └── sessionCount: number
│
├── Student (extends User) — has many Sessions
│     └── university: string
│     └── career: string
│
Session
  ├── mentorId → Mentor
  ├── studentId → Student
  ├── status: SessionStatus
  └── rating?: number (set after completion)
```

## Business Rules

| Rule                                          | Explanation                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| A mentor can have multiple sessions           | A mentor can be booked by many different students                          |
| A student can book multiple sessions          | A student can book with different mentors over time                        |
| Session status workflow is linear             | `pending → confirmed → completed` or `cancelled` at any point              |
| Rating is given after a completed session     | The `rating` field is set only when status transitions to `completed`      |
| Rating is a single integer (1–5)              | Stars map directly to integer values, no half-star precision in the MVP    |
| Average rating updates automatically          | `Mentor.rating` is recalculated from all completed session ratings         |

## Enumerations

| Enum           | Values                                          |
| -------------- | ----------------------------------------------- |
| `UserRole`     | `"student"`, `"mentor"`                         |
| `SessionStatus` | `"pending"`, `"confirmed"`, `"completed"`, `"cancelled"` |

## Related Documents

- [MVP Scope](02-mvp-scope.md)
- [Functional Specification](07-functional-specification.md)
- [Tech Stack](04-tech-stack.md)
