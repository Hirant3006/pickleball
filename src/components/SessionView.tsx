import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useExpenses } from '../hooks/useExpenses';
import { useDebts } from '../hooks/useDebts';
import PlayerList from './PlayerList';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import DebtCalculator from './DebtCalculator';

export default function SessionView() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session, loading, error } = useSession(sessionId);
  const { expenses } = useExpenses(sessionId);
  const { debts, players } = useDebts(sessionId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}#/join/${sessionId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please copy manually: ' + link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Session Not Found</div>
          <a href="#/" className="text-lg underline">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const isArchived = session?.archived === true;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {isArchived && (
          <div className="bg-yellow-100 border-2 border-yellow-600 p-4 mb-8">
            <div className="font-bold text-xl mb-1">⚠️ Archived Session (Read-Only)</div>
            <div className="text-sm">
              Archived on {session.archivedAt ? new Date(session.archivedAt).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">pickle Session</h1>

          <div className="bg-black text-white p-6 space-y-4">
            <div>
              <div className="text-sm mb-2">Share this link:</div>
              <div className="font-mono text-sm break-all mb-3">
                {`${window.location.origin}${window.location.pathname}#/join/${sessionId}`}
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <PlayerList players={session.players || {}} />

          {!isArchived && <ExpenseForm sessionId={sessionId!} players={players} />}

          <ExpenseList expenses={expenses} players={players} />

          <DebtCalculator
            sessionId={sessionId!}
            debts={debts}
            players={players}
            isArchived={isArchived}
          />
        </div>
      </div>
    </div>
  );
}
