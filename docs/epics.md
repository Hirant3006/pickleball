# pickle - Epic Breakdown

**Date:** Monday, December 1, 2025
**Project Level:** quick-flow

---

## Epic 1: Session Management Enhancements

**Slug:** session-management

### Goal

To provide users with a centralized, intuitive way to manage and distinguish between multiple pickleball sessions, enhancing usability and reducing confusion.

### Scope

**In Scope:**
*   Allow session hosts to create new sessions with a free-form text name and a selectable date (defaulting to today).
*   Update Firebase session data structure to include the session name, date, and host ID.
*   Develop a new "Session Dashboard" component to replace the current home page (`/`).
*   Implement logic to fetch and display all sessions where the current user is either the host or a player.
*   For each session on the dashboard, display its name, date, total expenses, and total players.
*   Provide a clear visual distinction between sessions where the user is the host and sessions where they are a player.
*   Include a "Create New Session" button on the dashboard that navigates to the session creation form.

**Out of Scope:**
*   Real-time updates for session details (e.g., expenses, player count) on the dashboard.
*   Functionality to edit a session's name or date after creation.
*   Sorting, filtering, or searching capabilities for the session list on the dashboard.
*   Features for archiving or deleting sessions from the dashboard.
*   Any form of push notifications.

### Success Criteria

*   **AC1:** New sessions are created in Firebase with the host-provided name, date, and host ID.
*   **AC2:** The application's root route (`/`) displays the new "Session Dashboard" component.
*   **AC3:** The Session Dashboard lists all sessions relevant to the current user (as host or player).
*   **AC4:** Each session displayed on the dashboard clearly shows its name, date, total players, and total expenses.
*   **AC5:** Sessions where the user is the host are visually differentiated from sessions where the user is a player.
*   **AC6:** A "Create New Session" button is present on the dashboard and successfully navigates to the session creation page.

### Dependencies

*   Firebase Authentication (for current user ID).
*   Firebase Realtime Database (for session data storage and retrieval).

---

## Story Map - Epic 1

```
Epic: Session Management Enhancements (15 points)
├── Story 1.1: Update Session Data Model and Creation Form (2 points)
│
├── Story 1.2: Implement `useUserSessions` Hook for Data Fetching (3 points)
│   Dependencies: Story 1.1
│
├── Story 1.3: Implement Basic Session Dashboard UI and Routing (3 points)
│   Dependencies: Stories 1.1, 1.2
│
├── Story 1.4: Enhance Session Dashboard with Details and Host Distinction (2 points)
│   Dependencies: Stories 1.1, 1.2, 1.3
│
└── Story 1.5: Implement Testing for Session Management Features (5 points)
    Dependencies: Stories 1.1, 1.2, 1.3, 1.4
```

---

## Stories - Epic 1

### Story 1.1: Update Session Data Model and Creation Form

As a session host, I want to provide a name and date when creating a new session, so that my players and I can easily distinguish between different sessions.

**Estimated Effort:** 2 story points

### Story 1.2: Implement `useUserSessions` Hook for Data Fetching

As a system, I want to efficiently fetch all sessions relevant to the current user, so that the Session Dashboard can display personalized session data.

**Estimated Effort:** 3 story points

### Story 1.3: Implement Basic Session Dashboard UI and Routing

As an application user, I want to see a list of my sessions on the home page and create new ones, so that I can easily access my ongoing sessions and initiate new ones from a central location.

**Estimated Effort:** 3 story points

### Story 1.4: Enhance Session Dashboard with Details and Host Distinction

As an application user, I want to see comprehensive details for each session and easily identify sessions I host, so that I have a complete overview of my sessions and can quickly navigate to the ones I manage.

**Estimated Effort:** 2 story points

### Story 1.5: Implement Testing for Session Management Features

As a developer, I want to ensure the new session management features are robust and error-free, so that I can have confidence in the application's stability and maintainability.

**Estimated Effort:** 5 story points

---

## Implementation Timeline - Epic 1

**Total Story Points:** 15

**Estimated Timeline:** 10 days

---