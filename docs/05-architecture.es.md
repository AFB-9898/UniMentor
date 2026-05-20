# UniMentor — Arquitectura Interna

> Este documento define la arquitectura del frontend, las capas de componentes y los límites que mantienen el MVP mantenible.

📄 Leer en: [English](05-architecture.md) | **Español**

---

## Objetivos de Arquitectura

- Mantener los componentes de UI reutilizables mediante la separación por capas de Atomic Design.
- Encapsular el acceso al backend detrás de servicios — los componentes no deben llamar a InsForge directamente.
- Mantener las reglas de negocio fuera del JSX y en funciones puras o servicios.
- Hacer que la lógica importante sea testeable con interfaces bien definidas.
- Mantener bajo acoplamiento entre componentes y fuentes de datos.

## Vista General de la Arquitectura

```text
┌─────────────────────────────────────────────────────┐
│                     SCREENS                          │
│  (Páginas: MentorSearch, MentorProfile, Dashboard...)│
├─────────────────────────────────────────────────────┤
│                     ORGANISMOS                       │
│  (UserProfileCard — orquesta átomos/moléculas)      │
├─────────────────────────────────────────────────────┤
│                     MOLÉCULAS                        │
│  (SearchFilterBar — combina inputs + estado local)  │
├─────────────────────────────────────────────────────┤
│                       ÁTOMOS                         │
│  (RatingStars — primitivo, sin dependencias)        │
├─────────────────────────────────────────────────────┤
│      SERVICIOS         │      HOOKS                 │
│  (Acceso a datos,      │  (Hooks personalizados)    │
│   lógica de negocio)   │                             │
├─────────────────────────────────────────────────────┤
│                     INSFORGE (BaaS)                  │
│  (PostgreSQL, Auth, Storage, API REST)              │
└─────────────────────────────────────────────────────┘
```

El flujo de datos es descendente: Screens → Organismos → Moléculas → Átomos.
El acceso a datos es transversal: Componentes → Servicios → InsForge.

## Capas de Atomic Design

| Capa       | Directorio    | Ejemplo                    | Características                                |
| ---------- | ------------- | -------------------------- | ---------------------------------------------- |
| Átomos     | `atoms/`      | `RatingStars`              | Primitivos, sin dependencias internas          |
| Moléculas  | `molecules/`  | `SearchFilterBar`          | Combina inputs, gestiona estado local           |
| Organismos | `organisms/`  | `UserProfileCard`          | Orquesta átomos + moléculas, consciente del dominio |
| Screens    | `screens/`    | `MentorSearchScreen`       | Páginas completas, raíz de composición          |

### Átomo — RatingStars

Componente de calificación por estrellas que muestra o captura un valor de 1 a 5.

- **Props:** `value`, `interactive?`, `onChange?`, `size?`
- **Contextos de reutilización:** Perfil de mentor (visualización), feedback post-sesión (interactivo), resúmenes de reseñas.
- **Regla:** Sin dependencias de otros componentes. Sin acceso directo al backend.

### Molécula — SearchFilterBar

Un input de búsqueda combinado con filtros dinámicos de selección.

- **Props:** `fields` (configuración de filtros), `onFilter` (callback), `placeholder?`
- **Contextos de reutilización:** Búsqueda de mentores por especialidad, filtro de historial de sesiones, directorio de estudiantes.
- **Regla:** Gestiona estado de filtros local. Llama a `onFilter` hacia arriba — nunca llama a servicios directamente.

### Organismo — UserProfileCard

Tarjeta de perfil de usuario que integra RatingStars y muestra datos de mentor o estudiante.

- **Props:** `user` (Mentor | Student), `variant?` (compact | detailed), `actions?` (ReactNode)
- **Contextos de reutilización:** Resultados de búsqueda, detalle de perfil de mentor, dashboard, listas de sesiones.
- **Regla:** Orquesta componentes hijos. Conoce los tipos de dominio (Mentor, Student) pero delega el acceso a datos a los servicios.

## Reglas de las Capas

| Regla                                               | Motivo                                                   |
| --------------------------------------------------- | -------------------------------------------------------- |
| Los componentes no deben llamar a InsForge directamente | Mantiene la UI testeable y desacoplada del backend     |
| Los servicios son dueños de todo el acceso a datos  | Punto único de cambio para llamadas a la API            |
| Los átomos no tienen dependencias de dominio        | Máxima reutilización en toda la línea de producto       |
| Las reglas de negocio deben ser funciones puras     | Permite pruebas unitarias fiables                        |
| Los props se tipan con interfaces de TypeScript     | Validación en compilación, autocompletado               |

## Estructura Actual del Proyecto

```text
src/
├── components/
│   ├── atoms/RatingStars.tsx
│   ├── molecules/SearchFilterBar.tsx
│   ├── organisms/UserProfileCard.tsx
│   └── screens/
├── services/
├── hooks/
├── utils/formatDate.ts
├── types/index.ts
├── backend/client.ts
├── theme/ThemeProvider.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Técnicas de Refactorización Aplicadas

| Técnica             | Problema                                   | Solución                                      |
| ------------------- | ------------------------------------------ | --------------------------------------------- |
| Extract Method      | Formateo de fechas duplicado en varios archivos | Centralizado `formatDate()` en `utils/`     |
| Replace Magic String | Estados de sesión como literales de string sin tipo | Tipo `SessionStatus` definido en `types/` |

## Documentos Relacionados

- [Stack Tecnológico](04-tech-stack.es.md)
- [Modelo de Dominio](03-domain-model.es.md)
- [Especificación Funcional](07-functional-specification.es.md)
