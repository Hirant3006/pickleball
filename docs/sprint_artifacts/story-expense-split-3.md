# Story 1.3: Settlement & Session Archive

**Status:** Draft

---

## User Story

As a player settling up after a game,
I want to mark debts as paid and archive the completed session,
So that we have a clean slate for next week.

---

## Acceptance Criteria

**AC #1:** Each debt has a "Mark as Paid" button visible to all players
**Given** The debt calculator displays debts (e.g., "Bob owes Alice $12.50")
**When** I view the debt list
**Then** Each debt has a "Mark as Paid" button next to it

**AC #2:** Clicking "Mark as Paid" updates the debt status across all devices
**Given** A debt is displayed as unpaid
**When** I click "Mark as Paid"
**Then** The debt is marked as paid in Firebase and all devices show the update within 500ms

**AC #3:** Paid debts show visual indicator (e.g., strikethrough, checkmark)
**Given** A debt has been marked as paid
**When** I view the debt list
**Then** The paid debt displays a visual indicator (strikethrough text, checkmark icon, or grayed out)

**AC #4:** "Archive Session" button appears when all debts are marked paid
**Given** All debts in the session are marked as paid
**When** The UI updates
**Then** An "Archive Session" button becomes visible and enabled

**AC #5:** Archived sessions are removed from active session view
**Given** I am viewing an active session
**When** I click "Archive Session" and confirm
**Then** The session's `archived` flag is set to `true` in Firebase and the session disappears from active views

**AC #6:** Archived sessions cannot be edited (read-only)
**Given** A session has been archived
**When** I attempt to access the session URL
**Then** The session displays in read-only mode with no edit controls (no "Add Expense", no "Mark as Paid")

**AC #7:** Archive timestamp is recorded in Firebase
**Given** I archive a session
**When** The archive operation completes
**Then** Firebase stores an `archivedAt` timestamp (Unix timestamp)

---

## Implementation Details

### Tasks / Subtasks

