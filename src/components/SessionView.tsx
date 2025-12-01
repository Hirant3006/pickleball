import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import { useExpenses } from '../hooks/useExpenses';
import { useDebts } from '../hooks/useDebts';
import PlayerList from './PlayerList';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import DebtCalculator from './DebtCalculator';
import {
  Loader2,
  AlertTriangle,
  Archive,
  Clipboard,
  ClipboardCheck,
  ArrowLeft,
} from 'lucide-react';

export default function SessionView() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { session, loading, error } = useSession(sessionId);
  const { expenses } = useExpenses(sessionId);
  const { debts, players } = useDebts(sessionId);
  const [copied, setCopied] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}#/join/${sessionId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Lỗi copy link:', err);
      alert('Hỏng rồi, không copy link được. Copy tay cho chắc: ' + link);
    }
  };

  const handleArchive = async () => {
    if (!sessionId) return;

    const confirmed = confirm('Chốt sổ kèo này thiệt hả? Nó sẽ bị khoá đó.');
    if (!confirmed) return;

    setArchiving(true);
    try {
      await update(ref(db, `sessions/${sessionId}`), {
        archived: true,
        archivedAt: Date.now(),
      });
      navigate('/');
    } catch (error) {
      console.error('Lỗi chốt sổ:', error);
      alert('Hỏng rồi, chốt sổ không được. Thử lại sau nhé.');
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h1 className="text-3xl font-bold text-black">Đang tải kèo...</h1>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <div className="text-2xl font-bold mb-4">Hỏng Bét! Không Tìm Thấy Kèo</div>
          <a href="#/" className="text-lg underline">
            Về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  const isArchived = session?.archived === true;
  const isHost = session.hostId === user?.uid;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {isArchived && (
          <div className="bg-yellow-100 border-2 border-yellow-600 p-4 mb-8 flex items-center gap-4">
            <Archive className="w-8 h-8 text-yellow-800" />
            <div>
              <div className="font-bold text-xl mb-1 text-yellow-800">KÈO ĐÃ CHỐT SỔ (CHỈ XEM)</div>
              <div className="text-sm text-yellow-700">
                Chốt sổ ngày {session.archivedAt ? new Date(session.archivedAt).toLocaleDateString('vi-VN') : 'không rõ'}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{session.name}</h1>
              <p className="text-xl text-gray-600">{session.date}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-3 bg-gray-200 text-black font-bold hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-black text-white p-6 space-y-4">
            <div>
              <div className="text-sm mb-2">Gửi link này cho đồng bọn:</div>
              <div className="font-mono text-sm break-all mb-3">
                {`${window.location.origin}${window.location.pathname}#/join/${sessionId}`}
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-5 h-5" /> ✓ Đã Copy!
                </>
              ) : (
                <>
                  <Clipboard className="w-5 h-5" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <PlayerList
            players={session.players || {}}
            sessionId={sessionId!}
            isHost={isHost}
            hostId={session.hostId}
            currentUserId={user?.uid}
          />

          {!isArchived && (
            <ExpenseForm
              sessionId={sessionId!}
              hostId={session.hostId}
              hostName={session.hostName}
            />
          )}

          <ExpenseList expenses={expenses} hostName={session.hostName} />

          <DebtCalculator
            sessionId={sessionId!}
            debts={debts}
            players={players}
            hostId={session.hostId}
            hostName={session.hostName}
            isArchived={isArchived}
          />

          {!isArchived && isHost && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <button
                onClick={handleArchive}
                disabled={archiving}
                className="w-full px-8 py-4 bg-gray-800 text-white font-bold hover:bg-black disabled:bg-gray-400 transition-colors inline-flex items-center justify-center gap-3"
              >
                {archiving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Đang Chốt Sổ...
                  </>
                ) : (
                  <>
                    <Archive className="w-6 h-6" /> Chốt Sổ & Lưu Trữ
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Kèo đã chốt sổ sẽ chỉ được xem và cất vào kho lưu trữ.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
