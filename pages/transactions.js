import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';
import AddTransactionModal from '../components/Dashboard/AddTransactionModal';

export default function TransactionsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [filters, setFilters] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    type: '',
    category: '',
    search: ''
  });

  // 🔒 PROTEÇÃO: Redirecionar se não autenticado
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Buscar transações
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month !== '') params.append('month', filters.month);
      if (filters.year !== '') params.append('year', filters.year);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`/api/transactions?${params}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters.month, filters.year, filters.type, filters.category]);

  // Filtrar transações localmente por busca
  const filteredTransactions = transactions.filter(transaction => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.note?.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  });

  const handleTransactionAdded = () => {
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const categories = {
    income: ['Salário', 'Bônus', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Entretenimento', 'Roupas', 'Outros']
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Transações
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setModalType('income'); setIsModalOpen(true); }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Receita</span>
            </button>
            <button
              onClick={() => { setModalType('expense'); setIsModalOpen(true); }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Despesa</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Filtros
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {/* Mês */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mês
              </label>
              <select
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ano
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
              >
                <option value="">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
              >
                <option value="">Todas</option>
                {Object.values(categories).flat().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Transações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Transações ({filteredTransactions.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Adicione sua primeira transação usando os botões acima.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Data</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Valor</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-700 dark:text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
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
                          {transaction.isFixed && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                              Fixa
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.note || '-'}
                        </span>
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
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button 
                            onClick={() => handleDelete(transaction._id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal de Adicionar Transação */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          onTransactionAdded={handleTransactionAdded}
          selectedMonth={filters.month}
          selectedYear={filters.year}
        />
      </div>
    </MainLayout>
  );
}
