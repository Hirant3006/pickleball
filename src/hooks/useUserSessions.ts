import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Session } from '../lib/types';

export interface UserSession extends Session {
  totalPlayers: number;
  totalExpenses: number;
}

export function useUserSessions() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Wait for auth to be ready before fetching sessions
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        setError(new Error('User not authenticated'));
        return;
      }

    const sessionsRef = ref(db, 'sessions');

    const handleValue = (snapshot: any) => {
      try {
        const userSessions: UserSession[] = [];

        if (snapshot.exists()) {
          snapshot.forEach((child: any) => {
            const sessionData = child.val();
            const sessionId = child.key;

            // Filter: include only sessions where user is host or player AND not archived
            const isHost = sessionData.hostId === user.uid;
            const isPlayer = sessionData.players && sessionData.players[user.uid];
            const isArchived = sessionData.archived === true;

            if ((isHost || isPlayer) && !isArchived) {
              // Calculate total players
              const totalPlayers = sessionData.players
                ? Object.keys(sessionData.players).length
                : 0;

              // Calculate total expenses
              const totalExpenses = sessionData.expenses
                ? Object.values(sessionData.expenses).reduce(
                    (sum: number, expense: any) => sum + (expense.amount || 0),
                    0
                  )
                : 0;

              userSessions.push({
                id: sessionId,
                ...sessionData,
                totalPlayers,
                totalExpenses,
              });
            }
          });
        }

        setSessions(userSessions);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
        setLoading(false);
      }
    };

      onValue(sessionsRef, handleValue);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return { sessions, loading, error };
}
