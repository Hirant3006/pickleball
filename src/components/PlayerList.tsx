import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Player } from '../lib/types';
import { Loader2, UserPlus, Users, X } from 'lucide-react';

interface PlayerListProps {
  players: Record<string, Omit<Player, 'id'>>;
  sessionId: string;
  isHost: boolean;
  hostId: string;
  currentUserId?: string;
}

export default function PlayerList({ players, sessionId, isHost, hostId, currentUserId }: PlayerListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [adding, setAdding] = useState(false);

  const playerArray = Object.entries(players).map(([id, player]) => ({
    id,
    ...player,
  }));

  // Create a combined list with all players, marking the host
  const allPlayers = playerArray.map(p => ({
    ...p,
    isHost: p.id === hostId
  }));

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    setAdding(true);
    try {
      const playerRef = push(ref(db, `sessions/${sessionId}/players`));
      await set(playerRef, {
        name: newPlayerName.trim(),
        joinedAt: Date.now(),
      });

      setNewPlayerName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Lỗi thêm người chơi:', error);
      alert('Hỏng rồi, không thêm được. Thử lại sau nhé.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-7 h-7" />
          Các Tay Chơi ({allPlayers.length})
        </h2>
        {isHost && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Thêm Đồng Bọn
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPlayer} className="mb-4 p-4 border-2 border-black bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Tên Đồng Bọn"
              className="flex-1 px-3 py-2 border-2 border-gray-300"
              disabled={adding}
              autoFocus
            />
            <button
              type="submit"
              disabled={adding || !newPlayerName.trim()}
              className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 w-28"
            >
              {adding ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewPlayerName('');
              }}
              className="p-2 bg-gray-300 text-black font-bold hover:bg-gray-400"
              disabled={adding}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {allPlayers.map((player) => {
          const isCurrentUser = player.id === currentUserId;
          return (
            <li key={player.id} className="text-lg">
              {player.name}
              {player.isHost && ' (chủ kèo)'}
              {isCurrentUser && !player.isHost && ' (bạn)'}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
