import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Calendar, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  X
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

export default function TransactionDetails({ transactions, type, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

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
        console.error('Erro ao excluir transação');
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    } finally {
      setDeletingId(null);
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

              <button
                onClick={() => handleDelete(transaction._id)}
                disabled={deletingId === transaction._id}
                className="ml-3 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Excluir transação"
              >
                {deletingId === transaction._id ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
