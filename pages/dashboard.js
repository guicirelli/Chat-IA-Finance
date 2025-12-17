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
import { normalizeAmount } from '../utils/transactionHelpers';

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeCategories: {},
    expenseCategories: {}
  });
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
  const [refreshKey, setRefreshKey] = useState(0); // Chave para forçar atualização dos gráficos

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
        
        // CRÍTICO: No Netlify, fazer requisições sequenciais para garantir sincronização
        const timestamp = Date.now();
        const cacheHeaders = {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        };

        // Primeiro buscar transações
        console.log('📥 Buscando transações...');
        const transactionsResponse = await fetch(
          `/api/transactions?month=${selectedMonth}&year=${selectedYear}&_t=${timestamp}`, 
          {
            cache: 'no-store',
            headers: cacheHeaders
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error(`Erro ao buscar transações: ${transactionsResponse.status}`);
        }

        const transactionsData = await transactionsResponse.json();
        console.log('✅ Transações carregadas:', transactionsData?.length || 0);

        // Aguardar antes de buscar summary
        await new Promise(resolve => setTimeout(resolve, 200));

        // Depois buscar summary
        console.log('📊 Buscando summary...');
        const summaryResponse = await fetch(
          `/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}&_t=${timestamp + 1}`, 
          {
            cache: 'no-store',
            headers: cacheHeaders
          }
        );

        let summaryData;
        if (summaryResponse.ok) {
          summaryData = await summaryResponse.json();
        } else {
          console.warn('⚠️ Erro ao buscar summary, calculando manualmente...');
          // Calcular manualmente se a API falhar
          summaryData = {
            totalIncome: transactionsData.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0),
            totalExpenses: transactionsData.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0),
            balance: 0,
            incomeCategories: {},
            expenseCategories: {}
          };
          summaryData.balance = summaryData.totalIncome - summaryData.totalExpenses;
        }

        console.log('📊 Dados carregados:', {
          summary: summaryData,
          transactions: transactionsData,
          total: transactionsData?.length || 0
        });

        // VALIDAÇÃO: Garantir que os valores são números válidos
        const validatedSummary = {
          ...summaryData,
          totalIncome: typeof summaryData?.totalIncome === 'number' && !isNaN(summaryData.totalIncome) 
            ? Math.max(0, summaryData.totalIncome)
            : 0,
          totalExpenses: typeof summaryData?.totalExpenses === 'number' && !isNaN(summaryData.totalExpenses)
            ? Math.max(0, summaryData.totalExpenses)
            : 0
        };

        setSummary(validatedSummary);
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
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
      
      // CRÍTICO: No Netlify, fazer requisições sequenciais para garantir sincronização
      // Primeiro buscar transações para garantir que o global está populado
      const timestamp = Date.now();
      const cacheHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-ID': `${timestamp}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      console.log('📥 Passo 1: Buscando transações primeiro...');
      const transactionsResponse = await fetch(
        `/api/transactions?month=${selectedMonth}&year=${selectedYear}&_t=${timestamp}`, 
        {
          cache: 'no-store',
          method: 'GET',
          headers: cacheHeaders
        }
      );

      if (!transactionsResponse.ok) {
        console.error('❌ Erro ao buscar transações:', transactionsResponse.status);
        return;
      }

      const transactionsData = await transactionsResponse.json();
      console.log('✅ Transações recebidas:', {
        count: transactionsData?.length || 0,
        data: transactionsData
      });

      // CRÍTICO: Aguardar um pouco para garantir que o global foi atualizado no Netlify
      // Isso ajuda quando containers são diferentes entre requisições
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('📊 Passo 2: Buscando summary...');
      const summaryResponse = await fetch(
        `/api/transactions/summary?month=${selectedMonth}&year=${selectedYear}&_t=${timestamp + 1}`, 
        {
          cache: 'no-store',
          method: 'GET',
          headers: cacheHeaders
        }
      );

      if (!summaryResponse.ok) {
        console.error('❌ Erro ao buscar summary:', summaryResponse.status);
        // Se summary falhar, calcular manualmente das transações
        console.log('⚠️ Calculando summary manualmente das transações...');
        const manualSummary = calculateManualSummary(transactionsData);
        setSummary(manualSummary);
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        setRefreshKey(prev => prev + 1);
        return;
      }

      const summaryData = await summaryResponse.json();

      console.log('✅ Dados recebidos e atualizados:', { 
        summaryData, 
        transactionsData,
        totalTransactions: transactionsData?.length || 0,
        totalIncome: summaryData?.totalIncome,
        totalExpenses: summaryData?.totalExpenses,
        // VALIDAÇÃO: Verificar se os valores estão corretos
        incomeValidation: typeof summaryData?.totalIncome === 'number' && !isNaN(summaryData.totalIncome),
        expenseValidation: typeof summaryData?.totalExpenses === 'number' && !isNaN(summaryData.totalExpenses)
      });
      
      // VALIDAÇÃO: Garantir que os valores são números válidos
      const validatedSummary = {
        ...summaryData,
        totalIncome: typeof summaryData?.totalIncome === 'number' && !isNaN(summaryData.totalIncome) 
          ? Math.max(0, summaryData.totalIncome)
          : 0,
        totalExpenses: typeof summaryData?.totalExpenses === 'number' && !isNaN(summaryData.totalExpenses)
          ? Math.max(0, summaryData.totalExpenses)
          : 0
      };
      
      // CRÍTICO: Se summary retornar zeros mas temos transações, calcular manualmente
      if ((validatedSummary.totalIncome === 0 && validatedSummary.totalExpenses === 0) && 
          Array.isArray(transactionsData) && transactionsData.length > 0) {
        console.warn('⚠️ Summary retornou zeros mas temos transações, recalculando...');
        const manualSummary = calculateManualSummary(transactionsData);
        setSummary(manualSummary);
      } else {
        setSummary(validatedSummary);
      }
      
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      
      // Forçar atualização dos gráficos
      setRefreshKey(prev => prev + 1);
      setHasUnsavedChanges(true);
      
      console.log('📊 Estado atualizado, gráficos devem ser re-renderizados');
      
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
    }
  };

  // Função auxiliar para calcular summary manualmente quando a API falha
  const calculateManualSummary = (transactions) => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        incomeCategories: {},
        expenseCategories: {}
      };
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeCategories = {};
    const expenseCategories = {};

    transactions.forEach(transaction => {
      const type = String(transaction.type || '').toLowerCase().trim();
      const amount = typeof transaction.amount === 'number' ? Math.abs(transaction.amount) : 0;
      const category = String(transaction.category || 'Outros').trim();

      if (type === 'income' && amount > 0) {
        totalIncome += amount;
        incomeCategories[category] = (incomeCategories[category] || 0) + amount;
      } else if (type === 'expense' && amount > 0) {
        totalExpenses += amount;
        expenseCategories[category] = (expenseCategories[category] || 0) + amount;
      }
    });

    return {
      totalIncome: Math.max(0, totalIncome),
      totalExpenses: Math.max(0, totalExpenses),
      balance: totalIncome - totalExpenses,
      incomeCategories,
      expenseCategories
    };
  };

  const handleTransactionAdded = () => {
    console.log('✅ Transação adicionada, atualizando dados...');
    setHasUnsavedChanges(true);
    
    // Aguardar um momento para garantir que a API salvou (aumentar tempo no Netlify)
    // No Netlify pode haver latência, então esperamos um pouco mais
    setTimeout(() => {
      console.log('🔄 Executando refresh dos dados...');
      refreshData();
    }, 500); // Aumentado de 300ms para 500ms para garantir no Netlify
  };

  const handleTransactionDeleted = () => {
    console.log('🗑️ Transação excluída, atualizando dados...');
    setHasUnsavedChanges(true);
    
    // Aguardar um pouco para garantir que a transação foi removida
    setTimeout(() => {
      console.log('🔄 Executando refresh dos dados após exclusão...');
      refreshData();
    }, 300);
  };

  const handleTransactionUpdated = () => {
    console.log('✏️ Transação editada, atualizando dados e gráficos...');
    setHasUnsavedChanges(true);
    
    // Aguardar um momento para garantir que a API processou a edição (aumentar tempo no Netlify)
    setTimeout(() => {
      console.log('🔄 Executando refresh dos dados após edição...');
      refreshData();
    }, 500); // Aumentado de 200ms para 500ms para garantir no Netlify
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
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
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
    const normalized = normalizeAmount(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(normalized);
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
                  Income vs Expenses
                </h2>
            <div className="h-[300px] sm:h-[400px]" key={`pie-${refreshKey}`}>
              <ExpensesPieChart data={summary || { totalIncome: 0, totalExpenses: 0 }} />
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
                  <p className="text-sm text-slate-600 dark:text-slate-400">Income</p>
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
                  onUpdated={handleTransactionUpdated}
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
                  <p className="text-sm text-slate-600 dark:text-slate-400">Expenses</p>
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
                  onUpdated={handleTransactionUpdated}
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
            Expenses by Category
          </h2>
          <div className="h-[300px] sm:h-[400px]" key={`column-${refreshKey}`}>
            <ExpensesColumnChart data={summary || { expenseCategories: {} }} />
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