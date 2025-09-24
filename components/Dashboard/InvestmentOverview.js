import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentOverview = () => {
  const { theme, investments, portfolio } = useFinanceStore();

  // Dados simulados para o gráfico de performance
  const performanceData = [
    { date: 'Jan', value: 10000 },
    { date: 'Fev', value: 10500 },
    { date: 'Mar', value: 11200 },
    { date: 'Abr', value: 10800 },
    { date: 'Mai', value: 12000 },
    { date: 'Jun', value: 12500 },
    { date: 'Jul', value: 13000 },
  ];

  const getInvestmentIcon = (type) => {
    const icons = {
      'acoes': '📈',
      'fundos': '🏦',
      'tesouro': '🏛️',
      'cdb': '💳',
      'cripto': '₿',
      'outros': '💎',
    };
    return icons[type] || '💎';
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
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Portfolio de Investimentos
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Acompanhe seus investimentos
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium"
        >
          Adicionar Investimento
        </motion.button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">💰</span>
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Valor Total
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            R$ {portfolio.totalValue.toLocaleString()}
          </p>
          <p className={`text-sm ${
            portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange.toFixed(2)}% hoje
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">📊</span>
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Retorno Mensal
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            portfolio.monthlyReturn >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {portfolio.monthlyReturn >= 0 ? '+' : ''}{portfolio.monthlyReturn.toFixed(2)}%
          </p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Este mês
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">🎯</span>
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Diversificação
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {investments.length}
          </p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Investimentos ativos
          </p>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-xl p-4 ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}
      >
        <h4 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Performance do Portfolio
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="date" 
                stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
                tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                }}
                formatter={(value) => [
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value),
                  'Valor'
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Investment List */}
      {investments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Meus Investimentos
          </h4>
          <div className="space-y-3">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                  {getInvestmentIcon(investment.type)}
                </div>
                <div className="flex-1">
                  <h5 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {investment.name}
                  </h5>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {investment.type} • Quantidade: {investment.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(investment.value)}
                  </p>
                  <p className={`text-sm ${
                    investment.return >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {investment.return >= 0 ? '+' : ''}{investment.return.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvestmentOverview;
