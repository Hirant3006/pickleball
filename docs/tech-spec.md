# pickle - Technical Specification

**Author:** BMad
**Date:** Monday, December 1, 2025
**Project Level:** quick-flow
**Change Type:** Feature Enhancement
**Development Context:** brownfield

---

## Context

### Available Documents

*   None. No product brief, research, or other planning documents were found.

### Project Stack

*   **Framework:** React `^18.2.0` with Vite `^5.0.0`
*   **Backend/DB:** Firebase `^10.7.0`
*   **Language:** TypeScript `^5.3.0`
*   **Styling:** Tailwind CSS `^3.4.0`

### Existing Codebase Structure

*   A standard React architecture using `components`, `hooks`, and `lib` directories.
*   Conventional naming: `PascalCase` for components, `useCamelCase` for hooks.
*   No existing test files or testing framework was detected.

---

## The Change

### Problem Statement

1.  **Poor Session Identification:** Users, often part of multiple pickleball groups, cannot distinguish between their various expense-splitting sessions, leading to confusion and potential mis-entry of data.
2.  **Lack of a "Home Base":** The application lacks a central navigation hub. After creating or viewing a session, users are left at a dead end with no clear path to view their other sessions or return to a main screen, making the app feel confusing and disjointed.

### Proposed Solution

To resolve these core usability issues, we will implement a two-part enhancement:

1.  **Session Naming & Dating:** The session creation process will be updated to allow the host to assign a descriptive, free-form name and a specific date to each session. This will provide essential context for users.
2.  **Session Dashboard:** The application's entry point (`/`) will be redesigned into a "Session Dashboard." This dashboard will serve as the user's home base, displaying a comprehensive list of all sessions they are a member of. Each session in the list will be clearly presented with its name, date, total players, and total expenses. A clear visual distinction will be made between sessions the user hosts versus those they've just joined.

### Scope

**In Scope:**

*   Modifying the `SessionCreate` component to include input fields for a session name (free-form text) and a session date (defaults to today).
*   Updating the Firebase session data structure to include `name` and `date` fields.
*   Creating a new `SessionDashboard` component that will become the application's main route (`/`).
*   Implementing logic to fetch all sessions associated with the current user from Firebase.
*   Displaying the list of sessions on the dashboard, with each item showing: Session Name, Date, Total Players, and Total Expenses.
*   Adding a visual indicator to distinguish "Hosted" sessions from "Player" sessions.
*   Placing a "Create New Session" button on the dashboard that navigates to the session creation flow.

**Out of Scope:**

*   Real-time updates on the dashboard (e.g., total expenses updating live). The dashboard will load its data once when the component mounts.
*   Editing a session's name or date after it has been created.
*   Sorting, filtering, or searching the session list on the dashboard.
*   Archiving or deleting sessions directly from the dashboard.
*   Any form of push notifications.

---

## Implementation Details

### Source Tree Changes

*   `src/lib/types.ts` - **MODIFY** - Update the `Session` type to include `name` (string), `date` (string), and `hostId` (string).
*   `src/components/SessionCreate.tsx` - **MODIFY** - Add a simple form with `name` and `date` inputs. The `handleCreateSession` function will be updated to include this new data, along with the creator's `uid` as `hostId`.
*   `src/components/SessionDashboard.tsx` - **CREATE** - A new component to serve as the main homepage. It will fetch and display a list of the user's sessions.
*   `src/hooks/useUserSessions.ts` - **CREATE** - A new hook responsible for fetching all sessions associated with the current user.
*   `src/App.tsx` - **MODIFY** - Change the root route (`/`) to render `SessionDashboard.tsx`. The `SessionCreate` component will likely be routed to a new path like `/create-session`.

### Technical Approach

*   **Session Creation:**
    *   In `SessionCreate.tsx`, `useState` will manage the new `sessionName` and `sessionDate` form inputs. The date input will default to the current date.
    *   On creation, the current user's ID will be captured and stored in the new `hostId` field of the session object in Firebase.
*   **Session Dashboard:**
    *   The `SessionDashboard.tsx` component will be the new application entry point.
    *   It will use the `useUserSessions.ts` hook to retrieve session data.
*   **Data Fetching (`useUserSessions.ts`):**
    *   The hook will get the current authenticated user's ID.
    *   It will query the `/sessions` path in Firebase. The initial approach will be to fetch all sessions and filter on the client-side where the `players` object contains the user's ID.
    *   *Note: This client-side filter is not scalable. A future iteration should consider a more efficient data structure, such as a `userSessions/<userId>/<sessionId>` index, for direct lookups.*
    *   The hook will return the list of sessions, and for each session, it will calculate `totalPlayers` (from `Object.keys(session.players).length`) and `totalExpenses` (by summing the `amount` of all entries in `session.expenses`).
*   **UI Display:**
    *   The dashboard will map over the session list, rendering each session's details.
    *   A visual indicator (e.g., a "Host" badge) will be shown if the session's `hostId` matches the current user's ID.

