import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global separada por período se não existir
    if (!global.tempTransactionsByPeriod) {
      global.tempTransactionsByPeriod = {};
    }

    try {
      const { month = new Date().getMonth(), year = new Date().getFullYear() } = req.query;

      // CORRIGIDO: Usar a mesma chave que em /api/transactions/index.js
      const periodKey = `${userId}-${year}-${month}`;
      
      // Buscar transações específicas do período
      const transactions = global.tempTransactionsByPeriod[periodKey] || [];

      console.log(`Calculando resumo para período ${periodKey}:`, transactions.length, 'transações encontradas');
      console.log('Períodos disponíveis:', Object.keys(global.tempTransactionsByPeriod));
      console.log('Transações do período:', transactions);

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

      // Processa as transações com validação
      transactions.forEach(transaction => {
        // Normalizar tipo
        const type = String(transaction.type || '').toLowerCase().trim();
        if (type !== 'income' && type !== 'expense') {
          console.warn('Tipo inválido ignorado:', transaction.type);
          return; // Ignorar transações com tipo inválido
        }
        
        // Normalizar e validar valor
        let amount = 0;
        if (typeof transaction.amount === 'number' && Number.isFinite(transaction.amount)) {
          amount = Math.abs(transaction.amount); // Sempre positivo
        } else if (typeof transaction.amount === 'string') {
          const parsed = parseFloat(transaction.amount.replace(/[^\d.,-]/g, '').replace(',', '.'));
          amount = Number.isFinite(parsed) ? Math.abs(parsed) : 0;
        }
        
        if (amount === 0) {
          console.warn('Valor zero ou inválido ignorado:', transaction.amount);
          return; // Ignorar valores zero ou inválidos
        }
        
        const category = String(transaction.category || 'Outros').trim();
        const isFixed = Boolean(transaction.isFixed);
        
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