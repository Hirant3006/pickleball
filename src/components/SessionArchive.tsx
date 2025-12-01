import { useEffect, useState } from 'react';
import { ref, query, orderByChild, equalTo, onValue, off } from 'firebase/database';
import { db } from '../lib/firebase';
import { Session } from '../lib/types';
import { Archive, Home, Loader2 } from 'lucide-react';

export default function SessionArchive() {
  const [archivedSessions, setArchivedSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionsRef = ref(db, 'sessions');
    const archivesQuery = query(
      sessionsRef,
      orderByChild('archived'),
      equalTo(true)
    );

    const handleValue = (snapshot: any) => {
      const sessions: Session[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child: any) => {
          sessions.push({
            id: child.key,
            ...child.val(),
          });
        });

        // Sort by archivedAt descending (newest first)
        sessions.sort((a, b) => {
          const aTime = a.archivedAt || 0;
          const bTime = b.archivedAt || 0;
          return bTime - aTime;
        });
      }

      setArchivedSessions(sessions);
      setLoading(false);
    };

    onValue(archivesQuery, handleValue);

    return () => {
      off(archivesQuery);
    };
  }, []);

  const calculateTotal = (expenses: any) => {
    if (!expenses) return 0;
    return Object.values(expenses).reduce((sum: number, exp: any) => sum + exp.amount, 0);
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getPlayerNames = (players: any) => {
    if (!players) return 'Không có ai';
    return Object.values(players).map((p: any) => p.name).join(', ');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h1 className="text-3xl font-bold text-black">Đang tải kho lưu trữ...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Archive className="w-9 h-9" /> Kho Lưu Trữ Kèo
          </h1>
          <a href="#/" className="text-lg underline hover:no-underline inline-flex items-center gap-2">
            <Home className="w-5 h-5" /> Về Trang Chủ
          </a>
        </div>

        {archivedSessions.length === 0 ? (
          <div className="bg-gray-100 p-8 text-center">
            <p className="text-xl text-gray-600">Chưa có kèo nào được lưu trữ.</p>
            <p className="text-gray-500 mt-2">
              Chốt sổ một kèo là nó sẽ hiện ở đây!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {archivedSessions.map((session) => (
              <a
                key={session.id}
                href={`#/session/${session.id}`}
                className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <div className="text-sm mb-2">
                  {session.archivedAt ? `Chốt sổ ngày ${formatDate(session.archivedAt)}` : 'Ngày không rõ'}
                </div>
                <div className="font-bold mb-2 text-lg">
                  Người chơi: {getPlayerNames(session.players)}
                </div>
                <div className="text-2xl font-bold">
                  Tổng cộng: {formatVND(calculateTotal(session.expenses))} VND
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
