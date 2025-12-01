# pickle - Technical Specification

**Author:** BMad
**Date:** 2025-12-01
**Project Level:** Quick Flow
**Change Type:** New Feature - Full Application
**Development Context:** Greenfield

---

## Context

### Available Documents

**Loaded Documents:**
- ✅ Workflow status file (bmm-workflow-status.yaml)
- ○ No product brief (discovery phase skipped)
- ○ No research documents (discovery phase skipped)

**Project Status:** Greenfield - New project starting from scratch

**Context Source:** Party mode collaborative discussion with full BMM agent team

### Project Stack

**Target Stack (To Be Established):**

This is a greenfield project. The following stack has been selected based on:
- 3-hour implementation timeline requirement
- Multi-device real-time sync requirement
- Swiss minimalist design aesthetic
- Medium technical skill level

**Recommended Stack:**
- **Frontend Framework:** React 18.x (latest stable)
- **Build Tool:** Vite 5.x (fast dev server, optimized builds)
- **Backend/Database:** Firebase (Realtime Database for live sync)
- **Styling:** Tailwind CSS 3.x (Swiss minimalist design patterns)
- **Deployment:** Vercel (zero-config React deployment)
- **Language:** TypeScript (type safety, better DX)

**Justification:**
- Firebase eliminates backend coding (30+ mins saved)
- Vite provides instant dev server startup
- Tailwind's utility-first approach aligns with Swiss minimalism
- Vercel deployment is single-command

### Existing Codebase Structure

**Status:** Greenfield project - no existing code

**Project will establish:**
- Component-based React architecture
- Firebase integration patterns
- Tailwind utility-first styling
- TypeScript type definitions

---

## The Change

### Problem Statement

**User Problem:**
A group of friends plays Pickleball weekly. Each session involves upfront costs (court rental, balls, water) paid by one player. The math for splitting costs becomes messy when:
- Different group sizes each week (4 players one week, 6 the next)
- Multiple expense types per session (court $40, balls $10, water $8)
- Manual calculation is error-prone and time-consuming
- Tracking who owes whom across multiple sessions is difficult

**Current State:**
Players likely use mental math, group chat messages, or spreadsheets - all manual, slow, and prone to disputes.

**Impact:**
- Time wasted calculating splits after games
- Potential disputes over amounts owed
- Forgotten debts over time
- No historical record of past sessions

### Proposed Solution

**Solution Overview:**

A multi-device web application that:
1. **Session Management:** One player creates a session, generates shareable link
2. **Player Join:** Others join via link, enter their name
3. **Expense Logging:** Any player can log expenses (itemized: court, balls, water)
4. **Auto-Calculate:** App automatically splits total costs equally across all players
5. **Debt Display:** Clear "who owes whom" view (e.g., "Alice owes John $12.50")
6. **Settlement:** Players mark debts as paid (honor system)
7. **Archive:** Completed sessions stored for historical reference

**Key Features:**
- Real-time sync across all devices (Firebase Realtime Database)
- Swiss minimalist UI (clean, spacious, high-contrast)
- Mobile-first responsive design (courtside usage)
- Session history for accountability

### Scope

**In Scope:**

✅ **Session Creation & Sharing:**
- Create new session
- Generate unique shareable link
- Session persists in Firebase

✅ **Player Management:**
- Join session via link
- Enter name (free text, no registration)
- View all players in current session

✅ **Expense Tracking:**
- Add multiple itemized expenses per session
- Track: amount, description (e.g., "Court rental"), who paid
- Display running total

✅ **Debt Calculation:**
- Auto-calculate equal split across all players
- Compute "who owes whom" (optimize to minimize transactions)
- Real-time updates as expenses added

✅ **Settlement:**
- Mark individual debts as "paid"
- Visual indicator for paid vs unpaid debts
- Syncs across all devices

✅ **Session Archive:**
- Archive completed sessions (all debts paid)
- View past session history
- Display: date, players, expenses, final balances

✅ **UI/UX:**
- Swiss minimalist design (Tailwind defaults)
- Mobile-first responsive
- High contrast black/white theme
- Sans-serif typography (system fonts)

**Out of Scope:**

❌ **Real Payment Integration:**
- No Venmo/PayPal API integration
- Mark-as-paid is honor system only
- Future enhancement

