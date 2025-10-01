import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
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
import ExpensesColumnChart from '../components/Dashboard/ExpensesColumnChart';
import AddTransactionModal from '../components/Dashboard/AddTransactionModal';
import TransactionDetails from '../components/Dashboard/TransactionDetails';

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
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
  const [isEditing, setIsEditing] = useState(false);

  const [expandedCards, setExpandedCards] = useState({
    income: false,
    expense: false
  });

  // 🔒 PROTEÇÃO: Redirecionar se não autenticado
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('🚫 Acesso negado - Redirecionando para login...');
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Verificar se é o mês atual
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    setIsCurrentMonth(selectedMonth === currentMonth && selectedYear === currentYear);
  }, [selectedMonth, selectedYear]);

  // Buscar dados do mês selecionado
  useEffect(() => {
    // ⏳ Aguardar autenticação antes de buscar dados
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        console.log('📊 Carregando inicial - mês:', selectedMonth, 'ano:', selectedYear);
        const [summaryResponse, transactionsResponse] = await Promise.all([
          fetch(`/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}`),
          fetch(`/api/transactions?month=${selectedMonth}&year=${selectedYear}`)
        ]);

        const [summaryData, transactionsData] = await Promise.all([
          summaryResponse.json(),
          transactionsResponse.json()
        ]);

        console.log('📊 Dados carregados:', {
          summary: summaryData,
          transactions: transactionsData,
          total: transactionsData?.length || 0
        });

        setSummary(summaryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, isLoaded, isSignedIn]);

  const refreshData = async () => {
    try {
      console.log('🔍 Buscando dados atualizados para mês:', selectedMonth, 'ano:', selectedYear);
      const [summaryResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}`),
        fetch(`/api/transactions?month=${selectedMonth}&year=${selectedYear}`)
      ]);

      if (!summaryResponse.ok || !transactionsResponse.ok) {
        console.error('❌ Erro nas respostas:', {
          summary: summaryResponse.status,
          transactions: transactionsResponse.status
        });
        return;
      }

      const [summaryData, transactionsData] = await Promise.all([
        summaryResponse.json(),
        transactionsResponse.json()
      ]);

      console.log('✅ Dados recebidos:', { 
        summaryData, 
        transactionsData,
        totalTransactions: transactionsData?.length || 0
      });
      
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
    }
  };

  const handleTransactionAdded = () => {
    console.log('✅ Transação adicionada, atualizando dados...');
    setHasUnsavedChanges(true);
    
    // Aguardar um momento para garantir que a API salvou
    setTimeout(() => {
      console.log('🔄 Executando refresh dos dados...');
      refreshData();
    }, 300);
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
    setIsEditing(false);
    // Aqui você pode adicionar lógica adicional de salvamento se necessário
  };

  const openModal = (type) => {
    console.log('Abrindo modal para:', type, 'mês:', selectedMonth, 'ano:', selectedYear);
    setModalType(type);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (cardType) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
  };

  // 🔒 Tela de carregamento durante verificação de autenticação
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="text-white text-lg font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

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
    <MainLayout
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      setSelectedMonth={setSelectedMonth}
      setSelectedYear={setSelectedYear}
      isEditMode={isEditMode}
      setIsEditMode={setIsEditMode}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      handleSave={handleSave}
      openModal={openModal}
    >
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Gráfico e Cards lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Gráfico de Pizza */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/30"
          >
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Receitas vs Despesas
                </h2>
            <div className="h-[300px] sm:h-[400px]">
              <ExpensesPieChart data={summary} />
                </div>
          </motion.div>

          {/* Cards de Resumo com Detalhes */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Receitas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/30"
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
                  isEditMode={isEditMode}
                  onUpdated={refreshData}
                />
                  </motion.div>
                )}
          </motion.div>

          {/* Despesas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/30"
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
                  isEditMode={isEditMode}
                  onUpdated={refreshData}
                />
                  </motion.div>
                )}
        </motion.div>
        </div>
        </div>

        {/* Gráfico de Colunas - Despesas por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/30"
        >
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Despesas por Categoria
          </h2>
          <div className="h-[300px] sm:h-[400px]">
            <ExpensesColumnChart data={summary} />
          </div>
        </motion.div>

        {/* Modal de Adicionar Transação */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          onTransactionAdded={handleTransactionAdded}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </MainLayout>
  );
}