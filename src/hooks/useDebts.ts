import { useMemo, useEffect } from 'react';
import { ref, set, remove } from 'firebase/database';
import { db } from '../lib/firebase';
import { useSession } from './useSession';
import { useExpenses } from './useExpenses';
import { calculateDebts } from '../lib/debtCalculator';

export function useDebts(sessionId: string | undefined) {
  const { session } = useSession(sessionId);
  const { expenses } = useExpenses(sessionId);

  const players = useMemo(() => {
    if (!session?.players) return [];
    return Object.entries(session.players).map(([id, player]) => ({
      id,
      ...player,
    }));
  }, [session]);

  const debts = useMemo(() => {
    return calculateDebts(expenses, players);
  }, [expenses, players]);

  // Auto-sync settlements to Firebase when debts change
  useEffect(() => {
    if (!sessionId || !session) return;

    const settlementsRef = ref(db, `sessions/${sessionId}/settlements`);

    // Clear old settlements and write new ones
    if (debts.length === 0) {
      remove(settlementsRef);
    } else {
      const settlementsData: any = {};
      debts.forEach((debt, index) => {
        settlementsData[`settlement-${index}`] = debt;
      });
      set(settlementsRef, settlementsData);
    }
  }, [sessionId, session, debts]);

  return { debts, players };
}
