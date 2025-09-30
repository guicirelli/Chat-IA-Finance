import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global separada por mês/ano se não existir
    if (!global.tempTransactionsByPeriod) {
      global.tempTransactionsByPeriod = {};
    }

    // Criar perfil temporário
    const activeProfile = { _id: 'temp-profile', userId };

    switch (req.method) {
      case "GET":
        try {
          const {
            month = new Date().getMonth(),
            year = new Date().getFullYear(),
            type,
            category,
            limit = 50,
            page = 1
          } = req.query;

          const periodKey = `${userId}-${year}-${month}`;
          let transactions = global.tempTransactionsByPeriod[periodKey] || [];

          // Aplicar filtros
          if (type) {
            transactions = transactions.filter(t => t.type === type);
          }
          if (category) {
            transactions = transactions.filter(t => t.category === category);
          }

          // Ordenar por data (mais recente primeiro)
          transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          // Paginação
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + parseInt(limit);
          const paginatedTransactions = transactions.slice(startIndex, endIndex);

          // Calcular estatísticas
          const totalTransactions = transactions.length;
          const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return res.status(200).json({
            transactions: paginatedTransactions,
            pagination: {
              currentPage: parseInt(page),
              totalPages: Math.ceil(totalTransactions / limit),
              totalItems: totalTransactions,
              itemsPerPage: parseInt(limit)
            },
            summary: {
              totalIncome,
              totalExpenses,
              balance: totalIncome - totalExpenses
            }
          });
        } catch (error) {
          console.error("Erro ao buscar transações:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "POST":
        try {
          const {
            type,
            category,
            amount,
            date,
            description,
            note,
            isFixed = false,
            tags = []
          } = req.body;

          console.log('Recebendo transação:', { type, category, amount, date, description, note });

          // Validações básicas
          if (!type || !category || !amount || !date) {
            return res.status(400).json({
              error: "Campos obrigatórios: type, category, amount, date"
            });
          }

          if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
              error: "Tipo deve ser 'income' ou 'expense'"
            });
          }

          if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
              error: "Valor deve ser um número positivo"
            });
          }

          const transactionDate = new Date(date);
          const month = transactionDate.getMonth();
          const year = transactionDate.getFullYear();
          const periodKey = `${userId}-${year}-${month}`;

          if (!global.tempTransactionsByPeriod[periodKey]) {
            global.tempTransactionsByPeriod[periodKey] = [];
          }

          const newTransaction = {
            _id: Date.now().toString(),
            userId,
            profileId: activeProfile._id,
            type,
            category,
            amount,
            date: transactionDate.toISOString(),
            description: description || note || '',
            note: note || description || '',
            isFixed,
            tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log('Criando nova transação:', newTransaction);

          global.tempTransactionsByPeriod[periodKey].push(newTransaction);

          console.log('Transações após adicionar:', global.tempTransactionsByPeriod[periodKey]);

          return res.status(201).json({
            message: "Transação criada com sucesso",
            transaction: newTransaction
          });
        } catch (error) {
          console.error("Erro ao criar transação:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de transações:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}