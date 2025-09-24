import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionList({ transactions = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Data</th>
            <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Tipo</th>
            <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Categoria</th>
            <th className="text-right p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <motion.tr
              key={transaction._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                {formatDate(transaction.date)}
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {transaction.category}
                  </span>
                  {transaction.isFixed && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      Fixa
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4 text-right">
                <span className={`text-sm font-medium ${
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
