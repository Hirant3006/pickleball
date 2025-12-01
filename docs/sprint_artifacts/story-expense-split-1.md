# Story 1.1: Session Creation & Player Management

**Status:** Draft

---

## User Story

As a Pickleball player,
I want to create a session and invite friends via shareable link,
So that everyone can join and track expenses together in real-time.

---

## Acceptance Criteria

**AC #1:** User can click "New Session" and a session is created with unique ID in Firebase
**Given** I am on the home page
**When** I click "New Session" button
**Then** A new session is created in Firebase with a unique ID and I am redirected to the session view

**AC #2:** Session generates shareable link (e.g., `/join/:sessionId`)
**Given** A session has been created
**When** The session view loads
**Then** A shareable link is displayed with format `/join/{sessionId}` or `/#/join/{sessionId}`

**AC #3:** Link can be copied to clipboard with single click
**Given** The session view displays a shareable link
**When** I click the "Copy Link" button
**Then** The link is copied to my clipboard and I see a confirmation message

**AC #4:** Other users can open link, enter their name, and join session
**Given** Another user opens the shareable link
**When** They enter their name and click "Join"
**Then** They are added to the session's player list in Firebase and redirected to session view

**AC #5:** All players see the player list update in real-time across devices
**Given** Multiple users are viewing the same session on different devices
**When** A new player joins the session
**Then** All devices show the updated player list within 500ms

**AC #6:** Session persists in Firebase and survives page refreshes
**Given** I am viewing an active session
**When** I refresh the page
**Then** The session data loads from Firebase and displays correctly

---

## Implementation Details

### Tasks / Subtasks

- [ ] Set up Firebase Realtime Database configuration and initialization (AC: #1, #4, #5, #6)
  - [ ] Create `src/lib/firebase.ts` with Firebase config from `.env`
  - [ ] Initialize Firebase app and Realtime Database reference
  - [ ] Test Firebase connection (write/read test data)

- [ ] Define TypeScript types for core data models (AC: #1, #4)
  - [ ] Create `src/lib/types.ts` with Session, Player, SessionId interfaces
  - [ ] Export types for use across components

- [ ] Build session creation flow (AC: #1, #2)
  - [ ] Create `src/components/SessionCreate.tsx` component
  - [ ] Implement "New Session" button with Firebase write
  - [ ] Generate unique session ID (Firebase push ID)
  - [ ] Create session object: `{ createdAt, players: {}, expenses: {}, archived: false }`
  - [ ] Redirect to `/session/:sessionId` after creation

- [ ] Implement shareable link display and copy functionality (AC: #2, #3)
  - [ ] Display full URL with session ID in session view
  - [ ] Add "Copy Link" button using `navigator.clipboard.writeText()`
  - [ ] Show confirmation toast/message on successful copy

- [ ] Build player join flow (AC: #4)
  - [ ] Create `src/components/SessionJoin.tsx` component
  - [ ] Add route `/join/:sessionId` in `App.tsx`
  - [ ] Create name input form with validation (non-empty, max 50 chars)
  - [ ] Generate player ID (Firebase push ID)
  - [ ] Write player to Firebase: `sessions/{sessionId}/players/{playerId}`
  - [ ] Redirect to session view after join

- [ ] Implement real-time player list component (AC: #5, #6)
  - [ ] Create `src/components/PlayerList.tsx` component
  - [ ] Create `src/hooks/useSession.ts` custom hook
  - [ ] Use Firebase `.on('value')` listener for session data
  - [ ] Display all players from session.players object
  - [ ] Clean up Firebase listener on component unmount

- [ ] Set up React Router for navigation (AC: #1, #4)
  - [ ] Install `react-router-dom`
  - [ ] Configure hash-based router in `App.tsx`
  - [ ] Add routes: `/` (home), `/session/:sessionId`, `/join/:sessionId`
  - [ ] Implement navigation between routes

- [ ] Initialize project scaffold with Vite + React + TypeScript (AC: all)
  - [ ] Run `npm create vite@latest pickle -- --template react-ts`
  - [ ] Install dependencies: `react-router-dom`, `firebase`
  - [ ] Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`
  - [ ] Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
  - [ ] Create `.env.example` and `.env` with Firebase config placeholders

- [ ] Test multi-device real-time sync (AC: #5)
  - [ ] Open session on two browser windows/devices
  - [ ] Join as different players
  - [ ] Verify player list updates in real-time (<500ms)

### Technical Summary

**Approach:**
- Use Firebase Realtime Database as single source of truth (replaces Redux/Context)
- Custom React hooks (`useSession`) subscribe to Firebase listeners for automatic UI updates
- Hash-based routing (`HashRouter`) for simple static deployment
- Session ID generation using Firebase's `push()` method (guaranteed unique)
- Player data stored as nested object under `sessions/{sessionId}/players`

**Key Technical Decisions:**
- **Firebase structure:** Sessions at root level, players nested within each session
- **Routing:** Hash-based (`/#/session/abc123`) for deployment without server rewrites
- **State management:** Firebase listeners + React hooks (no separate state library)
- **Real-time sync:** Firebase `.on('value')` for automatic updates

**Files/Modules Involved:**
- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/types.ts` - TypeScript interfaces
- `src/hooks/useSession.ts` - Session data hook
- `src/components/SessionCreate.tsx` - Create session UI
- `src/components/SessionJoin.tsx` - Join session UI
- `src/components/PlayerList.tsx` - Display players
- `src/App.tsx` - Routing setup

### Project Structure Notes

- **Files to modify:**
  - `src/App.tsx` (routing)
  - `src/main.tsx` (React entry point)
  - `src/index.css` (Tailwind imports)
  - `package.json` (dependencies)
  - `tailwind.config.js` (Swiss minimalist theme)
  - `.env` (Firebase config)

- **Files to create:**
  - `src/lib/firebase.ts`
  - `src/lib/types.ts`
  - `src/hooks/useSession.ts`
  - `src/components/SessionCreate.tsx`
  - `src/components/SessionJoin.tsx`
  - `src/components/PlayerList.tsx`

- **Expected test locations:**
  - `src/lib/__tests__/firebase.test.ts` (connection test)
  - `src/components/SessionCreate.test.tsx`
  - `src/components/SessionJoin.test.tsx`
  - `src/components/PlayerList.test.tsx`

- **Estimated effort:** 2 story points

- **Prerequisites:**
  - Firebase project created and Realtime Database enabled
  - Firebase config values added to `.env`
  - Node.js 20.x installed

### Key Code References

**New Project - No Existing Code**

**Patterns to Establish:**
- Functional React components with TypeScript
- Props destructuring in parameters
- Custom hooks for Firebase data (`useSession`, `useExpenses`, etc.)
- Tailwind utility classes for styling (mobile-first)
- Firebase security rules (open read/write for MVP)

**Firebase Data Structure:**
```typescript
{
  sessions: {
    [sessionId]: {
      createdAt: number,  // Unix timestamp
      players: {
        [playerId]: {
          name: string,
          joinedAt: number
        }
      },
      expenses: {},  // Added in Story 1.2
      settlements: {},  // Added in Story 1.3
      archived: boolean,
      archivedAt: number | null
    }
  }
}
```

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Project stack: React 18.x, Vite 5.x, Firebase 10.x, Tailwind 3.x
- Complete Firebase data model and security rules
- Swiss minimalist design guidelines
- Development setup instructions
- Complete implementation guidance

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
