export interface Player {
  id: string;
  name: string;
  joinedAt: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  paidBy: string;
  createdAt: number;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  paid: boolean;
  paidAt: number | null;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  hostId: string;
  hostName: string;
  createdAt: number;
  players: Record<string, Omit<Player, 'id'>>;
  expenses: Record<string, Omit<Expense, 'id'>>;
  settlements: Record<string, Omit<Settlement, 'id'>>;
  archived: boolean;
  archivedAt: number | null;
}
