# Story 1.3: Implement Basic Session Dashboard UI and Routing

**Status:** review

---

## User Story

As an **application user**,
I want **to see a list of my sessions on the home page and create new ones**,
So that **I can easily access my ongoing sessions and initiate new ones from a central location**.

---

## Acceptance Criteria

*   **AC2:** GIVEN a user navigates to the application root (`/`), THEN they should see the new `SessionDashboard` component.
*   **AC3:** GIVEN a user is authenticated, WHEN they view the `SessionDashboard`, THEN it uses the `useUserSessions` hook to display a list of their sessions, showing at least the session name and date for each.
*   **AC6:** GIVEN a user is on the dashboard, WHEN they click a "Create New Session" button, THEN they are navigated to the session creation page (e.g., `/create-session`).

---

## Implementation Details

### Tasks / Subtasks

*   [x] Create `src/components/SessionDashboard.tsx`.
*   [x] In `src/components/SessionDashboard.tsx`, use the `useUserSessions` hook to fetch session data.
*   [x] Implement a basic UI in `SessionDashboard.tsx` to display a list of session names and dates.
*   [x] Implement loading and empty states within `SessionDashboard.tsx` (e.g., "Loading sessions...", "No sessions found. Create one!").
*   [x] Add a "Create New Session" button to `SessionDashboard.tsx`.
*   [x] Modify `src/App.tsx` to:
    *   Set the root route (`/`) to render `SessionDashboard.tsx`.
    *   Change the route for `SessionCreate.tsx` to `/create-session`.

### Technical Summary

This story implements the foundational UI for the Session Dashboard and updates the application's routing. The dashboard will integrate with the `useUserSessions` hook to display basic session information and provide navigation to create new sessions. It establishes the main entry point for users to manage their sessions.

### Project Structure Notes

-   **Files to modify:**
    *   `src/components/SessionDashboard.tsx` (CREATE)
    *   `src/App.tsx` (MODIFY)
-   **Expected test locations:** `src/components/__tests__/SessionDashboard.test.tsx`, `src/App.test.tsx` (tests for these components will be created in a later story)
-   **Estimated effort:** 3 story points
-   **Prerequisites:** Story 1.1 (Session data model update), Story 1.2 (`useUserSessions` hook implementation).

### Key Code References

*   `src/App.tsx` (application routing)
*   `src/components/SessionCreate.tsx` (component to be reused for creation)
*   `src/hooks/useUserSessions.ts` (data fetching hook)

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
1. Created SessionDashboard.tsx component
2. Integrated useUserSessions hook for data fetching
3. Implemented loading state UI (centered with "Loading sessions...")
4. Implemented error state UI (with retry button)
5. Implemented empty state UI (no sessions found with CTA)
6. Implemented session list UI with clickable cards
7. Added HOST badge for sessions where user is host
8. Displayed session name, date, total players, total expenses
9. Added Create New Session button (top and in empty state)
10. Updated App.tsx routing: / → SessionDashboard, /create-session → SessionCreate

### Completion Notes

Story 1.3 complete. SessionDashboard component created as the new application home page. Integrated with useUserSessions hook to display all user sessions. Implemented loading, error, and empty states. Session cards show name, date, player count, and total expenses. HOST badge identifies sessions user created. Create New Session button navigates to /create-session. Routing updated in App.tsx.

### Files Modified

*   `src/components/SessionDashboard.tsx` - Created dashboard component
*   `src/App.tsx` - Updated routing configuration

### Test Results

TypeScript build: ✓ Passed
Production build: ✓ Passed (no type errors)

---

## Review Notes

<!-- Will be populated during code review -->
