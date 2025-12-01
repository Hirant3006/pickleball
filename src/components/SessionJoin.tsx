import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Loader2, LogIn, User } from 'lucide-react';

export default function SessionJoin() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !sessionId || !user) return;

    setJoining(true);
    try {
      // Use user UID as the player key to link with auth
      const playerRef = ref(db, `sessions/${sessionId}/players/${user.uid}`);

      await set(playerRef, {
        name: name.trim(),
        joinedAt: Date.now(),
      });

      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Lỗi nhập hội:', error);
      alert('Hỏng rồi, không nhập hội được. Thử lại sau nhé.');
    } finally {
      setJoining(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h1 className="text-3xl font-bold text-black">Đang tải...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <LogIn className="w-10 h-10" />
        <h1 className="text-4xl font-bold text-black">Nhập Hội</h1>
      </div>

      <form onSubmit={handleJoin} className="w-full max-w-md space-y-6">
        <div>
          <label htmlFor="name" className="flex items-center gap-2 text-lg font-bold mb-2">
            <User className="w-5 h-5" /> Tên Của Bạn
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Điền tên vào đây nè..."
            maxLength={50}
            required
            className="w-full px-4 py-3 border-2 border-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={joining || !name.trim()}
          className="w-full px-8 py-4 bg-black text-white text-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors inline-flex items-center justify-center gap-3"
        >
          {joining ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang nhập hội...
            </>
          ) : (
            <>
              Xác Nhận Nhập Hội <LogIn className="w-6 h-6" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
