# UniMentor — Stack Tecnológico

> Este documento explica las tecnologías seleccionadas y las razones detrás de cada elección.

📄 Leer en: [English](04-tech-stack.md) | **Español**

---

## Resumen del Stack

| Categoría           | Tecnología          | Versión | Motivo                                                 |
| ------------------- | ------------------- | ------- | ------------------------------------------------------ |
| UI Framework        | React               | 19      | El modelo de componentes se alinea con Atomic Design   |
| Lenguaje            | TypeScript          | 5.8     | Seguridad de tipos, autocompletado, validación en compilación |
| Estilos             | Tailwind CSS        | 4       | Utility-first, iteración rápida de UI                  |
| Build Tool          | Vite                | 6       | HMR rápido, bundling moderno basado en ESM             |
| Routing             | React Router DOM    | 7       | Routing estándar del lado del cliente para SPAs        |
| Testing             | Vitest              | 4       | Testing unitario/de integración rápido, nativo de Vite |
| Backend / BaaS      | InsForge            | —       | Postgres, Auth, Storage — reduce la sobrecarga del backend |
| Base de Datos       | PostgreSQL          | —       | Modelo relacional ideal para usuarios, sesiones, calificaciones |
| Autenticación       | InsForge Auth       | —       | Gestión de identidad integrada                         |
| Almacenamiento      | InsForge Storage    | —       | Almacenamiento de avatares y documentos                |
| Despliegue          | Vercel              | —       | CI/CD simple y despliegues de vista previa             |

## Por Qué Este Stack

El proyecto tiene una ventana de entrega académica limitada y debe priorizar un MVP funcional y desplegable. InsForge elimina la necesidad de desarrollo backend personalizado mientras conserva el poder de una base de datos relacional. React 19 + TypeScript 5.8 proporcionan una base moderna y type-safe. Tailwind CSS 4 con el plugin de Vite permite un desarrollo de UI rápido y consistente sin la sobrecarga de archivos CSS. Vitest se integra directamente con Vite para una configuración de testing mínima.

## Estrategia de Estilos

Tailwind CSS se configura a través del plugin `@tailwindcss/vite` y se importa desde `src/index.css`. El CSS global se limita a directivas de Tailwind, variables de tema y reseteos base. Todo el estilo de los componentes utiliza clases utilitarias de Tailwind directamente en el JSX.

## Arquitectura de Componentes

Los componentes siguen las capas de Atomic Design (ver [Arquitectura](05-architecture.es.md)). Cada componente recibe props tipadas mediante interfaces de TypeScript. La gestión de estado es local (`useState`) o se pasa mediante props; no se utiliza ninguna biblioteca de estado global en el MVP.

## Objetivos de Testing

- Comportamiento de renderizado e interacción de `RatingStars`.
- Gestión de estado de filtros de `SearchFilterBar`.
- Renderizado condicional de `UserProfileCard` (mentor vs estudiante).
- Utilidad `formatDate` (resultado de la refactorización Extract Method).
- Validación a nivel de tipos de `SessionStatus` y `UserRole`.

## Documentos Relacionados

- [Arquitectura](05-architecture.es.md)
- [Especificación Funcional](07-functional-specification.es.md)
- [Modelo de Dominio](03-domain-model.es.md)
