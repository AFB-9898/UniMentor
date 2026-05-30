# Mentor Profile Edit Specification

## Purpose

Allows a mentor to edit bio and specialties inline on their own profile page. Non-owners see read-only. Save calls `updateProfile`; cancel reverts drafts.

## Requirements

| ID | Name | Strength | Summary |
|----|------|----------|---------|
| R1 | Ownership Gating | MUST | Edit UI only when `useAuth().user.id === mentor.id` |
| R2 | Bio Inline Edit | MUST | Paragraph ↔ textarea on edit/cancel |
| R3 | Specialties Inline Edit | MUST | Add/remove tags in edit mode |
| R4 | Save via updateProfile | MUST | Persist changes, update local state |
| R5 | Cancel Revert | MUST | Restore original bio and specialties |
| R6 | Loading State | MUST | Disable controls while saving |
| R7 | Error Handling | MUST | Show error, stay in edit mode |
| R8 | Double-Save Guard | SHOULD | Ignore clicks while saving in-flight |

### R1: Ownership Gating

The system MUST render the edit UI only for the profile owner.

- GIVEN `useAuth().user.id === mentor.id` — WHEN the profile renders — THEN an Edit button SHALL appear
- GIVEN a non-owner or null user — WHEN the profile renders — THEN no edit UI SHALL appear
- GIVEN `isLoading` is true — WHEN the page mounts — THEN read-only SHALL render; edit MAY appear after auth resolves

### R2: Bio Inline Edit

- GIVEN owner viewing profile — WHEN they click Edit — THEN the bio paragraph SHALL become a textarea pre-filled with current content
- GIVEN owner changed the bio — WHEN they click Cancel — THEN original value SHALL be restored and paragraph view SHOWN
- GIVEN bio is empty — WHEN edit mode activates — THEN an empty textarea with placeholder SHALL appear

### R3: Specialties Inline Edit

- GIVEN owner in edit mode — WHEN they click remove on a tag — THEN that tag SHALL disappear from the displayed list
- GIVEN owner in edit mode — WHEN they type a name and submit — THEN the new tag SHALL appear
- GIVEN owner added/removed tags — WHEN they click Cancel — THEN the original tag set SHALL be restored
- GIVEN mentor has no specialties — WHEN edit mode activates — THEN an empty tag area with an add control SHALL appear

### R4: Save via updateProfile

- GIVEN owner made changes — WHEN they click Save — THEN `updateProfile(mentorId, { bio, specialty })` SHALL be called, local state updated, and edit mode exited
- GIVEN owner made no changes — WHEN they click Save — THEN `updateProfile` SHOULD still be called

### R5: Cancel Revert

- GIVEN owner modified bio and specialties — WHEN they click Cancel — THEN both SHALL revert to original and edit mode SHALL exit

### R6: Loading State

- GIVEN owner clicked Save — WHEN request is pending — THEN Save SHALL show a loading indicator and both Save/Cancel SHALL be disabled

### R7: Error Handling

- GIVEN `updateProfile` rejects — WHEN owner clicks Save — THEN an inline error SHALL appear, edit mode SHALL persist with drafts intact, and owner MAY retry

### R8: Double-Save Guard

- GIVEN a save is in-flight — WHEN owner clicks Save again — THEN the second call SHALL be ignored
