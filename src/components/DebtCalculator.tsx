import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { Player, Settlement } from '../lib/types';
import { useSettlements } from '../hooks/useSettlements';

interface DebtCalculatorProps {
  sessionId: string;
  debts: Omit<Settlement, 'id'>[];
  players: Player[];
  isArchived?: boolean;
}

export default function DebtCalculator({ sessionId, debts, players, isArchived = false }: DebtCalculatorProps) {
  const { settlements } = useSettlements(sessionId);
  const [archiving, setArchiving] = useState(false);

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  const handleMarkAsPaid = async (settlementId: string) => {
    try {
      await update(ref(db, `sessions/${sessionId}/settlements/${settlementId}`), {
        paid: true,
        paidAt: Date.now(),
      });
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Failed to mark as paid. Please try again.');
    }
  };

  const handleArchiveSession = async () => {
    if (!confirm('Archive this session? It will become read-only.')) return;

    setArchiving(true);
    try {
      await update(ref(db, `sessions/${sessionId}`), {
        archived: true,
        archivedAt: Date.now(),
      });
      alert('Session archived! Redirecting to home...');
      window.location.hash = '#/';
    } catch (error) {
      console.error('Error archiving session:', error);
      alert('Failed to archive session. Please try again.');
    } finally {
      setArchiving(false);
    }
  };

  const allPaid = settlements.length > 0 && settlements.every(s => s.paid === true);

  if (debts.length === 0) {
    return (
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Who Owes Whom</h2>
        <p className="text-gray-600">
          No debts yet. Add expenses to see the split!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Who Owes Whom</h2>

      <div className="space-y-4">
        {settlements.map((settlement) => {
          const isPaid = settlement.paid === true;

          return (
            <div
              key={settlement.id}
              className={`bg-white text-black p-4 ${isPaid ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-lg">
                  <span className={`font-bold ${isPaid ? 'line-through' : ''}`}>
                    {getPlayerName(settlement.from)}
                  </span>
                  {' owes '}
                  <span className={`font-bold ${isPaid ? 'line-through' : ''}`}>
                    {getPlayerName(settlement.to)}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isPaid ? 'line-through' : ''}`}>
                  ${settlement.amount.toFixed(2)}
                </div>
              </div>

              {isPaid ? (
                <div className="text-sm text-green-600 font-bold">
                  ✓ Paid {settlement.paidAt ? new Date(settlement.paidAt).toLocaleDateString() : ''}
                </div>
              ) : (
                !isArchived && (
                  <button
                    onClick={() => handleMarkAsPaid(settlement.id)}
                    className="w-full px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                  >
                    Mark as Paid
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {!isArchived && allPaid && (
        <div className="mt-6">
          <button
            onClick={handleArchiveSession}
            disabled={archiving}
            className="w-full px-6 py-4 bg-red-600 text-white text-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
          >
            {archiving ? 'Archiving...' : 'Archive Session'}
          </button>
          <p className="text-sm text-center mt-2">
            All debts paid! Archive this session to start fresh next week.
          </p>
        </div>
      )}
    </div>
  );
}
