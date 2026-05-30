# Design: Inline Mentor Profile Edit

## Technical Approach

Extend `MentorProfilePage` with local edit state (`isEditing`, `draftBio`, `draftSpecialties`, `isSaving`, `saveError`). On mount, compare `useAuth().user.id` to `mentor.id` for ownership gating. Add `updateProfile` to `MentorService` interface + mock. Tests first per Strict TDD (`openspec/config.yaml: strict_tdd: true`). Covers spec R1–R8.

## Architecture Decisions

### Decision: State model — local state vs. global state

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Local state in MentorProfilePage | Simple, no context needed, cancel-revert is trivial | **Selected** |
| Global store (Zustand/Context) | Over-engineered for MVP scope; no other consumer | Rejected |

**Rationale**: Edit mode affects one screen. Local `useState` keeps cancel-revert trivial (just reassign originals). No cross-screen sync needed.

### Decision: `updateProfile` return type

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `Promise<Mentor>` — returns full mentor | Caller can directly `setMentor(result)` | **Selected** |
| `Promise<void>` — void return | Caller must merge changes manually | Rejected |

**Rationale**: Returning the updated `Mentor` keeps local state sync a one-liner. Mirrors the existing `getById` pattern.

### Decision: Double-save guard mechanism

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `isSaving` boolean flag | Simple, works synchronously | **Selected** |
| AbortController / debounce | Over-engineered for mock service (instant resolution) | Rejected |

**Rationale**: The async handler checks `if (isSaving) return` at entry. Since the mock resolves synchronously, a guard flag is sufficient (R8).

## Data Flow

```
User clicks Edit
  → isEditing=true, capture originals, copy drafts
  → Bio section: paragraph→textarea, Specialties: add/remove shown

User clicks Save
  → isSaving=true, saveError=null
  → mockMentorService.updateProfile(id, { bio, specialty })
    → resolves → setMentor(result), isEditing=false, isSaving=false
    → rejects  → saveError=msg, isSaving=false (stay in edit mode)

User clicks Cancel
  → revert draftBio→originalBio, draftSpecialties→originals
  → isEditing=false, saveError=null
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/mentorService.ts` | Modify | Add `updateProfile(id, data)` to interface + mock; mutate in-memory array |
| `src/services/mentorService.test.ts` | Modify | Add tests for `updateProfile` (success, invalid id) |
| `src/components/screens/MentorProfilePage.tsx` | Modify | Add `useAuth`, edit state, inline editors, save/cancel/error UI |
| `src/components/screens/MentorProfilePage.test.tsx` | Create | Full component test suite for ownership, edit flow, save/cancel/error |

## Interfaces / Contracts

### Added to `MentorService`
```typescript
interface MentorService {
  list(filters?: MentorFilters): Promise<Mentor[]>;
  getById(id: string): Promise<Mentor | null>;
  updateProfile(id: string, data: { bio?: string; specialty?: string[] }): Promise<Mentor>;
}
```

### Component state shape
```typescript
const [isEditing, setIsEditing] = useState(false);
const [draftBio, setDraftBio] = useState("");
const [draftSpecialties, setDraftSpecialties] = useState<string[]>([]);
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState<string | null>(null);
// originals captured when entering edit mode:
let originalBio: string;
let originalSpecialties: string[];
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `mockMentorService.updateProfile` — success returns updated mentor, invalid id rejects | Direct call with assertions on return & mock array mutation |
| Component | R1: Edit button visible only for owner, hidden for non-owner/null | Mock `useAuth` return, render, assert button presence |
| Component | R2: Bio paragraph ↔ textarea toggle | Verify textarea with prefilled value on edit; paragraph on cancel |
| Component | R3: Specialty add/remove | Add tag: verify new tag in list. Remove: verify tag removed |
| Component | R4: Save calls service, updates state, exits edit | Mock `updateProfile`, verify call, verify local state updated |
| Component | R5: Cancel reverts to originals | Edit → change fields → cancel → verify original values restored |
| Component | R6: Loading disables controls | Mock slow promise, assert Save/Cancel buttons disabled during save |
| Component | R7: Error shows inline message | Mock `updateProfile` to reject, verify error text + edit mode persists |
| Component | R8: Double-save ignored | Call save twice, assert `updateProfile` called once |

## Migration / Rollout

No migration required. Feature is additive — existing read-only profile is unchanged for non-owners.

## Open Questions

None.
