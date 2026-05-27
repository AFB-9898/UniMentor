-- Seed data for UniMentor development
-- Maps to the existing mock data in the frontend

-- Users (base identities)
INSERT INTO users (id, email, name, role, bio, created_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'carlos@unimentor.dev', 'Carlos Mendoza', 'mentor',
     'Especialista en React y TypeScript con más de 5 años de experiencia ayudando a estudiantes a dominar el desarrollo frontend.', NOW()),
    ('a0000000-0000-0000-0000-000000000002', 'maria@unimentor.dev', 'María García', 'mentor',
     'Diseñadora UX con experiencia en Figma, investigación de usuarios y diseño de interfaces centradas en el usuario.', NOW()),
    ('a0000000-0000-0000-0000-000000000003', 'luis@unimentor.dev', 'Luis Torres', 'mentor',
     'Ingeniero de backend especializado en Node.js y PostgreSQL. Mentor de estudiantes que quieren aprender bases de datos y APIs.', NOW()),
    ('a0000000-0000-0000-0000-000000000004', 'abraham@unimentor.dev', 'Abraham Flores', 'student',
     'Estudiante de Ingeniería de Sistemas apasionado por el desarrollo web.', NOW())
ON CONFLICT (id) DO NOTHING;

-- Mentor profiles
INSERT INTO mentors (id, specialty, rating, session_count, university, career) VALUES
    ('a0000000-0000-0000-0000-000000000001', ARRAY['React', 'TypeScript'], 4.0, 23, 'Universidad Mayor de San Simón', 'Ingeniería de Sistemas'),
    ('a0000000-0000-0000-0000-000000000002', ARRAY['UX Design', 'Figma'], 5.0, 45, 'Universidad Católica Boliviana', 'Diseño Gráfico'),
    ('a0000000-0000-0000-0000-000000000003', ARRAY['Node.js', 'PostgreSQL'], 3.0, 12, 'Universidad Privada Boliviana', 'Ingeniería de Sistemas')
ON CONFLICT (id) DO NOTHING;

-- Student profile
INSERT INTO students (id, university, career) VALUES
    ('a0000000-0000-0000-0000-000000000004', 'Universidad Mayor de San Simón', 'Ingeniería de Sistemas')
ON CONFLICT (id) DO NOTHING;

-- Sample sessions (various statuses for testing)
INSERT INTO sessions (id, mentor_id, student_id, status, date, topic, notes, rating, created_at) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004',
     'completed', '2026-05-20', 'Introducción a React con TypeScript',
     'El mentor me explicó los fundamentos de React y cómo integrarlo con TypeScript. Muy claro.', 4, NOW() - INTERVAL '7 days'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004',
     'confirmed', '2026-06-01', 'Principios de UX Design',
     NULL, NULL, NOW() - INTERVAL '2 days'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004',
     'pending', '2026-06-10', 'Modelado de bases de datos relacionales',
     NULL, NULL, NOW()),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004',
     'cancelled', '2026-05-15', 'Patrones avanzados en React',
     'Se canceló por conflicto de horarios.', NULL, NOW() - INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;