### Existing Patterns to Follow

*   **Component Structure:** Continue to use functional components with hooks (`useState`, `useEffect`).
*   **State Management:** All new state will be managed locally within components or encapsulated in custom hooks, consistent with the existing approach.
*   **Firebase Logic:** All direct interaction with Firebase will be abstracted into the new `useUserSessions.ts` hook, mirroring the pattern seen in `useExpenses.ts` and `useDebts.ts`.
*   **Styling:** All new UI elements will be styled using the existing Tailwind CSS utility classes.

### Integration Points

*   **Firebase Realtime Database:** This is the primary integration point. The session object schema will be modified to include `name`, `date`, and `hostId`. The dashboard will query the `/sessions` path.
*   **React Router:** The routing in `App.tsx` will be updated. The `/` route will point to `SessionDashboard.tsx`, and a new route will be established for the creation flow.
*   **Firebase Authentication:** The new hook and creation logic will need access to the current user's `uid` from the authentication state to identify the host and fetch the correct sessions.

---

## Development Context

### Relevant Existing Code

*   `src/components/SessionCreate.tsx`: The current session creation logic will be modified to include the new fields.
*   `src/lib/firebase.ts`: The initialized Firebase instance will be imported and used for all database interactions.
*   `src/lib/types.ts`: The `Session` type definition will be modified.
*   `src/hooks/useExpenses.ts` and `src/hooks/useDebts.ts` will serve as architectural references for the new `useUserSessions.ts` hook.

### Dependencies

**Framework/Libraries:**

*   `react`: `^18.2.0`
*   `react-router-dom`: `^6.20.0`
*   `firebase`: `^10.7.0`
*   `vite`: `^5.0.0`
*   `tailwindcss`: `^3.4.0`

**Internal Modules:**

*   `@/lib/firebase`: For accessing the configured Firebase database instance.
*   `@/lib/types`: For using the `Session` and other type definitions.
*   `@/hooks/useUserSessions`: The new hook to be created for fetching session data.

### Configuration Changes

*   No changes to `vite.config.ts`, `tailwind.config.js`, or other project configuration files are anticipated.

### Existing Conventions (Brownfield)

*   **Code Style:** TypeScript with JSX (`.tsx`) for components.
*   **Architecture:** Standard React functional components and custom hooks.
*   **File Naming:** `PascalCase` for components, `camelCase` for utilities and hooks.
*   **Styling:** Utility-first CSS using Tailwind CSS.

### Test Framework & Standards

*   No existing test framework was detected.
*   **Action:** We will introduce `Vitest` for unit and integration testing, as it integrates seamlessly with the existing Vite build tool. `@testing-library/react` will be used for component testing.
*   **Standard:** Tests will be created in files named `*.test.tsx` or `*.test.ts` within the same directory as the file being tested.

---

## Implementation Stack

*   **Runtime:** Node.js (via Vite)
*   **Framework:** React `^18.2.0`
*   **Language:** TypeScript `^5.3.0`
*   **Build Tool:** Vite `^5.0.0`
*   **Styling:** Tailwind CSS `^3.4.0`
*   **Database:** Firebase Realtime Database `^10.7.0`
*   **Testing:** Vitest + React Testing Library (to be added).

---

## Technical Details

*   **Data Flow (Dashboard):** The `SessionDashboard` component will invoke the `useUserSessions` hook. This hook will fetch data from the `/sessions` path in Firebase, perform necessary client-side filtering to identify the user's sessions, calculate derived values (total expenses, player count), and return the processed data along with a loading state. The component will then render the UI based on this state.
*   **Authentication:** All Firebase interactions will be authenticated via the initialized Firebase app instance, which manages the user session. The current user's UID must be retrieved from the Firebase auth state to correctly associate them with sessions.
*   **Error Handling:** The `useUserSessions` hook must include robust `try/catch` blocks for the Firebase query and return an error state to the UI, allowing the dashboard to display a user-friendly error message if the data fetch fails.

---

## Development Setup

1.  Clone the repository.
2.  Run `npm install` to install all dependencies from `package.json`.
3.  Create a `.env` file from `.env.example` and populate it with valid Firebase project configuration keys.
4.  Run `npm run dev` to start the local development server.

---

## Implementation Guide

### Setup Steps

1.  Create a new feature branch from `main` (e.g., `feature/session-dashboard`).
2.  Install testing libraries: `npm install vitest @testing-library/react --save-dev`.
3.  Configure `vitest` in the `vite.config.ts` file to set up the test environment.
4.  Verify the local development environment is running correctly via `npm run dev`.

### Implementation Steps

1.  **Data Model:** Modify the `Session` type in `src/lib/types.ts` to include `name: string`, `date: string`, and `hostId: string`.
2.  **Session Creation:**
    *   Update `src/components/SessionCreate.tsx` with form inputs for `name` and `date`.
    *   Modify the submission handler to include the `name`, `date`, and the current user's `uid` as `hostId` in the object sent to Firebase.
