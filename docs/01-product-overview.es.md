# UniMentor — Visión General del Producto

> Este documento define qué es UniMentor, a quién está dirigido y por qué existe el proyecto.

📄 Leer en: [English](01-product-overview.md) | **Español**

---

## Propósito del Documento

Explicar la visión del producto, el problema que resuelve y el contexto de negocio antes de entrar en detalles de implementación.

## Resumen Ejecutivo

UniMentor es un marketplace EdTech de mentorías que conecta estudiantes universitarios con egresados para orientación profesional. Los estudiantes encuentran profesionales con experiencia que comparten su formación académica, mientras que los egresados retribuyen a su comunidad universitaria mentorizando a la próxima generación.

El MVP se centra en el descubrimiento de mentores, visualización de perfiles, gestión de sesiones y un sistema de calificación basado en estrellas — todo construido con componentes reutilizables siguiendo Atomic Design.

## Problema

Los estudiantes universitarios a menudo no tienen acceso a profesionales de su campo de estudio. La orientación profesional está dispersa, es informal o simplemente no está disponible. Mientras tanto, los egresados recientes tienen experiencia valiosa para compartir pero carecen de un canal estructurado para conectar con quienes la necesitan. Esta brecha afecta la toma de decisiones profesionales, el networking y la motivación académica.

Las alternativas actuales están fragmentadas:
- Grupos informales de WhatsApp o redes sociales sin estructura.
- Centros de orientación universitaria con alcance y disponibilidad limitados.
- Redes profesionales generales no diseñadas para mentorías académicas.

## Solución Propuesta

UniMentor centraliza el descubrimiento y la gestión de mentorías en una aplicación web. Los estudiantes buscan mentores por especialidad y nombre, ven perfiles detallados con calificaciones y experiencia, reservan sesiones y proporcionan feedback al finalizar. Los mentores construyen su reputación profesional a través de calificaciones y su historial de sesiones.

## Usuarios Destinatarios

| Actor    | Necesidad Principal                                              |
| -------- | ---------------------------------------------------------------- |
| Estudiante | Encontrar y reservar mentores para orientación profesional     |
| Mentor   | Ofrecer mentoría, compartir experiencia y construir reputación  |

## Flujo de Trabajo Principal

```
Registro del estudiante → Búsqueda de mentor → Vista de perfil → Reserva de sesión
      → Sesión completada → Calificación y feedback → Revisión del historial
```

## Línea de Producto

UniMentor pertenece a la línea de producto **Plataformas Educativas (EdTech)**, como parte del curso de Ingeniería de Software II. Demuestra diseño de componentes reutilizables, técnicas de refactorización y arquitectura atómica dentro de un contexto académico realista.

## Objetivos del Proyecto

- Construir un MVP académico funcional con documentación profesional.
- Demostrar tres componentes reutilizables con interfaces claras y bajo acoplamiento.
- Aplicar dos técnicas de refactorización reconocidas (Extract Method, Replace Magic String).
- Seguir la metodología Atomic Design para la arquitectura de UI.
- Presentar el proyecto como un caso de estudio listo para GitHub.

## No Objetivos

- Procesamiento de pagos o suscripciones.
- Chat en tiempo real entre estudiantes y mentores.
- Panel de administración o dashboard de gestión de usuarios.
- Aplicaciones móviles nativas.
- Integración de videollamadas o reuniones.

## Documentos Relacionados

- [Alcance del MVP](02-mvp-scope.es.md)
- [Modelo de Dominio](03-domain-model.es.md)
- [Especificación Funcional](07-functional-specification.es.md)
