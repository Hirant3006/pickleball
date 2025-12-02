import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useUserSessions } from '../hooks/useUserSessions';
import { useAuth } from '../hooks/useAuth';
import {
  Archive,
  Coins,
  PlusCircle,
  Users,
  Wrench,
  Loader2,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react';

const USER_NAME_KEY = 'pickle_user_name';

export default function SessionDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading, error } = useUserSessions();
  const [userName, setUserName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [sessionLink, setSessionLink] = useState('');

  const loading = authLoading || sessionsLoading;

  // Check if user has a saved name
  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY);
    if (savedName) {
      setUserName(savedName);
      setShowOnboarding(false);
    } else if (!authLoading) {
      // User is loaded but no name saved - show onboarding
      setShowOnboarding(true);
    }
  }, [authLoading]);

  const handleSaveName = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      alert('Cho xin cái tên nào!');
      return;
    }

    setSavingName(true);
    localStorage.setItem(USER_NAME_KEY, trimmedName);
    setUserName(trimmedName);
    setShowOnboarding(false);
    setSavingName(false);
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleArchive = async (e: React.MouseEvent, sessionId: string, sessionName: string) => {
    e.stopPropagation(); // Prevent navigation to session detail

    const confirmed = confirm(`Chốt sổ kèo "${sessionName}" thiệt hả? Kèo này sẽ chỉ được xem thôi đó.`);
    if (!confirmed) return;

    try {
      await update(ref(db, `sessions/${sessionId}`), {
        archived: true,
        archivedAt: Date.now(),
      });
    } catch (error) {
      console.error('Lỗi chốt sổ:', error);
      alert('Hỏng rồi, chốt sổ không được. Thử lại sau nhé.');
    }
  };

  const handleJoinByLink = () => {
    const trimmedLink = sessionLink.trim();
    if (!trimmedLink) {
      alert('Dán link vào đây nào!');
      return;
    }

    // Extract session ID from various link formats
    // Supports: full URL or just the session ID
    let sessionId = '';

    try {
      // Try to match hash-based URLs like: http://domain/#/join/ABC123
      const hashMatch = trimmedLink.match(/#\/join\/([^/?]+)/);
      if (hashMatch) {
        sessionId = hashMatch[1];
      } else {
        // Try to match direct session IDs (just the ID string)
        const idMatch = trimmedLink.match(/^([a-zA-Z0-9_-]+)$/);
        if (idMatch) {
          sessionId = idMatch[1];
        }
      }

      if (!sessionId) {
        alert('Link không hợp lệ. Vui lòng kiểm tra lại!');
        return;
      }

      // Navigate to join page
      navigate(`/join/${sessionId}`);
    } catch (error) {
      console.error('Lỗi xử lý link:', error);
      alert('Link không đúng định dạng. Thử lại nhé!');
    }
  };

  // Show onboarding for new users
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md">
          <div className="flex justify-center items-center gap-4 mb-8">
            <Wrench className="w-12 h-12" />
            <h1 className="text-6xl font-bold text-black">Chào Mừng!</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Bắt đầu thôi. Cho xin cái tên nào?
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
              placeholder="Nhập tên của bạn..."
              className="w-full px-4 py-3 border-2 border-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
              disabled={savingName}
            />
          </div>

          <button
            onClick={handleSaveName}
            disabled={savingName}
            className="w-full px-8 py-4 bg-black text-white text-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {savingName ? 'Đang lưu...' : 'Tiếp Tục'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h1 className="text-3xl font-bold text-black">Đang tải các kèo...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-4">Lỗi! Tải kèo thất bại</h1>
          <p className="text-gray-600 mb-8">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black text-white text-lg font-bold hover:bg-gray-800"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-4 text-black text-center">pickle</h1>
        {userName && (
          <p className="text-2xl text-gray-600 mb-8 text-center">
            Mừng trở lại, {userName}!
          </p>
        )}

        {/* Join Session CTA */}
        <div className="mb-12 p-6 border-2 border-black bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
              <label htmlFor="session-link" className="flex items-center gap-2 text-lg font-bold mb-2">
                <LinkIcon className="w-5 h-5" /> Có Link Kèo? Nhập Hội Ngay!
              </label>
              <input
                id="session-link"
                type="text"
                value={sessionLink}
                onChange={(e) => setSessionLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinByLink()}
                placeholder="Dán link kèo vào đây..."
                className="w-full px-4 py-3 border-2 border-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              onClick={handleJoinByLink}
              className="w-full sm:w-auto px-8 py-3 bg-black text-white text-lg font-bold hover:bg-gray-800 transition-colors self-end flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-5 h-5" /> Nhập Hội
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold">Các Kèo Của Tui</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate('/archives')}
              className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-black text-sm sm:text-lg font-bold hover:bg-gray-300 flex items-center justify-center gap-2"
            >
              <Archive className="w-4 h-4" /> Kho Lưu Trữ
            </button>
            <button
              onClick={() => navigate('/create-session')}
              className="flex-1 sm:flex-none px-4 py-2 sm:px-8 sm:py-4 bg-black text-white text-sm sm:text-lg font-bold hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Tạo Kèo Mới
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl mb-4 text-gray-600">Chưa có kèo nào</p>
            <p className="text-lg mb-8 text-gray-500">Lập kèo đầu tiên để bắt đầu cuộc vui!</p>
            <button
              onClick={() => navigate('/create-session')}
              className="px-12 py-6 bg-black text-white text-2xl font-bold hover:bg-gray-800 inline-flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6" /> Tạo Kèo Mới
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const isHost = session.hostId === user?.uid;

              return (
                <div
                  key={session.id}
                  className="border-2 border-black p-6 hover:bg-gray-100 transition-colors"
                >
                  <div
                    onClick={() => navigate(`/session/${session.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold">{session.name}</h3>
                      {isHost && (
                        <span className="px-3 py-1 bg-black text-white text-sm font-bold">
                          CHỦ KÈO
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-4">{session.date}</p>
                    <div className="flex gap-8 text-sm items-center">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-bold">Số người:</span> {session.totalPlayers}
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">Tổng thiệt hại:</span> {formatVND(session.totalExpenses)} VND
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300 flex justify-end">
                    <button
                      onClick={(e) => handleArchive(e, session.id, session.name)}
                      className="px-4 py-2 bg-gray-800 text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" /> Chốt Sổ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