3.  **Data Fetching Hook:**
    *   Create the new hook at `src/hooks/useUserSessions.ts`.
    *   Implement the logic to fetch all sessions, filter them on the client-side for the current user, and calculate derived data (total expenses, player count).
    *   Handle loading and error states.
4.  **Dashboard UI:**
    *   Create the `src/components/SessionDashboard.tsx` component.
    *   Use the `useUserSessions` hook to get the session data and status.
    *   Render the list of sessions, displaying the required information and a "Host" badge where applicable.
    *   Add a "Create New Session" button that navigates to the creation page.
5.  **Routing:**
    *   Modify `src/App.tsx` to make `/` the route for `SessionDashboard.tsx`.
    *   Move the `SessionCreate` component to a new route, such as `/create-session`.
6.  **Testing:**
    *   Write unit tests for `useUserSessions.ts`, mocking Firebase to verify data transformation and calculation logic.
    *   Write component tests for `SessionDashboard.tsx` and `SessionCreate.tsx` to assert correct rendering and user interaction.

### Testing Strategy

*   **Unit Tests (`Vitest`):** Core business logic, especially within the `useUserSessions.ts` hook (e.g., expense calculation, player counting), will be unit-tested. All external dependencies like Firebase will be mocked.
*   **Component Tests (`Vitest` + `@testing-library/react`):** React components (`SessionDashboard`, `SessionCreate`) will be tested to verify correct rendering based on props and state, as well as user interactions (e.g., button clicks, form input).
*   **Manual Testing:** A full end-to-end manual test is required to verify the flow: creating a named session, returning to the dashboard, and seeing the new session correctly displayed.

### Acceptance Criteria

1.  **GIVEN** a user is creating a session, **WHEN** they provide a name and date and click "Create", **THEN** a new session with that name, date, and the user's ID as `hostId` is persisted to Firebase.
2.  **GIVEN** a user navigates to the application root (`/`), **THEN** they must see a dashboard listing all sessions they are a member of.
3.  **GIVEN** a session card is displayed on the dashboard, **THEN** it must clearly show the session name, date, total number of players, and the sum of all expenses.
4.  **GIVEN** a user is the host of a session displayed on the dashboard, **THEN** that session card must have a distinct visual indicator (e.g., a "Host" badge).
5.  **GIVEN** a user is on the dashboard, **WHEN** they click the "Create New Session" button, **THEN** they are navigated to the session creation page.

---

## Developer Resources

### File Paths Reference

*   `src/lib/types.ts`
*   `src/components/SessionCreate.tsx`
*   `src/components/SessionDashboard.tsx`
*   `src/hooks/useUserSessions.ts`
*   `src/App.tsx`
*   `vite.config.ts`

### Key Code Locations

*   `SessionCreate.handleCreateSession`: Logic for creating the session in Firebase.
*   `useUserSessions`: The new hook containing the primary data fetching logic.
*   `App.tsx`: The main application router setup.

### Testing Locations

*   Tests will be co-located with the files they are testing (e.g., `useUserSessions.test.ts` will be in `src/hooks/`).

### Documentation to Update

*   The project `README.md` should be updated to describe the new dashboard-centric user flow.

---

## UX/UI Considerations

*   **Dashboard Loading State:** The dashboard must display a clear loading indicator (e.g., a spinner or skeleton screen) while the initial session data is being fetched.
*   **Dashboard Empty State:** If a user is not part of any sessions, the dashboard must display a user-friendly message and a prominent call-to-action to create their first session.
*   **Dashboard Error State:** In case of a data fetching error, a non-technical error message must be shown to the user, with an option to retry.
*   **Form Validation:** The session name input in `SessionCreate.tsx` should have basic client-side validation to prevent empty names.

---

## Testing Approach

*   **Test Runner:** `Vitest`.
*   **Component Testing:** `@testing-library/react`.
*   **Strategy:** A combination of unit tests for hooks and business logic, and component tests for UI rendering and interaction, to ensure correctness and prevent regressions. All new logic must be covered by tests.

---

## Deployment Strategy

### Deployment Steps

1.  All code is merged into the `main` branch after a successful code review.
2.  The CI/CD pipeline (e.g., Vercel, Netlify, GitHub Actions) will automatically trigger.
3.  The pipeline runs `npm install`, `npm run lint`, all tests, and `npm run build`.
4.  On success, the build artifact is deployed to the production environment.

### Rollback Plan

*   In case of a critical production issue, the deployment service's (e.g., Vercel) instant rollback feature will be used to revert to the previously deployed commit.

### Monitoring

*   Post-deployment, monitor the production application for any new console errors or user-reported issues related to the new functionality.
*   Check the Firebase console for any unexpected database usage or errors.