❌ **User Authentication:**
- No login/signup system
- Players identify by name only
- Anyone with link can access session

❌ **Complex Debt Optimization:**
- Simple "who paid minus who owes" calculation
- No graph-based debt minimization algorithms
- Future enhancement

❌ **Session Editing:**
- Cannot edit/delete expenses after creation
- Cannot remove players after joining
- MVP keeps it simple

❌ **Notifications:**
- No email/SMS reminders for unpaid debts
- No push notifications
- Future enhancement

❌ **Advanced Analytics:**
- No spending trends or player statistics
- Basic archive viewing only
- Future enhancement

---

## Implementation Details

### Source Tree Changes

**New Files to Create:**

```
pickle/
├── src/
│   ├── components/
│   │   ├── SessionCreate.tsx          - CREATE - Session creation form
│   │   ├── SessionJoin.tsx            - CREATE - Join session via link
│   │   ├── PlayerList.tsx             - CREATE - Display active players
│   │   ├── ExpenseForm.tsx            - CREATE - Add expense form
│   │   ├── ExpenseList.tsx            - CREATE - Display all expenses
│   │   ├── DebtCalculator.tsx         - CREATE - Show who owes whom
│   │   └── SessionArchive.tsx         - CREATE - View past sessions
│   ├── hooks/
│   │   ├── useSession.ts              - CREATE - Firebase session state hook
│   │   ├── useExpenses.ts             - CREATE - Firebase expenses hook
│   │   └── useDebts.ts                - CREATE - Debt calculation logic
│   ├── lib/
│   │   ├── firebase.ts                - CREATE - Firebase config/init
│   │   ├── debtCalculator.ts          - CREATE - Debt calculation algorithm
│   │   └── types.ts                   - CREATE - TypeScript type definitions
│   ├── App.tsx                        - CREATE - Main app component with routing
│   ├── main.tsx                       - CREATE - React entry point
│   └── index.css                      - CREATE - Tailwind imports + custom styles
├── public/
│   └── index.html                     - CREATE - HTML shell
├── package.json                       - CREATE - Dependencies
├── tsconfig.json                      - CREATE - TypeScript config
├── tailwind.config.js                 - CREATE - Tailwind config (Swiss theme)
├── vite.config.ts                     - CREATE - Vite configuration
├── .env.example                       - CREATE - Firebase config template
└── README.md                          - CREATE - Setup instructions
```

**Total Files:** ~20 files (component-heavy React app)

### Technical Approach

**Architecture Pattern:**
- **Component-based React** with functional components and hooks
- **Firebase Realtime Database** for state management (replaces Redux/Context)
- **Custom hooks** for Firebase data subscriptions
- **Client-side routing** using React Router (hash-based for simple deployment)

**Data Model (Firebase Realtime Database):**

```typescript
// Firebase structure
{
  sessions: {
    [sessionId]: {
      createdAt: timestamp,
      players: {
        [playerId]: {
          name: string,
          joinedAt: timestamp
        }
      },
      expenses: {
        [expenseId]: {
          amount: number,
          description: string,
          paidBy: playerId,
          createdAt: timestamp
        }
      },
      settlements: {
        [settlementId]: {
          from: playerId,
          to: playerId,
          amount: number,
          paid: boolean,
          paidAt: timestamp | null
        }
      },
      archived: boolean,
      archivedAt: timestamp | null
    }
  }
}
```

**Debt Calculation Algorithm:**
1. Calculate total expenses per session
2. Compute equal share: `totalExpenses / playerCount`
3. For each player, calculate: `amountPaid - equalShare`
4. Positive = owed money, Negative = owes money
5. Match debtors with creditors (simple pairing)
6. Store settlements in Firebase

**Real-time Sync:**
- Use Firebase `.on('value')` listeners for live updates
- All players see changes instantly
- No manual refresh needed

**Routing:**
- `/` - Home (create or view archives)
- `/session/:sessionId` - Active session view
- `/join/:sessionId` - Join session flow
- `/archives` - Past sessions list

### Existing Patterns to Follow

**Status:** Greenfield project - establishing new patterns

**Patterns to Establish:**

**Component Structure:**
- Functional components with TypeScript
- Props interface defined above component
- Export default at bottom

