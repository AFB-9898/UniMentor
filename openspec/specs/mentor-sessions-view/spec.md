# Mentor Sessions View Specification

## Purpose

Enable mentors to view their own sessions with student names and fix `SessionContext` to use the authenticated user instead of hardcoded IDs.

## Requirements

### Requirement: listByUser Matches Both Participant Roles

`sessionService.listByUser(userId)` MUST return sessions where `userId` matches EITHER `studentId` OR `mentorId`.

#### Scenario: Student lists sessions

- GIVEN sessions exist with `studentId="student-1"`
- WHEN `listByUser("student-1")` resolves
- THEN it returns sessions where `studentId === "student-1"`

#### Scenario: Mentor lists sessions

- GIVEN sessions exist with `mentorId="1"`
- WHEN `listByUser("1")` resolves
- THEN it returns sessions where `mentorId === "1"`

### Requirement: SessionContext Authenticated Session Loading

`SessionProvider` MUST read `user.id` from `useAuth()` and MUST wait for `isLoading=false` before fetching sessions. It MUST NOT hardcode any user ID.

#### Scenario: Authenticated student loads sessions

- GIVEN `useAuth()` returns `{ user: { id: "student-1" }, isLoading: false }`
- WHEN `SessionProvider` mounts
- THEN it calls `listByUser("student-1")` and stores returned sessions

#### Scenario: Authenticated mentor loads sessions

- GIVEN `useAuth()` returns `{ user: { id: "1" }, isLoading: false }`
- WHEN `SessionProvider` mounts
- THEN it calls `listByUser("1")` and stores returned sessions

#### Scenario: Auth not yet ready

- GIVEN `useAuth()` returns `{ isLoading: true }`
- WHEN `SessionProvider` mounts
- THEN it MUST NOT fetch sessions until `isLoading` becomes `false`

### Requirement: User Name Lookup

A `getUserName(id)` utility MUST resolve a known user ID to its display name. For unknown IDs it MUST return a fallback string.

#### Scenario: Known user ID

- GIVEN the name map includes `{ "student-1": "Ana López" }`
- WHEN `getUserName("student-1")` is called
- THEN it returns `"Ana López"`

#### Scenario: Unknown user ID

- GIVEN `"unknown-99"` is not in the name map
- WHEN `getUserName("unknown-99")` is called
- THEN it returns `"Usuario desconocido"` or equivalent fallback

### Requirement: MentorDashboard Shows Student Names

`MentorDashboard` MUST display the student name (resolved via `getUserName`) in each upcoming session card.

#### Scenario: Mentor views upcoming sessions

- GIVEN a mentor with upcoming sessions is logged in
- WHEN the dashboard renders
- THEN each session card shows the student name alongside topic and date

### Requirement: MySessionsPage Conditional Name Display

`MySessionsPage` MUST show the student name when the logged-in user is a mentor, and MUST show the mentor name when the user is a student (existing behavior preserved).

#### Scenario: Mentor views MySessionsPage

- GIVEN the logged-in user has `role="mentor"`
- WHEN the page renders session cards
- THEN each card shows the student name (from `getUserName(session.studentId)`)

#### Scenario: Student views MySessionsPage

- GIVEN the logged-in user has `role="student"`
- WHEN the page renders session cards
- THEN each card shows the mentor name (existing behavior, unchanged)

### Requirement: No Sessions for Unauthenticated Users

When no user is authenticated, the system MUST NOT display any sessions.

#### Scenario: Unauthenticated access

- GIVEN `useAuth()` returns `{ user: null, isAuthenticated: false }`
- WHEN `SessionProvider` mounts
- THEN no session fetch is triggered and the session list remains empty
