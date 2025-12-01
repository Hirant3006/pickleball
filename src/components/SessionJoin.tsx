import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';

export default function SessionJoin() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !sessionId) return;

    setJoining(true);
    try {
      const playerRef = push(ref(db, `sessions/${sessionId}/players`));

      await set(playerRef, {
        name: name.trim(),
        joinedAt: Date.now(),
      });

      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-black">Join Session</h1>

      <form onSubmit={handleJoin} className="w-full max-w-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-bold mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
            className="w-full px-4 py-3 border-2 border-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={joining || !name.trim()}
          className="w-full px-8 py-4 bg-black text-white text-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {joining ? 'Joining...' : 'Join Session'}
        </button>
      </form>
    </div>
  );
}