**State Management:**
- Firebase Realtime Database as source of truth
- Custom hooks for data fetching (`useSession`, `useExpenses`)
- Local state only for UI (form inputs, modals)

**Styling:**
- Tailwind utility classes (no custom CSS unless necessary)
- Mobile-first responsive (Tailwind breakpoints: `sm:`, `md:`, `lg:`)
- Swiss design principles: generous spacing (`p-8`, `space-y-4`), high contrast

**Error Handling:**
- Try/catch for Firebase operations
- User-friendly error messages (toasts or inline)
- Graceful degradation if Firebase unavailable

**File Naming:**
- PascalCase for components (`SessionCreate.tsx`)
- camelCase for utilities (`debtCalculator.ts`)
- kebab-case for config files (`tailwind.config.js`)

### Integration Points

**External Services:**
- **Firebase Realtime Database** - Primary data store and sync engine
- **Vercel** - Deployment platform (optional, could use Firebase Hosting)

**Internal Modules:**
- `firebase.ts` → All components (via hooks)
- `debtCalculator.ts` → `DebtCalculator.tsx`, `useDebts.ts`
- `types.ts` → All TypeScript files

**Browser APIs:**
- `navigator.clipboard` - Copy session link to clipboard
- `window.location` - URL-based session joining

**No External APIs:**
- No payment APIs (out of scope)
- No authentication APIs (no login)

---

## Development Context

### Relevant Existing Code

**Status:** Greenfield - no existing code to reference

**New developers should:**
1. Review this tech-spec completely
2. Familiarize with React hooks patterns
3. Read Firebase Realtime Database docs (web SDK)
4. Understand Tailwind utility-first CSS

### Dependencies

**Framework/Libraries:**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "firebase": "^10.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Key Libraries Explained:**
- **react/react-dom:** Core UI framework
- **react-router-dom:** Client-side routing
- **firebase:** Backend and realtime sync
- **tailwindcss:** Utility-first CSS framework
- **vite:** Fast build tool and dev server
- **typescript:** Type safety

### Internal Modules

**Core Utilities:**

- **`lib/firebase.ts`** - Firebase initialization and config
- **`lib/debtCalculator.ts`** - Debt calculation business logic
- **`lib/types.ts`** - Shared TypeScript interfaces

**Custom Hooks:**

- **`hooks/useSession.ts`** - Subscribe to session data
- **`hooks/useExpenses.ts`** - Subscribe to expenses
- **`hooks/useDebts.ts`** - Calculated debts (derived from expenses)

**Component Hierarchy:**

```
App
├── Home (SessionCreate + link to Archives)
├── SessionView
│   ├── PlayerList
│   ├── ExpenseForm
│   ├── ExpenseList
│   └── DebtCalculator
├── SessionJoin
└── SessionArchive
```

### Configuration Changes

**New Configuration Files:**

