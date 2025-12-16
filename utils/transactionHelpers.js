/**
 * Funções utilitárias para normalizar e processar transações
 * REGRA ANTI-BUG: Tipo manda na cor, nunca o valor
 */

// Constantes de tipos normalizados
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

/**
 * Normaliza o tipo de transação
 * @param {string} type - Tipo da transação (pode vir como 'income', 'expense', 'receita', 'despesa', etc)
 * @returns {string} - Tipo normalizado ('income' ou 'expense')
 */
export function normalizeType(type) {
  if (!type) return null;
  
  const normalized = String(type).toLowerCase().trim();
  
  // Mapeamento de variações para tipos padrão
  if (normalized === 'income' || normalized === 'receita' || normalized === 'receitas') {
    return TRANSACTION_TYPES.INCOME;
  }
  
  if (normalized === 'expense' || normalized === 'despesa' || normalized === 'despesas') {
    return TRANSACTION_TYPES.EXPENSE;
  }
  
  return null;
}

/**
 * Converte e valida valor numérico
 * @param {any} value - Valor a ser convertido
 * @returns {number} - Valor numérico válido (0 se inválido)
 */
export function normalizeAmount(value) {
  // Se já é número válido
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.abs(value); // Sempre positivo
  }
  
  // Tentar converter string para número
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'));
    if (Number.isFinite(parsed)) {
      return Math.abs(parsed);
    }
  }
  
  // Valor inválido retorna 0
  return 0;
}

/**
 * Determina a cor baseada no TIPO, nunca no valor
 * @param {string} type - Tipo normalizado da transação
 * @returns {object} - Objeto com cores para receita/despesa
 */
export function getColorByType(type) {
  const normalizedType = normalizeType(type);
  
  if (normalizedType === TRANSACTION_TYPES.INCOME) {
    return {
      bg: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-200',
      dark: {
        bg: 'dark:bg-green-900/20',
        text: 'dark:text-green-400',
        border: 'dark:border-green-800'
      },
      chart: {
        backgroundColor: 'rgba(34, 197, 94, 0.9)', // Verde
        borderColor: 'rgba(34, 197, 94, 1)'
      }
    };
  }
  
  if (normalizedType === TRANSACTION_TYPES.EXPENSE) {
    return {
      bg: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-200',
      dark: {
        bg: 'dark:bg-red-900/20',
        text: 'dark:text-red-400',
        border: 'dark:border-red-800'
      },
      chart: {
        backgroundColor: 'rgba(239, 68, 68, 0.9)', // Vermelho
        borderColor: 'rgba(239, 68, 68, 1)'
      }
    };
  }
  
  // Cor neutra para tipo inválido
  return {
    bg: 'bg-gray-500',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dark: {
      bg: 'dark:bg-gray-900/20',
      text: 'dark:text-gray-400',
      border: 'dark:border-gray-800'
    },
    chart: {
      backgroundColor: 'rgba(156, 163, 175, 0.9)',
      borderColor: 'rgba(156, 163, 175, 1)'
    }
  };
}

/**
 * Filtra transações por tipo normalizado
 * @param {Array} transactions - Array de transações
 * @param {string} type - Tipo a filtrar
 * @returns {Array} - Transações filtradas
 */
export function filterByType(transactions, type) {
  if (!Array.isArray(transactions)) return [];
  
  const normalizedType = normalizeType(type);
  if (!normalizedType) return [];
  
  return transactions.filter(t => normalizeType(t.type) === normalizedType);
}

/**
 * Calcula totais de receitas e despesas
 * @param {Array} transactions - Array de transações
 * @returns {object} - Objeto com totais calculados
 */
export function calculateTotals(transactions) {
  if (!Array.isArray(transactions)) {
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
    const type = normalizeType(transaction.type);
    const amount = normalizeAmount(transaction.amount);
    const category = String(transaction.category || 'Outros').trim();
    
    if (!type || amount === 0) return; // Ignorar transações inválidas
    
    if (type === TRANSACTION_TYPES.INCOME) {
      totalIncome += amount;
      incomeCategories[category] = (incomeCategories[category] || 0) + amount;
    } else if (type === TRANSACTION_TYPES.EXPENSE) {
      totalExpenses += amount;
      expenseCategories[category] = (expenseCategories[category] || 0) + amount;
    }
  });
  
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomeCategories,
    expenseCategories
  };
}

/**
 * Valida se uma transação tem dados válidos
 * @param {object} transaction - Transação a validar
 * @returns {boolean} - true se válida
 */
export function isValidTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') return false;
  
  const type = normalizeType(transaction.type);
  const amount = normalizeAmount(transaction.amount);
  
  return type !== null && amount > 0;
}

