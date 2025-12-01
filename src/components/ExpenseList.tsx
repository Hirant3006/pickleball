import { Expense } from '../lib/types';
import { Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  hostName: string;
}

export default function ExpenseList({ expenses, hostName }: ExpenseListProps) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Receipt className="w-7 h-7" /> Các Khoản "Thiệt Hại"
        </h2>
        <p className="text-gray-600">Chưa có "thiệt hại" nào. Thêm ở trên nhé!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Receipt className="w-7 h-7" />
        Các Khoản "Thiệt Hại" (Tổng: {formatVND(total)} VND)
      </h2>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white p-4 border-2 border-black"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold text-lg">{expense.description}</div>
              <div className="text-xl font-bold">{formatVND(expense.amount)} VND</div>
            </div>
            <div className="text-sm text-gray-600">
              Người trả: {hostName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
