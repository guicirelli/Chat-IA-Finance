import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Calendar, Tag, DollarSign } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, type, onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: type || 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    fixed: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = {
    income: [
      'Salário',
      'Bônus',
      'Freelance',
      'Investimentos',
      'Vendas',
      'Outros'
    ],
    expense: [
      'Aluguel',
      'Água',
      'Luz',
      'Gás',
      'Internet',
      'Streaming',
      'Celular',
      'Telefone',
      'Transporte',
      'Curso',
      'Faculdade',
      'Plano de Saúde',
      'Assinaturas',
      'Lazer',
      'Presentes',
      'Pet',
      'Alimentação'
    ]
  };

  // Atualizar o tipo quando a prop mudar
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        type: type || 'expense',
        category: type === 'income' ? categories.income[0] : categories.expense[0],
        amount: '',
        note: '',
        fixed: false
      }));
      setError('');
    }
  }, [isOpen, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.amount || !formData.category || !formData.date) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('O valor deve ser um número positivo.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          amount: parsedAmount,
          category: formData.category,
          date: formData.date,
          note: formData.note,
          isFixed: formData.fixed
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao adicionar transação.');
      }

      onTransactionAdded();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  formData.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {formData.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {formData.type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa'}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formData.type === 'income' ? 'Registre uma nova entrada' : 'Registre um novo gasto'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Valor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Valor (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Categoria e Data em linha */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Categoria
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                      required
                    >
                      {categories[formData.type].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Observação */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Observação (opcional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Ex: Aluguel do apartamento, Bônus de vendas..."
                />
              </div>

              {/* Despesa Fixa - só para despesas */}
              {formData.type === 'expense' && (
                <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <input
                    type="checkbox"
                    name="fixed"
                    id="fixed"
                    checked={formData.fixed}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fixed" className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Despesa Fixa</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      Repetir automaticamente todo mês
                    </span>
                  </label>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors ${
                    formData.type === 'income'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  }`}
                >
                  {loading ? 'Salvando...' : (formData.type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}