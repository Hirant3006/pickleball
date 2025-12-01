# Story 1.2: Implement `useUserSessions` Hook for Data Fetching

**Status:** review

---

## User Story

As a **system**,
I want **to efficiently fetch all sessions relevant to the current user**,
So that **the Session Dashboard can display personalized session data**.

---

## Acceptance Criteria

*   **AC3:** GIVEN a user is authenticated, WHEN the `useUserSessions` hook is called, THEN it returns a list of sessions where the user is either a host or a player, along with loading and error states.

---

## Implementation Details

### Tasks / Subtasks

*   [x] Create `src/hooks/useUserSessions.ts`.
*   [x] Implement logic within the hook to get the current authenticated user's `uid` (using Firebase Auth context).
*   [x] Implement logic to query the Firebase `/sessions` path to retrieve all available sessions.
*   [x] Filter the fetched sessions on the client-side to include only those where the current user's `uid` is a key in the `players` object or matches the session's `hostId`.
*   [x] For each relevant session, calculate `totalPlayers` (from `Object.keys(session.players).length`) and `totalExpenses` (by summing the `amount` of all entries in `session.expenses`).
*   [x] The hook should return the list of processed sessions, a `loading` boolean state, and an `error` state (e.g., `null` or an `Error` object).

### Technical Summary

This story focuses on creating the `useUserSessions` custom hook. This hook will encapsulate the logic for interacting with Firebase to retrieve all sessions relevant to the currently authenticated user. It will also perform necessary client-side data processing, such as filtering sessions and calculating aggregate values like total players and expenses. This hook will be a foundational piece for the Session Dashboard.

### Project Structure Notes

-   **Files to modify:**
    *   `src/hooks/useUserSessions.ts` (CREATE)
-   **Expected test locations:** `src/hooks/__tests__/useUserSessions.test.ts`
-   **Estimated effort:** 3 story points
-   **Prerequisites:** Story 1.1 (Session data model in `src/lib/types.ts` includes `name`, `date`, and `hostId`).

### Key Code References

*   `src/lib/firebase.ts` (Firebase instance)
*   `src/lib/types.ts` (Session type definition)
*   `src/hooks/useExpenses.ts` (as a reference for custom hook structure and Firebase interaction patterns)

---

## Context References

**Tech-Spec:** [../tech-spec.md](../tech-spec.md) - Primary context document containing:

-   Brownfield codebase analysis (if applicable)
-   Framework and library details with versions
-   Existing patterns to follow
-   Integration points and dependencies
-   Complete implementation guidance

**Architecture:** Not applicable

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

Implementation Plan:
1. Created useUserSessions.ts following existing hook pattern from useExpenses.ts
2. Implemented Firebase realtime listener on /sessions path
3. Added client-side filtering for sessions where user is host or player
4. Calculated totalPlayers from players object keys length
5. Calculated totalExpenses by summing expense amounts
6. Exported UserSession interface extending Session with calculated fields
7. Return sessions array, loading state, error state

### Completion Notes

Story 1.2 complete. useUserSessions hook created following established patterns. Hook fetches all sessions from Firebase, filters for current user (host or player), calculates aggregate values (totalPlayers, totalExpenses), and returns processed sessions with loading/error states. Real-time updates via onValue listener.

### Files Modified

*   `src/hooks/useUserSessions.ts` - Created new hook for fetching user sessions

### Test Results

TypeScript build: ✓ Passed
Production build: ✓ Passed (no type errors)

---

## Review Notes

<!-- Will be populated during code review -->
