import { useState, FormEvent } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Coins, Landmark, Loader2, Plus, Receipt } from 'lucide-react';

interface ExpenseFormProps {
  sessionId: string;
  hostId: string;
  hostName: string;
}

export default function ExpenseForm({ sessionId, hostId, hostName }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!amount || !description.trim()) return;

    setSubmitting(true);
    try {
      const expenseRef = push(ref(db, `sessions/${sessionId}/expenses`));

      await set(expenseRef, {
        amount: parseFloat(amount),
        description: description.trim(),
        paidBy: hostId,
        createdAt: Date.now(),
      });

      // Clear form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Lỗi thêm chi tiêu:', error);
      alert('Hỏng rồi, không thêm được khoản chi. Thử lại sau nhé.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Receipt className="w-7 h-7" /> Thêm "Thiệt Hại"
      </h2>
      <p className="text-sm text-gray-600 mb-4">Người trả: {hostName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="flex items-center gap-2 font-bold mb-2">
            <Landmark className="w-5 h-5" /> Nội dung chi
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Tiền sân, banh, nước..."
            required
            className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="amount" className="flex items-center gap-2 font-bold mb-2">
            <Coins className="w-5 h-5" /> Số tiền (VND)
          </label>
          <input
            id="amount"
            type="number"
            step="1000"
            min="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang thêm...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Thêm Khoản Chi
            </>
          )}
        </button>
      </form>
    </div>
  );
}
