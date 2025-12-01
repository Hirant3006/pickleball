import { Player } from '../lib/types';

interface PlayerListProps {
  players: Record<string, Omit<Player, 'id'>>;
}

export default function PlayerList({ players }: PlayerListProps) {
  const playerArray = Object.entries(players).map(([id, player]) => ({
    id,
    ...player,
  }));

  if (playerArray.length === 0) {
    return (
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Players</h2>
        <p className="text-gray-600">No players yet. Share the link to invite!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">
        Players ({playerArray.length})
      </h2>
      <ul className="space-y-2">
        {playerArray.map((player) => (
          <li key={player.id} className="text-lg">
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
