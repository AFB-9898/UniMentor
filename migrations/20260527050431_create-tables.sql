-- Create tables for UniMentor
-- Based on docs/08-data-architecture.md

-- Users table (base identity for all platform users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'mentor')),
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentors table (one-to-one with users, role = 'mentor')
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    session_count INTEGER NOT NULL DEFAULT 0,
    university TEXT,
    career TEXT
);

-- Students table (one-to-one with users, role = 'student')
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    university TEXT NOT NULL,
    career TEXT NOT NULL
);

-- Sessions table (mentorship bookings)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES mentors(id),
    student_id UUID NOT NULL REFERENCES students(id),
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    date DATE NOT NULL,
    topic TEXT NOT NULL,
    notes TEXT,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
