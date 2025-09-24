// API simplificada para teste - sem autenticação
export default async function handler(req, res) {
  try {
    // Inicializar array global se não existir
    if (!global.tempTransactions) {
      global.tempTransactions = [];
    }

    // ID temporário para teste
    const userId = 'temp-user';

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
            isFixed
          } = req.query;

          let tempTransactions = global.tempTransactions.filter(t => 
            t.userId === userId && 
            t.profileId === activeProfile._id
          );

          // Filtro por mês/ano
          if (month && year) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            tempTransactions = tempTransactions.filter(t => {
              const transactionDate = new Date(t.date);
              return transactionDate >= startDate && transactionDate <= endDate;
            });
          }

          // Filtros opcionais
          if (type) tempTransactions = tempTransactions.filter(t => t.type === type);
          if (category) tempTransactions = tempTransactions.filter(t => t.category === category);
          if (isFixed !== undefined) tempTransactions = tempTransactions.filter(t => t.isFixed === (isFixed === 'true'));

          // Ordenar por data
          tempTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          return res.status(200).json(tempTransactions.slice(0, 100));
        } catch (error) {
          console.error('Erro ao buscar transações:', error);
          return res.status(500).json({ error: "Erro ao buscar transações" });
        }

      case "POST":
        try {
          const { type, category, amount, date, note, isFixed } = req.body;

          console.log('Dados recebidos:', { type, category, amount, date, note, isFixed });

          // Validações básicas
          if (!type || !category || !amount || !date) {
            return res.status(400).json({ error: "Dados incompletos" });
          }

          const parsedAmount = parseFloat(amount);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: "Valor inválido" });
          }

          // Criar transação
          const transactionId = Date.now().toString();
          const transaction = {
            _id: transactionId,
            userId,
            profileId: activeProfile._id,
            type,
            category,
            amount: parsedAmount,
            date: new Date(date),
            note: note || '',
            isFixed: isFixed || false,
            createdAt: new Date()
          };

          global.tempTransactions.push(transaction);

          console.log('Transação criada:', transaction);

          // Se for despesa fixa, criar as próximas 11 transações automáticas
          if (isFixed && type === 'expense') {
            const baseDate = new Date(date);

            for (let i = 1; i <= 11; i++) {
              const nextDate = new Date(baseDate);
              nextDate.setMonth(baseDate.getMonth() + i);

              global.tempTransactions.push({
                _id: `${transactionId}-${i}`,
                userId,
                profileId: activeProfile._id,
                type,
                category,
                amount: parsedAmount,
                date: nextDate,
                note: note || '',
                isFixed: true,
                isAutomated: true,
                parentTransactionId: transactionId,
                createdAt: new Date()
              });
            }
          }

          return res.status(201).json(transaction);
        } catch (error) {
          console.error('Erro ao criar transação:', error);
          return res.status(500).json({ error: "Erro ao criar transação" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error('Erro geral na API:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}