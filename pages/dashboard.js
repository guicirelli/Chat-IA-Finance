import { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import ExpensesPieChart from '../components/Dashboard/ExpensesPieChart';
import AddTransactionModal from '../components/Dashboard/AddTransactionModal';
import TransactionDetails from '../components/Dashboard/TransactionDetails';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedCards, setExpandedCards] = useState({
    income: false,
    expense: false
  });

  // Verificar se é o mês atual
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    setIsCurrentMonth(selectedMonth === currentMonth && selectedYear === currentYear);
  }, [selectedMonth, selectedYear]);

  // Buscar dados do mês selecionado
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryResponse, transactionsResponse] = await Promise.all([
          fetch(`/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}`),
          fetch(`/api/transactions?month=${selectedMonth}&year=${selectedYear}`)
        ]);

        const [summaryData, transactionsData] = await Promise.all([
          summaryResponse.json(),
          transactionsResponse.json()
        ]);

        setSummary(summaryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const refreshData = async () => {
    try {
      console.log('Buscando dados atualizados...');
      const [summaryResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}`),
        fetch(`/api/transactions?month=${selectedMonth}&year=${selectedYear}`)
      ]);

      const [summaryData, transactionsData] = await Promise.all([
        summaryResponse.json(),
        transactionsResponse.json()
      ]);

      console.log('Dados recebidos:', { summaryData, transactionsData });
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleTransactionAdded = () => {
    console.log('Transação adicionada, atualizando dados...');
    setHasUnsavedChanges(true);
    
    // Aguardar um pouco para garantir que a transação foi salva
    setTimeout(refreshData, 500);
  };

  const handleTransactionDeleted = () => {
    console.log('Transação excluída, atualizando dados...');
    setHasUnsavedChanges(true);
    
    // Aguardar um pouco para garantir que a transação foi removida
    setTimeout(refreshData, 300);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    // Aqui você pode adicionar lógica adicional de salvamento se necessário
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (cardType) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Dashboard
                </h1>

                {/* Seletor de Mês/Ano integrado */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                </div>
              </div>
              
              <div className="flex items-center space-x-4">

            {/* Botões de Ação - só aparecem no modo de edição */}
            {isEditMode && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openModal('income')}
                  className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-green-500/25 active:scale-95"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Receita</div>
                    <div className="text-xs opacity-90">Adicionar entrada</div>
                  </div>
                </button>
                <button
                  onClick={() => openModal('expense')}
                  className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-red-500/25 active:scale-95"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Despesa</div>
                    <div className="text-xs opacity-90">Registrar gasto</div>
                  </div>
                </button>
                
                {/* Botão Salvar - sempre aparece no modo de edição */}
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Salvar</span>
                </button>
              </div>
            )}

            {/* Botão Editar - só aparece quando não está editando */}
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </button>
            )}
          </div>
            </div>



        {/* Gráfico e Cards lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Receitas vs Despesas
                </h2>
            <div className="h-[400px]">
              <ExpensesPieChart data={summary} />
                </div>
          </motion.div>

          {/* Cards de Resumo com Detalhes */}
          <div className="grid grid-cols-1 gap-6">
          {/* Receitas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receitas</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(summary?.totalIncome)}
                  </p>
                </div>
              </div>

              {/* Setinha para expandir/colapsar */}
              <button
                onClick={() => toggleCardExpansion('income')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    expandedCards.income ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

                {/* Detalhes das Receitas - só aparece quando expandido */}
                {expandedCards.income && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <TransactionDetails 
                      transactions={transactions}
                      type="income"
                      onDelete={handleTransactionDeleted}
                    />
                  </motion.div>
                )}
          </motion.div>

          {/* Despesas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Despesas</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(summary?.totalExpenses)}
                      </p>
                    </div>
                  </div>

              {/* Setinha para expandir/colapsar */}
              <button
                onClick={() => toggleCardExpansion('expense')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    expandedCards.expense ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

                {/* Detalhes das Despesas - só aparece quando expandido */}
                {expandedCards.expense && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <TransactionDetails 
                      transactions={transactions}
                      type="expense"
                      onDelete={handleTransactionDeleted}
                    />
                  </motion.div>
                )}
        </motion.div>
        </div>
        </div>


        {/* Modal de Adicionar Transação */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
    </MainLayout>
  );
}