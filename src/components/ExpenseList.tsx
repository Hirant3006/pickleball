import { Expense, Player } from '../lib/types';

interface ExpenseListProps {
  expenses: Expense[];
  players: Player[];
}

export default function ExpenseList({ expenses, players }: ExpenseListProps) {
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>
        <p className="text-gray-600">No expenses yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">
        Expenses (Total: ${total.toFixed(2)})
      </h2>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white p-4 border-2 border-black"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold text-lg">{expense.description}</div>
              <div className="text-xl font-bold">${expense.amount.toFixed(2)}</div>
            </div>
            <div className="text-sm text-gray-600">
              Paid by: {getPlayerName(expense.paidBy)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
