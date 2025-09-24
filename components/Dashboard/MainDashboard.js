import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';
import MetricCard from './MetricCard';
import ChartSection from './ChartSection';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import GoalsProgress from './GoalsProgress';
import InvestmentOverview from './InvestmentOverview';
import Image from 'next/image';

const MainDashboard = () => {
  const { theme, metrics, transactions, goals, investments } = useFinanceStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className={`relative overflow-hidden rounded-3xl p-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Bem-vindo de volta! 👋
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 text-lg"
              >
                Aqui está um resumo das suas finanças hoje
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="hidden lg:block"
            >
              <Image
                src="/images/Robo do mal.png"
                alt="Finance Bot"
                width={120}
                height={120}
                className="rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32" />
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Receitas Totais"
          value={metrics.totalIncome}
          icon="💰"
          color="green"
          change="+12.5%"
          changeType="positive"
        />
        <MetricCard
          title="Despesas Totais"
          value={metrics.totalExpenses}
          icon="💸"
          color="red"
          change="-5.2%"
          changeType="negative"
        />
        <MetricCard
          title="Poupança"
          value={metrics.totalIncome - metrics.totalExpenses}
          icon="🏦"
          color="blue"
          change="+8.1%"
          changeType="positive"
        />
        <MetricCard
          title="Taxa de Poupança"
          value={`${metrics.savingsRate.toFixed(1)}%`}
          icon="📊"
          color="purple"
          change="+2.3%"
          changeType="positive"
        />
      </motion.div>

      {/* Charts and Analytics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <ChartSection />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </motion.div>

      {/* Bottom Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Goals Progress */}
        <GoalsProgress />
      </motion.div>

      {/* Investment Overview */}
      {investments.length > 0 && (
        <motion.div variants={itemVariants}>
          <InvestmentOverview />
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-800' 
            : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
        }`}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <Image
              src="/images/Robo do mal.png"
              alt="AI Insights"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Insights da IA 🤖
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Análise inteligente dos seus gastos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🎯</span>
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Meta Sugerida
              </span>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Economize R$ {Math.round(metrics.totalIncome * 0.1)} este mês para atingir 10% de poupança
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">💡</span>
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Dica do Dia
              </span>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Considere automatizar suas transferências para investimentos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">📈</span>
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Tendência
              </span>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Suas receitas estão {metrics.totalIncome > 0 ? 'crescendo' : 'estáveis'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainDashboard;
