import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Calendar, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  X,
  Pencil
} from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export default function TransactionDetails({ transactions, type, onDelete, isEditMode = false, onUpdated }) {
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [form, setForm] = useState({ amount: '', category: '', date: '' });

  const filteredTransactions = transactions.filter(t => t.type === type);

  const handleDelete = async (transactionId) => {
    setDeletingId(transactionId);
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        const errorData = await response.json();
        console.error('Erro ao excluir transação:', errorData);
        alert('Erro ao excluir transação: ' + (errorData.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro de conexão ao excluir transação');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (t) => {
    if (!isEditMode) return;
    setEditingId(t._id);
    setForm({
      amount: String(t.amount ?? ''),
      category: t.category ?? '',
      date: new Date(t.date).toISOString().slice(0, 10)
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ amount: '', category: '', date: '' });
  };

  const saveEdit = async (t) => {
    try {
      setSavingId(t._id);
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        date: form.date
      };
      const res = await fetch(`/api/transactions/${t._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha ao salvar alterações');
      }
      if (typeof onUpdated === 'function') onUpdated();
      cancelEdit();
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingId(null);
    }
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400 mb-2">
          {type === 'income' ? (
            <TrendingUp className="w-8 h-8 mx-auto" />
          ) : (
            <TrendingDown className="w-8 h-8 mx-auto" />
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhuma {type === 'income' ? 'receita' : 'despesa'} registrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {filteredTransactions.map((transaction) => (
          <motion.div
            key={transaction._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg border transition-colors ${
              type === 'income' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {editingId === transaction._id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Valor (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.amount}
                          onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                          className="w-full px-2 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Categoria</label>
                        <input
                          type="text"
                          value={form.category}
                          onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full px-2 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Data</label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full px-2 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span className={`font-medium ${
                          type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {transaction.note && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {transaction.note}
                  </p>
                )}

                {transaction.isFixed && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    Fixa
                  </span>
                )}
              </div>

              {isEditMode && (
                <div className="ml-3 flex items-center space-x-1">
                  {editingId === transaction._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(transaction)}
                        disabled={savingId === transaction._id}
                        className="px-2 py-1 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        title="Salvar alterações"
                      >
                        {savingId === transaction._id ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Cancelar"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(transaction)}
                        className="p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        title="Editar"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        disabled={deletingId === transaction._id}
                        className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        title="Excluir"
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