- [ ] Store settlements in Firebase when debts are calculated (AC: #1, #2)
  - [ ] Modify `src/hooks/useDebts.ts` to write settlements to Firebase
  - [ ] Write to `sessions/{sessionId}/settlements/{settlementId}`
  - [ ] Settlement object: `{ from, to, amount, paid: false, paidAt: null }`

- [ ] Add "Mark as Paid" functionality to DebtCalculator (AC: #1, #2, #3)
  - [ ] Update `src/components/DebtCalculator.tsx`
  - [ ] Add "Mark as Paid" button for each unpaid settlement
  - [ ] On click: update Firebase `settlements/{settlementId}/paid = true`
  - [ ] Set `paidAt` timestamp
  - [ ] Subscribe to settlements with Firebase listener for real-time updates
  - [ ] Apply visual styling for paid debts (Tailwind: `line-through`, checkmark icon)

- [ ] Implement "Archive Session" button logic (AC: #4, #5, #7)
  - [ ] Update `src/components/DebtCalculator.tsx` or create archive button component
  - [ ] Check if all settlements have `paid === true`
  - [ ] If all paid, show "Archive Session" button (enabled)
  - [ ] On click: update Firebase `sessions/{sessionId}/archived = true`
  - [ ] Set `sessions/{sessionId}/archivedAt = Date.now()`
  - [ ] Redirect user to home page after archiving

- [ ] Implement read-only session view for archived sessions (AC: #6)
  - [ ] Update `src/App.tsx` or session view component
  - [ ] Check `session.archived` flag when loading session
  - [ ] If archived: hide ExpenseForm, hide "Mark as Paid" buttons
  - [ ] Display "Archived Session" banner at top
  - [ ] Show archive date from `archivedAt` timestamp

- [ ] Filter archived sessions from active views (AC: #5)
  - [ ] Update home page to query only `archived === false` sessions (if showing active list)
  - [ ] Ensure archived sessions don't appear in "active sessions" list

- [ ] Test settlement tracking and archiving flow (AC: all)
  - [ ] Test marking debts as paid across multiple devices
  - [ ] Verify "Archive Session" button only appears when all paid
  - [ ] Test archiving and verify session becomes read-only
  - [ ] Test archived timestamp is stored correctly
  - [ ] Verify archived session no longer appears in active views

### Technical Summary

**Approach:**
- Settlements are now stored in Firebase (previously calculated client-side only)
- Mark-as-paid updates settlement's `paid` flag in Firebase, triggering real-time UI update
- Archive is a simple boolean flag + timestamp on the session object
- Read-only mode is client-side logic (check `archived` flag, conditionally render controls)

**Key Technical Decisions:**
- **Settlements in Firebase:** Store calculated debts as settlement objects for persistence and tracking
- **Honor system:** No verification required for "Mark as Paid" (anyone can mark, all see update)
- **Archive = soft delete:** Sessions stay in database, just flagged as archived
- **Read-only enforcement:** Client-side only (Firebase rules could enforce in production)

**Files/Modules Involved:**
- `src/hooks/useDebts.ts` - Write settlements to Firebase
- `src/components/DebtCalculator.tsx` - Mark as paid, archive button, paid visual indicators
- `src/App.tsx` or session view - Read-only mode logic
- Firebase data structure - Add settlements and archive flags

### Project Structure Notes

- **Files to modify:**
  - `src/hooks/useDebts.ts` (write settlements to Firebase)
  - `src/components/DebtCalculator.tsx` (mark paid, archive button, styling)
  - `src/App.tsx` or session component (read-only mode)

- **Files to create:**
  - None (all modifications to existing files from Stories 1.1, 1.2)

- **Expected test locations:**
  - `src/components/DebtCalculator.test.tsx` (mark as paid, archive button)
  - Integration test: full flow (add expenses → mark paid → archive)

- **Estimated effort:** 3 story points

- **Prerequisites:**
  - Story 1.1 complete (session structure)
  - Story 1.2 complete (debt calculation, DebtCalculator component)
  - useDebts hook available

### Key Code References

**Firebase Settlements Structure:**
```typescript
{
  sessions: {
    [sessionId]: {
      settlements: {
        [settlementId]: {
          from: "playerId123",  // Debtor
          to: "playerId456",    // Creditor
          amount: 12.50,
          paid: false,          // Updated to true when marked
          paidAt: null          // Unix timestamp when marked paid
        }
      },
      archived: false,
      archivedAt: null  // Unix timestamp when archived
    }
  }
}
```

**Mark as Paid Logic:**
```typescript
// In DebtCalculator.tsx
const handleMarkAsPaid = async (settlementId: string) => {
  await update(ref(db, `sessions/${sessionId}/settlements/${settlementId}`), {
    paid: true,
    paidAt: Date.now()
  });
};
```

**Archive Session Logic:**
```typescript
// Check if all settlements paid
const allPaid = settlements.every(s => s.paid === true);

// Archive button
const handleArchive = async () => {
  await update(ref(db, `sessions/${sessionId}`), {
    archived: true,
    archivedAt: Date.now()
  });
  navigate('/'); // Redirect to home
};
```

**Read-Only Mode:**
```typescript
// In session view component
const isArchived = session?.archived === true;

return (
  <div>
    {isArchived && <div>⚠️ Archived Session (Read-Only)</div>}
    {!isArchived && <ExpenseForm />}
    <DebtCalculator showMarkAsPaid={!isArchived} />
  </div>
);
```

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Firebase data model including settlements and archive flags
- Settlement tracking patterns
- Read-only session logic
- Honor system settlement approach (no verification)

**Previous Stories:**
- Story 1.1: Session Creation & Player Management (session structure)
- Story 1.2: Expense Logging & Debt Calculation (debt calculator, settlements calculation)

---

## Dev Agent Record

### Agent Model Used

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes

<!-- Will be populated during dev-story execution -->

### Files Modified

<!-- Will be populated during dev-story execution -->

### Test Results

<!-- Will be populated during dev-story execution -->

---

## Review Notes

<!-- Will be populated during code review -->