**`.env` (local development):**
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-app.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**`tailwind.config.js` (Swiss minimalism):**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'], // Clean system fonts
      },
      colors: {
        // Monochromatic + accent (Swiss style)
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ff0000', // Red accent for actions
      },
    },
  },
  plugins: [],
}
```

**`firebase.json` (if using Firebase Hosting):**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

### Existing Conventions (Brownfield)

**Status:** Greenfield - establishing new conventions

**Code Style Conventions:**
- **Indentation:** 2 spaces
- **Quotes:** Single quotes for JS/TS, double for JSX attributes
- **Semicolons:** Yes (TypeScript default)
- **Line length:** 100 characters max
- **Imports:** Group by external → internal → types

**React Conventions:**
- Functional components only (no class components)
- Props destructuring in parameters
- Named exports for utilities, default for components

**TypeScript Conventions:**
- Explicit return types for functions
- Interface over type for objects
- Strict mode enabled

### Test Framework & Standards

**Testing Stack:**
- **Vitest** (Vite-native test runner, Jest-compatible API)
- **@testing-library/react** (component testing)
- **@testing-library/user-event** (user interaction simulation)

**Test Organization:**
- Co-located tests: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Utilities tested separately in `lib/__tests__/`

**Coverage Goals:**
- **Critical logic:** 100% (debtCalculator, hooks)
- **Components:** 80%+ (happy paths + error states)
- **Overall:** 70%+ (MVP target)

---

## Implementation Stack

**Complete Stack with Versions:**

**Runtime & Language:**
- Node.js 20.x (LTS)
- TypeScript 5.3.x

**Frontend Framework:**
- React 18.2.x
- React Router 6.20.x

**Build Tools:**
- Vite 5.x (dev server + bundler)
- TypeScript compiler (via Vite)

**Styling:**
- Tailwind CSS 3.4.x
- PostCSS 8.4.x (Tailwind dependency)
- Autoprefixer 10.x

**Backend/Database:**
- Firebase Realtime Database 10.7.x (web SDK)

**Testing:**
- Vitest 1.x
- @testing-library/react 14.x
- @testing-library/user-event 14.x

**Deployment:**
- Vercel (or Firebase Hosting as alternative)

---

## Technical Details

### Debt Calculation Algorithm

**Goal:** Given multiple expenses and players, determine who owes whom

**Algorithm:**

```typescript
function calculateDebts(expenses: Expense[], players: Player[]): Settlement[] {
  // Step 1: Calculate total expenses
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 2: Calculate equal share per player
  const equalShare = total / players.length;

  // Step 3: Calculate net balance for each player
  const balances = players.map(player => {
    const paid = expenses
      .filter(exp => exp.paidBy === player.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      playerId: player.id,
      balance: paid - equalShare, // Positive = owed, Negative = owes
    };
  });

  // Step 4: Match creditors (positive) with debtors (negative)
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

  const settlements: Settlement[] = [];

  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    settlements.push({
      from: debtor.playerId,
      to: creditor.playerId,
      amount: parseFloat(amount.toFixed(2)), // Round to 2 decimals
      paid: false,
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) i++;
    if (debtor.balance === 0) j++;
  }

  return settlements;
}
```

**Edge Cases:**
- **Single player:** No debts (equalShare = total)
- **No expenses:** No debts
- **Rounding errors:** Round to 2 decimals, accept minor discrepancies (<$0.01)

### Security Considerations

**Firebase Security Rules:**

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

**Note:** Open read/write for MVP (anyone with link can access). Production would add:
- Write validation (player must be in session)
- Timestamp validation (prevent backdating)
- Archive lock (prevent edits to archived sessions)

**Data Sanitization:**
- Validate expense amounts (positive numbers only)
- Limit player name length (max 50 chars)
- Prevent XSS (React escapes by default)

### Performance Considerations

**Target Metrics:**
- Initial load: <2s on 3G
- Realtime update latency: <500ms
- Session creation: <1s

**Optimizations:**
- Lazy load archive view (not needed on session page)
- Index Firebase queries (by `createdAt`, `archived`)
- Debounce expensive calculations (debt recalc on every expense change)

**Firebase Limits:**
- Free tier: 100 simultaneous connections, 1GB storage, 10GB/month bandwidth
- Single session unlikely to exceed limits (< 100 concurrent users)

### Accessibility

**WCAG 2.1 AA Compliance:**
- High contrast black/white (meets 7:1 ratio)
- Keyboard navigation (tab order, focus states)
- Screen reader labels (ARIA attributes on forms)
- Semantic HTML (`<button>`, `<form>`, `<main>`)

**Mobile Accessibility:**
- Touch targets ≥44px (Tailwind `p-4` buttons)
- Readable font sizes (16px minimum)
- No horizontal scroll

---

## Development Setup

**Prerequisites:**
- Node.js 20.x or higher
- npm 10.x or higher
- Firebase account (free tier)

**Initial Setup:**

```bash
# 1. Create Vite + React + TypeScript project
npm create vite@latest pickle -- --template react-ts
cd pickle

# 2. Install dependencies
npm install react-router-dom firebase
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/user-event

# 3. Initialize Tailwind
npx tailwindcss init -p

# 4. Set up Firebase project
# - Go to https://console.firebase.google.com
# - Create new project "pickle"
# - Enable Realtime Database
# - Copy config to .env file

# 5. Copy .env.example to .env and fill in Firebase config
cp .env.example .env

# 6. Start dev server
npm run dev

# 7. Open http://localhost:5173
```

**Running Tests:**

```bash
npm run test          # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Building for Production:**

