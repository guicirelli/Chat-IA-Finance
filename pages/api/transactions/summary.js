// API simplificada para teste - sem autenticação
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Inicializar array global se não existir
    if (!global.tempTransactions) {
      global.tempTransactions = [];
    }

    // ID temporário para teste
    const userId = 'temp-user';
    const activeProfile = { _id: 'temp-profile', userId };

    try {
      const { month = new Date().getMonth(), year = new Date().getFullYear() } = req.query;

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // Buscar transações em memória
      const transactions = global.tempTransactions.filter(t => 
        t.userId === userId && 
        t.profileId === activeProfile._id &&
        new Date(t.date) >= startDate && 
        new Date(t.date) <= endDate
      );

      // Calcula totais
      const summary = {
        income: {
          total: 0,
          byCategory: {}
        },
        expense: {
          total: 0,
          byCategory: {}
        },
        balance: 0,
        fixedExpenses: 0,
        variableExpenses: 0,
        totalIncome: 0,
        totalExpenses: 0,
        incomeCategories: {},
        expenseCategories: {}
      };

      // Processa as transações
      transactions.forEach(transaction => {
        const { type, amount, category, isFixed } = transaction;
        
        // Atualiza totais por tipo
        summary[type].total += amount;
        
        // Atualiza totais por categoria
        if (!summary[type].byCategory[category]) {
          summary[type].byCategory[category] = 0;
        }
        summary[type].byCategory[category] += amount;

        // Atualiza totais de despesas fixas/variáveis
        if (type === 'expense') {
          if (isFixed) {
            summary.fixedExpenses += amount;
          } else {
            summary.variableExpenses += amount;
          }
        }
      });

      // Calcula saldo
      summary.balance = summary.income.total - summary.expense.total;
      summary.totalIncome = summary.income.total;
      summary.totalExpenses = summary.expense.total;
      summary.incomeCategories = summary.income.byCategory;
      summary.expenseCategories = summary.expense.byCategory;

      return res.status(200).json(summary);
    } catch (error) {
      console.error("Erro ao calcular resumo:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } catch (error) {
    console.error('Erro geral na API de summary:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}