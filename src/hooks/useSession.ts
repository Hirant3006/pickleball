import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../lib/firebase';
import { Session } from '../lib/types';

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const sessionRef = ref(db, `sessions/${sessionId}`);

    const handleValue = (snapshot: any) => {
      if (snapshot.exists()) {
        setSession({
          id: sessionId,
          ...snapshot.val(),
        });
      } else {
        setError(new Error('Session not found'));
      }
      setLoading(false);
    };

    const handleError = (err: Error) => {
      setError(err);
      setLoading(false);
    };

    onValue(sessionRef, handleValue, handleError);

    return () => {
      off(sessionRef);
    };
  }, [sessionId]);

  return { session, loading, error };
}
