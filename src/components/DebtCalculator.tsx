import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { Player, Settlement } from '../lib/types';
import { useSettlements } from '../hooks/useSettlements';
import { FilePlus2, Scale, Users } from 'lucide-react';

interface DebtCalculatorProps {
  sessionId: string;
  debts: Omit<Settlement, 'id'>[];
  players: Player[];
  hostId: string;
  hostName: string;
  isArchived?: boolean;
}

export default function DebtCalculator({ sessionId, debts, players, hostId, hostName, isArchived = false }: DebtCalculatorProps) {
  const { settlements } = useSettlements(sessionId);

  const getPlayerName = (playerId: string) => {
    if (playerId === hostId) return hostName;
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : 'Người lạ';
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleTogglePaid = async (settlementId: string, currentPaidStatus: boolean) => {
    try {
      await update(ref(db, `sessions/${sessionId}/settlements/${settlementId}`), {
        paid: !currentPaidStatus,
        paidAt: !currentPaidStatus ? Date.now() : null,
      });
    } catch (error) {
      console.error('Lỗi cập nhật thanh toán:', error);
      alert('Hỏng rồi, không cập nhật được. Thử lại sau nhé.');
    }
  };

  if (debts.length === 0) {
    const needMorePlayers = players.length < 2;
    return (
      <div className="bg-gray-100 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <Scale className="w-7 h-7" /> Cân Kèo Chia Tiền
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          {needMorePlayers ? (
            <>
              <Users className="w-5 h-5" />
              <p>Thêm bạn thêm vui! Có đông người mới chia được chứ.</p>
            </>
          ) : (
            <>
              <FilePlus2 className="w-5 h-5" />
              <p>Chưa có "thiệt hại" nào. Thêm chi tiêu để xem ai trả ai nhé!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Scale className="w-7 h-7" /> Cân Kèo Chia Tiền
      </h2>

      <div className="space-y-3">
        {settlements.map((settlement) => {
          const isPaid = settlement.paid === true;

          return (
            <div
              key={settlement.id}
              className="bg-white border-2 border-black p-4"
            >
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={() => {
                    if (!isArchived) {
                      handleTogglePaid(settlement.id, isPaid);
                    }
                  }}
                  disabled={isArchived}
                  className="w-6 h-6 border-2 border-black cursor-pointer accent-black disabled:cursor-not-allowed"
                />

                <div className="flex-1 flex justify-between items-center">
                  <div className={`text-lg ${isPaid ? 'line-through text-gray-400' : ''}`}>
                    <span className="font-bold">{getPlayerName(settlement.from)}</span>
                    {' trả cho '}
                    <span className="font-bold">{getPlayerName(settlement.to)}</span>
                  </div>

                  <div className={`text-xl font-bold ${isPaid ? 'line-through text-gray-400' : ''}`}>
                    {formatVND(settlement.amount)} VND
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
