import { useState, FormEvent } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Player } from '../lib/types';

interface ExpenseFormProps {
  sessionId: string;
  players: Player[];
}

export default function ExpenseForm({ sessionId, players }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!amount || !description.trim() || !paidBy) return;

    setSubmitting(true);
    try {
      const expenseRef = push(ref(db, `sessions/${sessionId}/expenses`));

      await set(expenseRef, {
        amount: parseFloat(amount),
        description: description.trim(),
        paidBy,
        createdAt: Date.now(),
      });

      // Clear form
      setAmount('');
      setDescription('');
      setPaidBy('');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (players.length === 0) {
    return (
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
        <p className="text-gray-600">
          Add players first before logging expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Add Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block font-bold mb-2">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Court rental, Balls, Water"
            required
            className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block font-bold mb-2">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="paidBy" className="block font-bold mb-2">
            Who Paid?
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}