```bash
npm run build         # Creates dist/ folder
npm run preview       # Preview production build locally
```

---

## Implementation Guide

### Setup Steps

**Pre-Implementation Checklist:**

1. ✅ Complete Firebase project setup
   - Create project in Firebase Console
   - Enable Realtime Database
   - Set security rules to open (for MVP)
   - Copy config values

2. ✅ Initialize local project
   - Run Vite scaffolding
   - Install all dependencies
   - Configure Tailwind
   - Create `.env` with Firebase config

3. ✅ Set up development environment
   - Verify `npm run dev` starts server
   - Verify Firebase connection (test write/read)
   - Configure editor (TypeScript, ESLint, Prettier)

4. ✅ Create project structure
   - Create `src/components/`, `src/hooks/`, `src/lib/` folders
   - Set up `types.ts` with base interfaces
   - Initialize `firebase.ts` with config

### Implementation Steps

**Story-by-Story Implementation:**

**Story 1: Session Creation & Player Management**
1. Implement `lib/firebase.ts` - Initialize Firebase
2. Create `lib/types.ts` - Define Session, Player types
3. Build `SessionCreate.tsx` - Create session form
4. Build `SessionJoin.tsx` - Join via link flow
5. Build `PlayerList.tsx` - Display active players
6. Implement `hooks/useSession.ts` - Firebase session hook
7. Wire up routing in `App.tsx`
8. Test: Create session, share link, join from second device

**Story 2: Expense Logging & Split Calculation**
1. Add Expense type to `types.ts`
2. Build `ExpenseForm.tsx` - Add expense UI
3. Build `ExpenseList.tsx` - Display expenses
4. Implement `hooks/useExpenses.ts` - Firebase expenses hook
5. Implement `lib/debtCalculator.ts` - Debt calculation logic
6. Build `DebtCalculator.tsx` - Display who owes whom
7. Implement `hooks/useDebts.ts` - Use calculator with Firebase data
8. Test: Add expenses, verify calculations, check real-time sync

**Story 3: Settlement & Archive**
1. Add Settlement type to `types.ts`
2. Add "Mark as Paid" button to `DebtCalculator.tsx`
3. Implement settlement Firebase write
4. Add "Archive Session" button (when all debts paid)
5. Update session with `archived: true` flag
6. Test: Mark debts paid, archive session

**Story 4: View Archives**
1. Build `SessionArchive.tsx` - List archived sessions
2. Implement Firebase query for `archived === true`
3. Add route `/archives` in `App.tsx`
4. Display session details (date, players, expenses, balances)
5. Test: Archive session, view in archives, verify read-only

### Testing Strategy

**Unit Tests:**
- `debtCalculator.ts` - Test algorithm with various scenarios:
  - Equal expenses (everyone pays same)
  - Single payer (one person pays all)
  - Multiple payers (complex balancing)
  - Edge cases (zero expenses, single player)

**Component Tests:**
- `ExpenseForm.tsx` - Form validation, submit handling
- `DebtCalculator.tsx` - Debt display, mark-as-paid interaction
- `SessionCreate.tsx` - Session creation flow

**Integration Tests:**
- End-to-end flow: Create → Join → Add expense → Settle → Archive
- Firebase mocking (use Firebase emulator for tests)

**Manual Testing Checklist:**
- ✅ Multi-device sync (open session on 2+ devices)
- ✅ Responsive design (test mobile, tablet, desktop)
- ✅ Link sharing (copy link, open in new browser)
- ✅ Archive viewing (verify past sessions load)

### Acceptance Criteria

**Story 1: Session Creation & Player Management**
1. ✅ User can create new session with one click
2. ✅ Session generates unique shareable link
3. ✅ Link can be copied to clipboard
4. ✅ Other users can join via link
5. ✅ Joining users enter name (free text)
6. ✅ All players see player list update in real-time

**Story 2: Expense Logging & Split Calculation**
1. ✅ Any player can add expense (amount, description, who paid)
2. ✅ Multiple expenses can be added per session
3. ✅ Running total displays correctly
4. ✅ Equal split calculated automatically (total / playerCount)
5. ✅ "Who owes whom" displays correctly
6. ✅ Debts update in real-time as expenses added
7. ✅ Calculations accurate to 2 decimal places

