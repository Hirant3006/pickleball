import { useState, useEffect } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Archive,
  Calendar,
  ChevronRight,
  Loader2,
  PartyPopper,
} from 'lucide-react';

const USER_NAME_KEY = 'pickle_user_name';

export default function SessionCreate() {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Load user name from localStorage on mount
  useEffect(() => {
    const savedUserName = localStorage.getItem(USER_NAME_KEY);
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      // If no user name, redirect to dashboard which will show onboarding
      navigate('/');
    }
  }, [navigate]);

  const handleCreateSession = async () => {
    if (!name.trim()) {
      alert('Tên kèo là gì thế?');
      return;
    }

    if (!userName) {
      alert('Không tìm thấy tên người dùng. Tải lại trang xem sao!');
      return;
    }

    if (!user) {
      alert('Đang xác thực, chờ tí nhé...');
      return;
    }

    setCreating(true);
    try {
      const sessionRef = push(ref(db, 'sessions'));
      const sessionId = sessionRef.key!;

      await set(sessionRef, {
        name: name.trim(),
        date,
        hostId: user.uid,
        hostName: userName,
        createdAt: Date.now(),
        players: {
          [user.uid]: {
            name: userName,
            joinedAt: Date.now(),
          }
        },
        expenses: {},
        settlements: {},
        archived: false,
        archivedAt: null,
      });

      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Lỗi tạo kèo:', error);
      alert('Tạo kèo mới không được rồi. Thử lại sau nhé.');
    } finally {
      setCreating(false);
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
      <h1 className="text-6xl font-bold mb-4 text-black">pickle</h1>
      {userName && (
        <p className="text-xl text-gray-600 mb-12">Lập kèo với tư cách {userName}</p>
      )}

      <div className="w-full max-w-md mb-8 space-y-4">
        <div>
          <label htmlFor="session-name" className="flex items-center gap-2 text-lg font-bold mb-2">
            <PartyPopper className="w-5 h-5" /> Tên Kèo
          </label>
          <input
            id="session-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Kèo Cà Phê Sáng Thứ 3"
            className="w-full px-4 py-3 border-2 border-black text-lg"
            disabled={creating}
          />
        </div>

        <div>
          <label htmlFor="session-date" className="flex items-center gap-2 text-lg font-bold mb-2">
            <Calendar className="w-5 h-5" /> Ngày
          </label>
          <input
            id="session-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-black text-lg"
            disabled={creating}
          />
        </div>
      </div>

      <button
        onClick={handleCreateSession}
        disabled={creating}
        className="px-12 py-6 bg-black text-white text-2xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors mb-8 inline-flex items-center gap-3"
      >
        {creating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Đang tạo kèo...
          </>
        ) : (
          <>
            Lập Kèo Mới! <ChevronRight className="w-6 h-6" />
          </>
        )}
      </button>

      <a href="#/archives" className="text-lg underline hover:no-underline flex items-center gap-2">
        <Archive className="w-5 h-5" /> Xem Kho Lưu Trữ
      </a>
    </div>
  );
}
