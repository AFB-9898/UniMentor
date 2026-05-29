import type { Mentor } from "../types";

export const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@ejemplo.com",
    role: "mentor",
    bio: "Ingeniero de software con 8+ años de experiencia en desarrollo web. Especialista en React y TypeScript. Mentor apasionado por ayudar a estudiantes a dar sus primeros pasos en la industria tech.",
    specialty: ["React", "TypeScript"],
    rating: 4,
    sessionCount: 23,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@ejemplo.com",
    role: "mentor",
    bio: "Diseñadora UX/UI con enfoque en productos digitales. Trabajó con startups y empresas globales. Cree firmemente que el buen diseño empieza por entender al usuario.",
    specialty: ["UX Design", "Figma"],
    rating: 5,
    sessionCount: 45,
    createdAt: "2025-11-20",
  },
  {
    id: "3",
    name: "Luis Torres",
    email: "luis@ejemplo.com",
    role: "mentor",
    bio: "Backend developer especializado en Node.js y bases de datos. Contribuidor de proyectos open source. Me encanta enseñar las bases sólidas que todo dev debería tener.",
    specialty: ["Node.js", "PostgreSQL"],
    rating: 3,
    sessionCount: 12,
    createdAt: "2026-03-08",
  },
];
