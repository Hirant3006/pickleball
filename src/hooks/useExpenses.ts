import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../lib/firebase';
import { Expense } from '../lib/types';

export function useExpenses(sessionId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const expensesRef = ref(db, `sessions/${sessionId}/expenses`);

    const handleValue = (snapshot: any) => {
      const expensesData: Expense[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child: any) => {
          expensesData.push({
            id: child.key,
            ...child.val(),
          });
        });
      }
      setExpenses(expensesData);
      setLoading(false);
    };

    onValue(expensesRef, handleValue);

    return () => {
      off(expensesRef);
    };
  }, [sessionId]);

  return { expenses, loading };
}
