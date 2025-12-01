# Story 1.4: Archive History Viewing

**Status:** Draft

---

## User Story

As a player reviewing past games,
I want to view archived sessions with full expense and settlement details,
So that I can verify past payments and track spending over time.

---

## Acceptance Criteria

**AC #1:** "View Archives" link accessible from home page
**Given** I am on the home page
**When** I look for navigation options
**Then** I see a "View Archives" link or button that navigates to `/archives`

**AC #2:** Archives page lists all past sessions sorted by date (newest first)
**Given** There are multiple archived sessions in Firebase
**When** I navigate to the archives page
**Then** All archived sessions are displayed in a list, sorted by `archivedAt` descending (newest first)

**AC #3:** Each archived session displays: date, player names, total expenses
**Given** The archives list is displayed
**When** I view each session entry
**Then** I see the archive date, list of player names, and total expense amount

**AC #4:** Clicking a session shows full details: itemized expenses, settlements, who paid whom
**Given** I am viewing the archives list
**When** I click on an archived session
**Then** I am navigated to the session detail view showing all expenses, settlements, and payment history

**AC #5:** Archive view is read-only (no editing or deleting)
**Given** I am viewing an archived session's details
**When** The page loads
**Then** No edit controls are visible (no "Add Expense", no "Mark as Paid", no delete buttons)

**AC #6:** Archives load within 2s on 3G connection
**Given** I navigate to the archives page
**When** The page is loading
**Then** The list of archived sessions appears within 2 seconds (target performance)

---

## Implementation Details

### Tasks / Subtasks

- [ ] Create archives list component (AC: #1, #2, #3)
  - [ ] Create `src/components/SessionArchive.tsx`
  - [ ] Add route `/archives` in `src/App.tsx`
  - [ ] Query Firebase for sessions where `archived === true`
  - [ ] Sort sessions by `archivedAt` descending
  - [ ] Display list with: archive date (formatted), player names, total expenses

- [ ] Add "View Archives" navigation link (AC: #1)
  - [ ] Update home page component (`SessionCreate.tsx` or separate home component)
  - [ ] Add link/button to navigate to `/archives`
  - [ ] Style consistently with Swiss minimalist theme

- [ ] Implement archive session detail view (AC: #4, #5)
  - [ ] Use existing session view component (from Story 1.1)
  - [ ] Ensure read-only mode is enforced (from Story 1.3)
  - [ ] Display all expenses (itemized list)
  - [ ] Display all settlements (who paid whom, marked as paid)
  - [ ] Show archive date at top

- [ ] Optimize Firebase query for performance (AC: #6)
  - [ ] Use Firebase `.orderByChild('archivedAt')` query
  - [ ] Limit initial load (e.g., 20 most recent sessions)
  - [ ] Consider pagination for large archives (future enhancement)
  - [ ] Index `archived` and `archivedAt` fields in Firebase rules (optional)

- [ ] Format dates for display (AC: #3, #4)
  - [ ] Convert Unix timestamps to human-readable format
  - [ ] Use format: "Dec 1, 2025" or "12/01/2025"
  - [ ] Consider using date-fns or native Intl.DateTimeFormat

- [ ] Test archive viewing flow (AC: all)
  - [ ] Archive multiple sessions
  - [ ] Navigate to archives page
  - [ ] Verify sessions sorted correctly (newest first)
  - [ ] Click session, verify details load
  - [ ] Verify read-only mode (no edit controls)
  - [ ] Test performance with simulated slow network (Chrome DevTools throttling)

### Technical Summary

**Approach:**
- Archives page is a separate route with dedicated component
- Firebase query filters by `archived === true` and orders by `archivedAt`
- Clicking an archive navigates to same session view as active sessions, but read-only mode enforced
- Lazy-load archives component (code-split) to keep main bundle small

**Key Technical Decisions:**
- **Separate route:** `/archives` for dedicated archive viewing
- **Reuse session view:** Don't duplicate UI, reuse existing session component in read-only mode
- **Firebase indexing:** Consider adding index on `archived` + `archivedAt` for query performance
- **Date formatting:** Use native JavaScript date formatting (no external library for MVP)

**Files/Modules Involved:**
- `src/components/SessionArchive.tsx` - Archives list view
- `src/App.tsx` - Add `/archives` route
- Home page component - Add "View Archives" link
- Firebase query - Filter archived sessions

### Project Structure Notes

- **Files to modify:**
  - `src/App.tsx` (add `/archives` route)
  - Home page component (add "View Archives" link)

- **Files to create:**
  - `src/components/SessionArchive.tsx`

- **Expected test locations:**
  - `src/components/SessionArchive.test.tsx`

- **Estimated effort:** 2 story points

- **Prerequisites:**
  - Story 1.3 complete (archived sessions exist, read-only mode implemented)
  - Firebase contains archived sessions with `archivedAt` timestamps

### Key Code References

**Firebase Query for Archives:**
```typescript
// In SessionArchive.tsx
import { ref, query, orderByChild, equalTo } from 'firebase/database';

const archivesQuery = query(
  ref(db, 'sessions'),
  orderByChild('archived'),
  equalTo(true)
);

// Subscribe to query
onValue(archivesQuery, (snapshot) => {
  const sessions = [];
  snapshot.forEach((child) => {
    sessions.push({ id: child.key, ...child.val() });
  });

  // Sort by archivedAt descending (newest first)
  sessions.sort((a, b) => b.archivedAt - a.archivedAt);

  setArchivedSessions(sessions);
});
```

**Date Formatting:**
```typescript
// Format Unix timestamp to readable date
const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(timestamp));
};

// Usage: formatDate(session.archivedAt) => "Dec 1, 2025"
```

**Archives List UI (Swiss Minimalist):**
```tsx
<div className="max-w-4xl mx-auto p-8">
  <h1 className="text-4xl font-bold mb-8">Session Archives</h1>

  <div className="space-y-4">
    {archivedSessions.map(session => (
      <Link
        key={session.id}
        to={`/session/${session.id}`}
        className="block p-6 border border-black hover:bg-black hover:text-white transition"
      >
        <div className="text-sm mb-2">{formatDate(session.archivedAt)}</div>
        <div className="font-bold mb-1">
          Players: {Object.values(session.players).map(p => p.name).join(', ')}
        </div>
        <div className="text-lg">
          Total: ${calculateTotal(session.expenses)}
        </div>
      </Link>
    ))}
  </div>
</div>
```

**Performance Optimization:**
- Lazy-load archives component:
  ```typescript
  // In App.tsx
  const SessionArchive = lazy(() => import('./components/SessionArchive'));
  ```
- Consider limiting query results:
  ```typescript
  import { limitToLast } from 'firebase/database';

  const archivesQuery = query(
    ref(db, 'sessions'),
    orderByChild('archivedAt'),
    limitToLast(20) // Load most recent 20
  );
  ```

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Firebase query patterns and indexing
- Performance targets (2s load on 3G)
- Swiss minimalist design guidelines
- Lazy-loading strategy for archives

**Previous Stories:**
- Story 1.1: Session structure and routing
- Story 1.3: Archive flag and read-only mode (reused in this story)

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
