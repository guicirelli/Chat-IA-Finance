import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Calendar, Tag, DollarSign } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, type, onTransactionAdded, selectedMonth, selectedYear }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    note: ''
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
      // Garantir que selectedMonth e selectedYear sejam números válidos
      const month = typeof selectedMonth === 'number' ? selectedMonth : new Date().getMonth();
      const year = typeof selectedYear === 'number' ? selectedYear : new Date().getFullYear();
      
      // Criar data padrão para o mês/ano selecionado
      const defaultDate = new Date(year, month, new Date().getDate());
      const dateString = defaultDate.toISOString().split('T')[0];
      
      console.log('Modal aberto - month:', month, 'year:', year, 'dateString:', dateString);
      
      setFormData(prev => ({
        ...prev,
        type: type || 'expense',
        category: type === 'income' ? categories.income[0] : categories.expense[0],
        amount: '',
        note: '',
        date: dateString
      }));
      setError('');
    }
  }, [isOpen, type, selectedMonth, selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Modal submit iniciado - formData:', formData);
    console.log('Modal submit - selectedMonth:', selectedMonth, 'selectedYear:', selectedYear);
    setLoading(true);
    setError('');

    // Validação mais robusta dos campos obrigatórios
    if (!formData.amount || formData.amount.trim() === '') {
      setError('Por favor, informe o valor.');
      setLoading(false);
      return;
    }
    
    if (!formData.category || formData.category.trim() === '') {
      setError('Por favor, selecione uma categoria.');
      setLoading(false);
      return;
    }
    
    if (!formData.date || formData.date.trim() === '') {
      setError('Por favor, informe a data.');
      setLoading(false);
      return;
    }
    
    // Validar se a data é válida
    const dateObj = new Date(formData.date);
    if (isNaN(dateObj.getTime())) {
      setError('Por favor, informe uma data válida.');
      setLoading(false);
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    console.log('Valor parseado:', parsedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.log('Valor inválido:', parsedAmount);
      setError('O valor deve ser um número positivo.');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        type: formData.type,
        amount: parsedAmount,
        category: formData.category,
        date: formData.date,
        note: formData.note,
        isFixed: false
      };
      console.log('Enviando requisição para API:', requestData);
      
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Resposta da API recebida:', response.status, response.ok);
      
      if (!response.ok) {
        const data = await response.json();
        console.log('Erro da API:', data);
        throw new Error(data.error || 'Erro ao adicionar transação.');
      }

      const responseData = await response.json();
      console.log('✅ Transação salva com sucesso:', responseData);
      
      // Fechar modal primeiro
      onClose();
      
      // Aguardar um momento e depois atualizar
      setTimeout(() => {
        console.log('🔄 Chamando callback de atualização...');
        onTransactionAdded();
      }, 200);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      setError(`Erro: ${error.message}`);
    } finally {
      console.log('Finalizando submit do modal');
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

  // Debug: verificar se o modal está sendo renderizado
  console.log('Modal render - isOpen:', isOpen, 'type:', type, 'selectedMonth:', selectedMonth, 'selectedYear:', selectedYear);
  
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  formData.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {formData.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formData.type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa'}
                  </h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Valor (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Categoria e Data em linha */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Categoria
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none"
                      required
                    >
                      {categories[formData.type].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Observação */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Observação (opcional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                  placeholder="Ex: Aluguel do apartamento..."
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors text-sm ${
                    formData.type === 'income'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  }`}
                >
                  {loading ? 'Salvando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}