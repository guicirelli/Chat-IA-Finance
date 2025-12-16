import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';

const RecentTransactions = () => {
  const { theme, transactions } = useFinanceStore();

  // Pegar as últimas 5 transações
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getCategoryIcon = (category) => {
    const icons = {
      'Alimentação': '🍽️',
      'Transporte': '🚗',
      'Moradia': '🏠',
      'Lazer': '🎮',
      'Saúde': '🏥',
      'Educação': '📚',
      'Assinaturas': '📱',
      'Investimentos': '📈',
      'Outros': '📦',
      'Salário': '💰',
      'Freelance': '💼',
      'Investimento': '📊',
    };
    return icons[category] || '💰';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Alimentação': 'bg-green-100 text-green-700',
      'Transporte': 'bg-blue-100 text-blue-700',
      'Moradia': 'bg-purple-100 text-purple-700',
      'Lazer': 'bg-yellow-100 text-yellow-700',
      'Saúde': 'bg-red-100 text-red-700',
      'Educação': 'bg-indigo-100 text-indigo-700',
      'Assinaturas': 'bg-pink-100 text-pink-700',
      'Investimentos': 'bg-emerald-100 text-emerald-700',
      'Outros': 'bg-gray-100 text-gray-700',
      'Salário': 'bg-green-100 text-green-700',
      'Freelance': 'bg-blue-100 text-blue-700',
      'Investimento': 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
          : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Transações Recentes
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Your latest transactions
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } transition-colors`}
        >
          Ver todas
        </motion.button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-700/50 hover:bg-gray-700' 
                  : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                transaction.type === 'income' 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
              }`}>
                {getCategoryIcon(transaction.category)}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.category}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {transaction.note || 'Sem descrição'}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {new Date(transaction.date).toLocaleDateString('en-US')}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(transaction.amount)}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            } mb-2`}>
              No transactions yet
            </h4>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Comece adicionando suas primeiras receitas e despesas
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentTransactions;
