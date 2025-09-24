import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';
import Image from 'next/image';
import Link from 'next/link';

const QuickActions = () => {
  const { theme } = useFinanceStore();

  const actions = [
    {
      title: 'Adicionar Receita',
      description: 'Registre uma nova receita',
      icon: '💰',
      color: 'green',
      href: '/transactions?type=income',
    },
    {
      title: 'Adicionar Despesa',
      description: 'Registre uma nova despesa',
      icon: '💸',
      color: 'red',
      href: '/transactions?type=expense',
    },
    {
      title: 'Nova Meta',
      description: 'Defina uma meta financeira',
      icon: '🎯',
      color: 'blue',
      href: '/goals/new',
    },
    {
      title: 'Investir',
      description: 'Acompanhe investimentos',
      icon: '📈',
      color: 'purple',
      href: '/investments',
    },
  ];

  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-violet-500',
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
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ações Rápidas
          </h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Acesso rápido às funções principais
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className={`block p-4 rounded-xl transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-700/50 hover:bg-gray-700' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[action.color]} flex items-center justify-center`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {action.title}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {action.description}
                </p>
              </div>
              <svg className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* AI Chat Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-6 p-4 rounded-xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800' 
            : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="/images/Robo do mal.png"
              alt="Chat IA"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Chat com IA 🤖
            </h4>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tire dúvidas sobre suas finanças
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium"
          >
            Conversar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;
