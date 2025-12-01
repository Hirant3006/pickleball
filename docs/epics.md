# pickle - Epic Breakdown

**Date:** 2025-12-01
**Project Level:** Quick Flow

---

## Epic 1: Pickleball Expense Split

**Slug:** expense-split

### Goal

Enable Pickleball players to effortlessly track shared expenses, calculate fair splits across varying group sizes, settle debts, and maintain session history—eliminating manual calculation errors and payment disputes.

### Scope

**In Scope:**
- Multi-device real-time session management via Firebase
- Player joining and expense logging (multiple itemized expenses per session)
- Automatic equal-split debt calculation ("who owes whom")
- Mark-as-paid settlement tracking (honor system)
- Session archiving and history viewing
- Swiss minimalist mobile-first UI

**Out of Scope:**
- Real payment integration (Venmo/PayPal APIs)
- User authentication/login system
- Session editing (delete/modify expenses after creation)
- Advanced analytics or spending trends
- Push notifications for unpaid debts

### Success Criteria

1. ✅ Any player can create a session and generate a shareable link
2. ✅ Multiple players can join via link and see real-time updates
3. ✅ Expenses can be logged with itemized descriptions (court, balls, water)
4. ✅ Debt calculations are accurate to 2 decimal places and update instantly
5. ✅ Players can mark debts as paid, syncing across all devices
6. ✅ Completed sessions can be archived and viewed in history
7. ✅ App loads in <2s on 3G, real-time updates occur in <500ms
8. ✅ Mobile-first responsive design works courtside (44px+ touch targets)

### Dependencies

**External:**
- Firebase Realtime Database (free tier)
- Vercel or Firebase Hosting for deployment

**Technical:**
- Node.js 20.x
- React 18.x
- Vite 5.x build tooling
- Tailwind CSS 3.x

---

## Story Map - Epic 1

```
Epic 1: Pickleball Expense Split (10 points)
├── Story 1.1: Session Creation & Player Management (2 points)
│   Dependencies: None
│   Deliverable: Create/join sessions, real-time player list
│
├── Story 1.2: Expense Logging & Debt Calculation (3 points)
│   Dependencies: Story 1.1
│   Deliverable: Add expenses, view calculated debts
│
├── Story 1.3: Settlement & Session Archive (3 points)
│   Dependencies: Stories 1.1, 1.2
│   Deliverable: Mark debts paid, archive completed sessions
│
└── Story 1.4: Archive History Viewing (2 points)
    Dependencies: Story 1.3
    Deliverable: Browse and view past sessions
```

---

## Stories - Epic 1

### Story 1.1: Session Creation & Player Management

As a Pickleball player,
I want to create a session and invite friends via shareable link,
So that everyone can join and track expenses together in real-time.

**Acceptance Criteria:**

**AC #1:** User can click "New Session" and a session is created with unique ID
**AC #2:** Session generates shareable link (e.g., `/join/:sessionId`)
**AC #3:** Link can be copied to clipboard with single click
**AC #4:** Other users can open link, enter their name, and join session
**AC #5:** All players see the player list update in real-time across devices
**AC #6:** Session persists in Firebase and survives page refreshes

**Prerequisites:** None (foundation story)

**Technical Notes:** Firebase Realtime Database for state, React Router for link-based joining, hash-based routing for simple deployment

**Estimated Effort:** 2 points

---

### Story 1.2: Expense Logging & Debt Calculation

As a player in an active session,
I want to log expenses and see who owes whom automatically,
So that we can settle up fairly without manual calculation.

**Acceptance Criteria:**

**AC #1:** Any player can add an expense with amount, description, and who paid
**AC #2:** Multiple expenses can be added per session (e.g., court $40, balls $10)
**AC #3:** Running expense total displays and updates in real-time
**AC #4:** App calculates equal split: total ÷ player count
**AC #5:** "Who owes whom" view displays debts clearly (e.g., "Bob owes Alice $12.50")
**AC #6:** Debt calculations are accurate to 2 decimal places
**AC #7:** All players see expense and debt updates instantly (< 500ms latency)

**Prerequisites:** Story 1.1 (requires session and player data)

**Technical Notes:** Custom debt calculation algorithm (creditor/debtor matching), Firebase listeners for real-time sync, React hooks for state management

**Estimated Effort:** 3 points

---

### Story 1.3: Settlement & Session Archive

As a player settling up after a game,
I want to mark debts as paid and archive the completed session,
So that we have a clean slate for next week.

**Acceptance Criteria:**

**AC #1:** Each debt has a "Mark as Paid" button visible to all players
**AC #2:** Clicking "Mark as Paid" updates the debt status across all devices
**AC #3:** Paid debts show visual indicator (e.g., strikethrough, checkmark)
**AC #4:** "Archive Session" button appears when all debts are marked paid
**AC #5:** Archived sessions are removed from active session view
**AC #6:** Archived sessions cannot be edited (read-only)
**AC #7:** Archive timestamp is recorded in Firebase

**Prerequisites:** Stories 1.1, 1.2 (requires sessions, players, expenses, debts)

**Technical Notes:** Firebase settlement tracking, boolean `archived` flag, Firebase timestamp for archivedat

**Estimated Effort:** 3 points

---

### Story 1.4: Archive History Viewing

As a player reviewing past games,
I want to view archived sessions with full expense and settlement details,
So that I can verify past payments and track spending over time.

**Acceptance Criteria:**

**AC #1:** "View Archives" link accessible from home page
**AC #2:** Archives page lists all past sessions sorted by date (newest first)
**AC #3:** Each archived session displays: date, player names, total expenses
**AC #4:** Clicking a session shows full details: itemized expenses, settlements, who paid whom
**AC #5:** Archive view is read-only (no editing or deleting)
**AC #6:** Archives load within 2s on 3G connection

**Prerequisites:** Story 1.3 (requires archived sessions)

**Technical Notes:** Firebase query filtered by `archived === true`, ordered by `archivedAt` descending, lazy-loaded component (not on session page)

**Estimated Effort:** 2 points

---

## Implementation Sequence - Epic 1

**Recommended Order:**

1. **Story 1.1** - Foundation (session creation, player joining, Firebase setup)
2. **Story 1.2** - Core functionality (expense tracking, debt calculation)
3. **Story 1.3** - Settlement (mark paid, archiving)
4. **Story 1.4** - Enhancement (archive viewing)

**Rationale:**
- Each story delivers working functionality
- No forward dependencies (each builds on previous)
- System remains in working state after each story
- Final story (archives) is enhancement, could be deferred if needed

**Total Story Points:** 10 points

**Estimated Timeline:** Based on 3-hour vibe coding target, stories 1-3 are critical MVP (8 points), story 4 is bonus (2 points).

---
