import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function SessionCreate() {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    setCreating(true);
    try {
      const sessionRef = push(ref(db, 'sessions'));
      const sessionId = sessionRef.key!;

      await set(sessionRef, {
        createdAt: Date.now(),
        players: {},
        expenses: {},
        settlements: {},
        archived: false,
        archivedAt: null,
      });

      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-6xl font-bold mb-12 text-black">pickle</h1>

      <button
        onClick={handleCreateSession}
        disabled={creating}
        className="px-12 py-6 bg-black text-white text-2xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors mb-8"
      >
        {creating ? 'Creating...' : 'New Session'}
      </button>

      <a href="#/archives" className="text-lg underline hover:no-underline">
        View Archives
      </a>
    </div>
  );
}
