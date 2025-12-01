import { Expense, Player, Settlement } from './types';

export function calculateDebts(
  expenses: Expense[],
  players: Player[]
): Omit<Settlement, 'id'>[] {
  if (expenses.length === 0 || players.length === 0) {
    return [];
  }

  // Step 1: Calculate total expenses
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 2: Calculate equal share per player
  const equalShare = total / players.length;

  // Step 3: Calculate net balance for each player
  const balances = players.map((player) => {
    const paid = expenses
      .filter((exp) => exp.paidBy === player.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      playerId: player.id,
      balance: paid - equalShare, // Positive = owed, Negative = owes
    };
  });

  // Step 4: Match creditors (positive) with debtors (negative)
  const creditors = balances
    .filter((b) => b.balance > 0.01) // Ignore tiny amounts due to rounding
    .sort((a, b) => b.balance - a.balance);

  const debtors = balances
    .filter((b) => b.balance < -0.01)
    .sort((a, b) => a.balance - b.balance);

  const settlements: Omit<Settlement, 'id'>[] = [];

  let i = 0,
    j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    settlements.push({
      from: debtor.playerId,
      to: creditor.playerId,
      amount: parseFloat(amount.toFixed(2)), // Round to 2 decimals
      paid: false,
      paidAt: null,
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (Math.abs(creditor.balance) < 0.01) i++;
    if (Math.abs(debtor.balance) < 0.01) j++;
  }

  return settlements;
}
