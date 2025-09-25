import { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import ExpensesPieChart from '../components/Dashboard/ExpensesPieChart';
import MonthlyLineChart from '../components/Dashboard/MonthlyLineChart';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState('monthly'); // monthly, yearly

  // Buscar dados de análise
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Análises
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Seletor de Período */}
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            {/* Seletor de Mês/Ano */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Receitas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Receitas</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {formatCurrency(summary?.totalIncome)}
              </p>
            </div>
          </motion.div>

          {/* Despesas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Despesas</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {formatCurrency(summary?.totalExpenses)}
              </p>
            </div>
          </motion.div>

          {/* Saldo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Saldo</p>
              <p className={`text-2xl font-semibold ${
                (summary?.balance || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(summary?.balance)}
              </p>
            </div>
          </motion.div>

          {/* Economia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Economia</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {summary?.savingsRatio?.toFixed(1 || 0)}%
              </p>
            </div>
          </motion.div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Distribuição de Gastos
            </h2>
            <div className="h-[300px]">
              <ExpensesPieChart data={summary} />
            </div>
          </motion.div>

          {/* Gráfico de Linha */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Evolução Mensal
            </h2>
            <div className="h-[300px]">
              <MonthlyLineChart data={summary} />
            </div>
          </motion.div>
        </div>

        {/* Análise Detalhada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Análise Detalhada
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Categorias de Despesas */}
            <div>
              <h3 className="text-md font-medium text-slate-900 dark:text-white mb-3">
                Top Categorias de Despesas
              </h3>
              <div className="space-y-2">
                {Object.entries(summary?.expenseCategories || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], index) => {
                    const total = Object.values(summary?.expenseCategories || {}).reduce((a, b) => a + b, 0);
                    const percentage = ((amount / total) * 100).toFixed(1);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][index]
                          }`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(amount)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Resumo do Mês */}
            <div>
              <h3 className="text-md font-medium text-slate-900 dark:text-white mb-3">
                Resumo do Mês
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Receitas</span>
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(summary?.totalIncome)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Despesas</span>
                  <span className="text-sm font-bold text-red-700 dark:text-red-300">
                    {formatCurrency(summary?.totalExpenses)}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  (summary?.balance || 0) >= 0 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <span className={`text-sm font-medium ${
                    (summary?.balance || 0) >= 0 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    Saldo Final
                  </span>
                  <span className={`text-sm font-bold ${
                    (summary?.balance || 0) >= 0 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {formatCurrency(summary?.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
