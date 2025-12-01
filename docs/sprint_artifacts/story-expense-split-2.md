# Story 1.2: Expense Logging & Debt Calculation

**Status:** Draft

---

## User Story

As a player in an active session,
I want to log expenses and see who owes whom automatically,
So that we can settle up fairly without manual calculation.

---

## Acceptance Criteria

**AC #1:** Any player can add an expense with amount, description, and who paid
**Given** I am viewing an active session with players
**When** I fill out the expense form (amount, description, select payer) and click "Add Expense"
**Then** The expense is saved to Firebase and appears in the expense list

**AC #2:** Multiple expenses can be added per session (e.g., court $40, balls $10)
**Given** A session already has one expense
**When** I add another expense
**Then** Both expenses appear in the expense list with running total updated

**AC #3:** Running expense total displays and updates in real-time
**Given** Multiple expenses exist in a session
**When** A new expense is added by any player
**Then** The total amount updates instantly on all devices

**AC #4:** App calculates equal split: total ÷ player count
**Given** Total expenses are $60 and there are 3 players
**When** The debt calculation runs
**Then** Each player's equal share is $20.00

**AC #5:** "Who owes whom" view displays debts clearly (e.g., "Bob owes Alice $12.50")
**Given** Expenses have been logged with different payers
**When** The debt calculator processes the data
**Then** Clear debt statements are displayed showing who owes whom and how much

**AC #6:** Debt calculations are accurate to 2 decimal places
**Given** Total is $58.33 split among 3 players (equal share = $19.44)
**When** Debts are calculated
**Then** All amounts are rounded to 2 decimals and total debt matches total paid

**AC #7:** All players see expense and debt updates instantly (<500ms latency)
**Given** Multiple players are viewing the session on different devices
**When** One player adds an expense
**Then** All devices show the new expense and updated debts within 500ms

---

## Implementation Details

### Tasks / Subtasks

