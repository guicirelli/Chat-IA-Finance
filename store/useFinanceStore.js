import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // Estado do usuário
      user: null,
      theme: 'light',
      
      // Transações
      transactions: [],
      categories: [
        { id: 'alimentacao', name: 'Alimentação', icon: '🍽️', color: '#10B981' },
        { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#3B82F6' },
        { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#8B5CF6' },
        { id: 'lazer', name: 'Lazer', icon: '🎮', color: '#F59E0B' },
        { id: 'saude', name: 'Saúde', icon: '🏥', color: '#EF4444' },
        { id: 'educacao', name: 'Educação', icon: '📚', color: '#06B6D4' },
        { id: 'assinaturas', name: 'Assinaturas', icon: '📱', color: '#84CC16' },
        { id: 'investimentos', name: 'Investimentos', icon: '📈', color: '#F97316' },
        { id: 'outros', name: 'Outros', icon: '📦', color: '#6B7280' },
      ],
      
      // Investimentos
      investments: [],
      portfolio: {
        totalValue: 0,
        dailyChange: 0,
        monthlyReturn: 0,
      },
      
      // Metas
      goals: [],
      badges: [],
      
      // Métricas
      metrics: {
        totalIncome: 0,
        totalExpenses: 0,
        savingsRate: 0,
        monthlyBudget: 0,
        emergencyFund: 0,
      },
      
      // Ações
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, { ...transaction, id: Date.now() }]
      })),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, { ...investment, id: Date.now() }]
      })),
      
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now() }]
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => 
          g.id === id ? { ...g, ...updates } : g
        )
      })),
      
      addBadge: (badge) => set((state) => ({
        badges: [...state.badges, { ...badge, id: Date.now() }]
      })),
      
      // Computed values
      getTransactionsByType: (type) => {
        const { transactions } = get();
        return transactions.filter(t => t.type === type);
      },
      
      getTransactionsByCategory: (category) => {
        const { transactions } = get();
        return transactions.filter(t => t.category === category);
      },
      
      getMonthlyTransactions: (year, month) => {
        const { transactions } = get();
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });
      },
      
      calculateMetrics: () => {
        const { transactions } = get();
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const savings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
        
        set({
          metrics: {
            totalIncome,
            totalExpenses,
            savings,
            savingsRate,
            monthlyBudget: totalIncome * 0.8, // 80% da renda como orçamento
            emergencyFund: totalIncome * 6, // 6 meses de renda
          }
        });
      },
    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        investments: state.investments,
        goals: state.goals,
        badges: state.badges,
        theme: state.theme,
      }),
      skipHydration: true,
    }
  )
);