**Story 3: Settlement & Archive**
1. ✅ Each debt has "Mark as Paid" button
2. ✅ Marking paid updates all devices instantly
3. ✅ Archive button enabled when all debts paid
4. ✅ Archived sessions removed from active view
5. ✅ Archived sessions cannot be edited

**Story 4: View Archives**
1. ✅ Archives page lists all past sessions
2. ✅ Sessions sorted by date (newest first)
3. ✅ Each session shows: date, players, total amount
4. ✅ Clicking session shows full details (expenses, settlements)
5. ✅ Archive view is read-only (no edits allowed)

---

## Developer Resources

### File Paths Reference

**All Implementation Files:**

```
src/
  components/
    SessionCreate.tsx
    SessionJoin.tsx
    PlayerList.tsx
    ExpenseForm.tsx
    ExpenseList.tsx
    DebtCalculator.tsx
    SessionArchive.tsx
  hooks/
    useSession.ts
    useExpenses.ts
    useDebts.ts
  lib/
    firebase.ts
    debtCalculator.ts
    types.ts
  App.tsx
  main.tsx
  index.css

Config Files:
  package.json
  tsconfig.json
  tailwind.config.js
  vite.config.ts
  .env
  .env.example
  firebase.json (optional)
```

### Key Code Locations

**Core Business Logic:**
- Debt calculation: `src/lib/debtCalculator.ts:calculateDebts()`
- Firebase initialization: `src/lib/firebase.ts:initializeApp()`
- Type definitions: `src/lib/types.ts`

**Data Hooks:**
- Session state: `src/hooks/useSession.ts:useSession(sessionId)`
- Expenses state: `src/hooks/useExpenses.ts:useExpenses(sessionId)`
- Debt calculation: `src/hooks/useDebts.ts:useDebts(sessionId)`

**Main Components:**
- App routing: `src/App.tsx`
- Session view: `src/components/DebtCalculator.tsx` (main session page)
- Archive view: `src/components/SessionArchive.tsx`

### Testing Locations

**Test File Structure:**

```
src/
  lib/
    __tests__/
      debtCalculator.test.ts     - Unit tests for algorithm
  components/
    ExpenseForm.test.tsx         - Component tests
    DebtCalculator.test.tsx      - Component tests
```

**Coverage Reports:**
- Generated in `coverage/` folder
- View: `coverage/index.html`

### Documentation to Update

**Files to Create/Update:**

1. **README.md** - Add sections:
   - Project description
   - Setup instructions (Firebase config)
   - Development commands
   - Deployment instructions

2. **CONTRIBUTING.md** (optional) - Add:
   - Code style guide
   - Testing requirements
   - PR process

3. **Firebase Security Rules** - Document in `firebase.json` or separate file

---

## UX/UI Considerations

**UI Components Affected:**

This is a full application build, so all UI is new:

- **Session Creation:** Large "New Session" button, generate link display
- **Player List:** Clean list with player names, join timestamp
- **Expense Form:** Input fields (amount, description, who paid dropdown)
- **Expense List:** Table or cards showing all expenses
- **Debt Display:** Clear "Alice owes Bob $X" with "Mark Paid" buttons
- **Archive List:** Past sessions with date, players, total

**UX Flow:**

**Primary Flow (Happy Path):**
1. User arrives at home page
2. Clicks "New Session" → Session created, link displayed
3. Shares link with friends (copy button)
4. Friends click link → Enter name → Join session
5. Anyone adds expenses (multiple allowed)
6. Debts auto-calculate and display
7. Players mark debts as paid
8. When all paid, "Archive Session" button appears
9. Session archived, moves to history

**Alternative Flow (View Archives):**
1. User clicks "View Archives" from home
2. Sees list of past sessions
3. Clicks session to view details (read-only)

**Visual/Interaction Patterns:**

**Swiss Minimalist Design System:**
- **Colors:** Black text on white background, red accent for actions
- **Typography:** System sans-serif, large font sizes (18px+ for body)
- **Spacing:** Generous whitespace (Tailwind `p-8`, `space-y-6`)
- **Layout:** Grid-based, centered content, max-width 800px
- **Buttons:** High contrast, clear labels, large touch targets
- **Forms:** Minimal borders, focus states, inline validation

