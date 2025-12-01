import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../lib/firebase';
import { Settlement } from '../lib/types';

export function useSettlements(sessionId: string | undefined) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const settlementsRef = ref(db, `sessions/${sessionId}/settlements`);

    const handleValue = (snapshot: any) => {
      const settlementsData: Settlement[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child: any) => {
          settlementsData.push({
            id: child.key,
            ...child.val(),
          });
        });
      }
      setSettlements(settlementsData);
      setLoading(false);
    };

    onValue(settlementsRef, handleValue);

    return () => {
      off(settlementsRef);
    };
  }, [sessionId]);

  return { settlements, loading };
}