- [ ] Define Expense and Settlement types (AC: #1, #5)
  - [ ] Add Expense interface to `src/lib/types.ts`: `{ amount, description, paidBy, createdAt }`
  - [ ] Add Settlement interface: `{ from, to, amount, paid, paidAt }`

- [ ] Build expense form component (AC: #1, #2)
  - [ ] Create `src/components/ExpenseForm.tsx`
  - [ ] Add form fields: amount (number input), description (text), paidBy (dropdown of players)
  - [ ] Validate: amount > 0, description non-empty, paidBy selected
  - [ ] On submit: generate expense ID, write to Firebase `sessions/{sessionId}/expenses/{expenseId}`
  - [ ] Clear form after successful submission

- [ ] Build expense list component (AC: #2, #3)
  - [ ] Create `src/components/ExpenseList.tsx`
  - [ ] Create `src/hooks/useExpenses.ts` hook with Firebase listener
  - [ ] Subscribe to `sessions/{sessionId}/expenses` with `.on('value')`
  - [ ] Display all expenses in list (description, amount, who paid, timestamp)
  - [ ] Calculate and display running total

- [ ] Implement debt calculation algorithm (AC: #4, #5, #6)
  - [ ] Create `src/lib/debtCalculator.ts`
  - [ ] Implement `calculateDebts(expenses: Expense[], players: Player[]): Settlement[]`
    - [ ] Step 1: Calculate total expenses
    - [ ] Step 2: Calculate equal share (total / playerCount)
    - [ ] Step 3: Calculate net balance per player (paid - equalShare)
    - [ ] Step 4: Match creditors (positive balance) with debtors (negative balance)
    - [ ] Step 5: Round all amounts to 2 decimal places
  - [ ] Handle edge cases: no expenses, single player, rounding errors
  - [ ] Write comprehensive unit tests

- [ ] Build debt calculator display component (AC: #5, #7)
  - [ ] Create `src/components/DebtCalculator.tsx`
  - [ ] Create `src/hooks/useDebts.ts` hook
  - [ ] Use `useExpenses` and `useSession` to get data
  - [ ] Call `debtCalculator.calculateDebts()` to compute settlements
  - [ ] Display debts clearly: "Bob owes Alice $12.50"
  - [ ] Update automatically when expenses or players change

- [ ] Test real-time sync and calculation accuracy (AC: #3, #6, #7)
  - [ ] Test adding expenses from multiple devices
  - [ ] Verify real-time updates (<500ms)
  - [ ] Test edge case: $58.33 / 3 players (verify rounding)
  - [ ] Test single payer scenario (one person pays everything)
  - [ ] Test multiple payers scenario (complex balancing)

- [ ] Write unit tests for debt calculator (AC: #4, #5, #6)
  - [ ] Create `src/lib/__tests__/debtCalculator.test.ts`
  - [ ] Test: Equal split when one person pays all
  - [ ] Test: Multiple payers with different amounts
  - [ ] Test: Empty expenses (no debts)
  - [ ] Test: Single player (no debts)
  - [ ] Test: Rounding to 2 decimals

### Technical Summary

**Approach:**
- Expense form writes directly to Firebase, triggering real-time updates
- Custom `useExpenses` hook subscribes to expenses with Firebase listener
- Debt calculation is pure function (no side effects) for easy testing
- `useDebts` hook combines `useExpenses` + `useSession` + `debtCalculator` for derived state
- Settlements are calculated client-side (not stored in Firebase yet - Story 1.3)

**Key Algorithm (Debt Calculation):**
1. Sum all expenses to get total
2. Divide total by player count to get equal share
3. For each player, calculate: `amountPaid - equalShare`
   - Positive = owed money (creditor)
   - Negative = owes money (debtor)
4. Sort creditors descending, debtors ascending
5. Match creditors with debtors greedily (minimize transactions)
6. Round all amounts to 2 decimals

**Files/Modules Involved:**
- `src/lib/types.ts` - Add Expense, Settlement types
- `src/lib/debtCalculator.ts` - Pure calculation logic
- `src/hooks/useExpenses.ts` - Firebase expenses listener
- `src/hooks/useDebts.ts` - Combine data + calculation
- `src/components/ExpenseForm.tsx` - Add expense UI
- `src/components/ExpenseList.tsx` - Display expenses
- `src/components/DebtCalculator.tsx` - Display debts

### Project Structure Notes

- **Files to modify:**
  - `src/lib/types.ts` (add Expense, Settlement interfaces)

- **Files to create:**
  - `src/lib/debtCalculator.ts`
  - `src/lib/__tests__/debtCalculator.test.ts`
  - `src/hooks/useExpenses.ts`
  - `src/hooks/useDebts.ts`
  - `src/components/ExpenseForm.tsx`
  - `src/components/ExpenseList.tsx`
  - `src/components/DebtCalculator.tsx`

- **Expected test locations:**
  - `src/lib/__tests__/debtCalculator.test.ts` (unit tests)
  - `src/components/ExpenseForm.test.tsx`
  - `src/components/DebtCalculator.test.tsx`

- **Estimated effort:** 3 story points

- **Prerequisites:**
  - Story 1.1 complete (session creation, player management)
  - Firebase session data structure established
  - useSession hook available

### Key Code References

**Debt Calculation Algorithm Example:**

```typescript
// src/lib/debtCalculator.ts
export function calculateDebts(expenses: Expense[], players: Player[]): Settlement[] {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const equalShare = total / players.length;

  const balances = players.map(player => {
    const paid = expenses
      .filter(exp => exp.paidBy === player.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      playerId: player.id,
      balance: paid - equalShare, // Positive = owed, Negative = owes
    };
  });

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

**Firebase Expense Structure:**
```typescript
{
  sessions: {
    [sessionId]: {
      expenses: {
        [expenseId]: {
          amount: 40.00,
          description: "Court rental",
          paidBy: "playerId123",
          createdAt: 1701450000000
        }
      }
    }
  }
}
```

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Complete debt calculation algorithm with pseudocode
- Firebase data model for expenses
- Edge case handling (rounding, single player, no expenses)
- Real-time sync patterns using Firebase listeners
- Testing strategy for calculation accuracy

**Previous Story:**
- Story 1.1: Session Creation & Player Management (provides `useSession` hook, player data)

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