**Responsive Design:**
- **Mobile (< 640px):** Single column, stacked layout, full-width buttons
- **Tablet (640-1024px):** Two-column where appropriate
- **Desktop (> 1024px):** Centered content, max-width constraint

**Accessibility:**
- **Keyboard Navigation:** All actions accessible via Tab/Enter
- **Screen Readers:** Proper ARIA labels on forms and buttons
- **Focus States:** Visible focus outlines (Tailwind default)
- **Color Contrast:** 7:1 ratio (black on white)

**User Feedback:**
- **Loading States:** "Creating session..." spinner during Firebase writes
- **Error Messages:** Inline validation errors (red text below inputs)
- **Success Confirmations:** "Session created! Share link below."
- **Real-time Updates:** Instant UI updates (no manual refresh)

---

## Testing Approach

**Test Framework:** Vitest (Vite-native, Jest-compatible)

**Testing Libraries:**
- `@testing-library/react` - Component testing
- `@testing-library/user-event` - User interactions
- `vitest` - Test runner

**Test Strategy:**

**1. Unit Tests (Business Logic):**

**`lib/debtCalculator.test.ts`:**
```typescript
describe('calculateDebts', () => {
  it('should split equally when one person pays all', () => {
    // Alice pays $60, 3 players
    // Bob and Carol owe Alice $20 each
  });

  it('should handle multiple payers', () => {
    // Alice pays $40, Bob pays $20, 3 players
    // Total $60, each owes $20
    // Alice gets back $20, Carol owes $20
  });

  it('should return empty array for no expenses', () => {});

  it('should handle single player (no debts)', () => {});

  it('should round to 2 decimal places', () => {});
});
```

**2. Component Tests:**

**`components/ExpenseForm.test.tsx`:**
- Form validation (positive amounts, non-empty description)
- Submit handling
- Player dropdown population
- Error display

**`components/DebtCalculator.test.tsx`:**
- Debt display accuracy
- Mark-as-paid interaction
- Real-time update simulation

**3. Integration Tests:**

**Firebase Mocking:**
- Use Firebase Emulator for local testing
- Mock Firebase in component tests (vitest mock)

**End-to-End Scenario:**
```typescript
it('should complete full session flow', async () => {
  // 1. Create session
  // 2. Add players
  // 3. Add expenses
  // 4. Verify debts calculated
  // 5. Mark as paid
  // 6. Archive session
});
```

**Coverage Targets:**
- **Critical Logic (debtCalculator):** 100%
- **Hooks:** 90%+
- **Components:** 80%+
- **Overall:** 75%+

**Manual Testing:**
- Multi-device sync (open on 2 phones)
- Responsive design (Chrome DevTools device toolbar)
- Link sharing (copy/paste in different browser)
- Performance (Lighthouse audit: target 90+ on mobile)

---

## Deployment Strategy

### Deployment Steps

**Option 1: Vercel (Recommended)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build project
npm run build

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
# Add all VITE_FIREBASE_* variables
```

**Option 2: Firebase Hosting**

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize hosting
firebase init hosting

# 4. Build project
npm run build

# 5. Deploy
firebase deploy --only hosting
```

**Deployment Checklist:**
- ✅ Firebase environment variables set
- ✅ Firebase security rules deployed
- ✅ Production build tested locally (`npm run preview`)
- ✅ Lighthouse audit passing (>90 performance)
- ✅ Test on real mobile device

### Rollback Plan

**Vercel:**
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

**Firebase Hosting:**
1. `firebase hosting:rollback` (rolls back to previous version)

**Firebase Database:**
- No schema migrations (NoSQL)
- If data corruption: restore from Firebase backup (manual export)

### Monitoring

**What to Monitor:**

**Firebase Console:**
- Realtime Database usage (connections, bandwidth)
- Errors in Firebase logs
- Security rule violations

**Vercel Analytics:**
- Page load times
- Error rates (500 errors)
- Traffic patterns

**User Feedback:**
- Manual testing after deployment
- Ask beta users (your Pickleball group!) for feedback
- Monitor for edge cases

**Alerts to Set (Production):**
- Firebase free tier quota approaching (90% bandwidth)
- Error rate spikes (>5% of requests)
- Unusual traffic patterns (potential abuse)

---

**End of Technical Specification**
