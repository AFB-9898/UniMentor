# UniMentor — Flujo de Trabajo en Git

> Este documento define el flujo de trabajo con ramas, commits y pull requests para un proyecto académico individual.

📄 Leer en: [English](06-git-workflow.md) | **Español**

---

## Seguimiento del Trabajo

UniMentor utiliza GitHub Issues para registrar tareas, bugs y trabajo de documentación. Cada cambio significativo debe estar vinculado a un issue para garantizar la trazabilidad en la evaluación académica.

## Estrategia de Ramas

Se utiliza una única rama permanente:

| Rama     | Propósito                                                |
| -------- | -------------------------------------------------------- |
| `main`   | Rama por defecto, versión estable y desplegable          |

Para un proyecto académico individual, esta estrategia simple mantiene el flujo de trabajo centrado en la implementación. Los cambios significativos pueden utilizar un pull request directo a `main`.

## Formato de Commits

```
type(scope): descripción breve
```

Usar el imperativo en presente. Mantener la línea de asunto por debajo de 72 caracteres.

### Tipos Permitidos

| Tipo       | Cuándo usarlo                                   |
| ---------- | ----------------------------------------------- |
| `feat`     | Una nueva funcionalidad o componente            |
| `fix`      | Una corrección de bug                           |
| `docs`     | Cambios en documentación (README, docs/, AGENTS.md) |
| `refactor` | Reestructuración de código sin cambios de comportamiento |
| `test`     | Agregar o actualizar pruebas                    |
| `chore`    | Configuración de build, dependencias, herramientas |

### Ejemplos

```
feat(rating-stars): add interactive star rating component
refactor(utils): extract date formatting to formatDate util
docs(mvp-scope): document out-of-scope features
test(search-filter): add filter state change tests
chore(deps): add vitest and testing-library dependencies
```

## Commits Atómicos

Mantener los commits atómicos y revisables:

- Cada commit debe representar un cambio lógico.
- Un nuevo componente debe ser un solo commit (código + tipos).
- Una técnica de refactorización debe ser un solo commit (antes → después).
- La documentación de una funcionalidad debe estar en el mismo commit que el código de la funcionalidad.

## Pull Requests

- Crear PRs para cambios significativos o que abarquen múltiples archivos.
- Referenciar el issue relacionado en la descripción del PR.
- Incluir un breve resumen de qué cambió y por qué.
- Asegurarse de que la build pase (`npm run build`) antes de solicitar revisión.

## Lista de Verificación para la Defensa Final

- [ ] Rama `main` estable con historial de commits limpio.
- [ ] `README.md` y `README.es.md` actualizados.
- [ ] Suite de documentación en `docs/` (7 archivos).
- [ ] `AGENTS.md` con contexto del proyecto para agentes de IA.
- [ ] Instrucciones de instalación y ejecución documentadas.
- [ ] Capturas de pantalla o assets de demo en `docs/mockups/`.
- [ ] Enlace al repositorio: https://github.com/AFB-9898/UniMentor

## Documentos Relacionados

- [Arquitectura](05-architecture.es.md)
- [Stack Tecnológico](04-tech-stack.es.md)
