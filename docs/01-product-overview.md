# UniMentor — Product Overview

> This document defines what UniMentor is, who it serves, and why the project exists.

📄 Read this in: **English** | [Español](01-product-overview.es.md)

---

## Document Purpose

Explain the product vision, the problem it solves, and the business context before implementation details.

## Executive Summary

UniMentor is an EdTech mentorship marketplace that connects university students with graduate mentors for professional career guidance. Students find experienced professionals who share their academic background, while graduates give back to their university community by mentoring the next generation.

The MVP focuses on mentor discovery, profile viewing, session management, and a star-based rating system — all built with reusable Atomic Design components.

## Problem

University students often lack access to professionals in their field of study. Career guidance is scattered, informal, or unavailable. Meanwhile, recent graduates have valuable experience to share but no structured channel to connect with students who need it. The gap affects career decision-making, professional networking, and academic motivation.

Current alternatives are fragmented:
- Informal WhatsApp or social media groups with no structure.
- University career centers with limited reach and availability.
- General professional networks not designed for academic mentorship.

## Proposed Solution

UniMentor centralises mentorship discovery and management in one web application. Students search for mentors by specialty and name, view detailed profiles with ratings and experience, book sessions, and provide feedback after completion. Mentors build their professional reputation through ratings and session history.

## Target Users

| Actor   | Main Need                                                         |
| ------- | ----------------------------------------------------------------- |
| Student | Find and book mentors for career guidance and professional advice |
| Mentor  | Offer mentorship, share experience, and build a reputation        |

## Core Workflow

```
Student registration → Mentor search → Profile view → Session booking
      → Session completion → Rating & feedback → History review
```

## Product Line

UniMentor belongs to the **Educational Platforms (EdTech)** product line, as part of the Software Engineering II course. It demonstrates reusable component design, refactoring techniques, and atomic architecture within a realistic academic context.

## Project Goals

- Build a functional academic MVP with professional documentation.
- Demonstrate three reusable components with clear interfaces and low coupling.
- Apply two recognised refactoring techniques (Extract Method, Replace Magic String).
- Follow Atomic Design methodology for UI architecture.
- Present the project as a GitHub-ready portfolio case study.

## Non-Goals

- Payment processing or subscription billing.
- Real-time chat between students and mentors.
- Admin panel or user management dashboard.
- Native mobile applications.
- Video call or meeting integration.

## Related Documents

- [MVP Scope](02-mvp-scope.md)
- [Domain Model](03-domain-model.md)
- [Functional Specification](07-functional-specification.md)
