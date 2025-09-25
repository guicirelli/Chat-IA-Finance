// API simplificada para teste - sem autenticação
export default async function handler(req, res) {
  try {
    // Inicializar estrutura global separada por mês/ano se não existir
    if (!global.tempTransactionsByPeriod) {
      global.tempTransactionsByPeriod = {};
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

          // Criar chave única para o período (mês/ano)
          const periodKey = `${year}-${month}`;
          
          // Buscar transações específicas do período
          let tempTransactions = global.tempTransactionsByPeriod[periodKey] || [];
          
          // Filtrar apenas transações do usuário e perfil ativo
          tempTransactions = tempTransactions.filter(t => 
            t.userId === userId && 
            t.profileId === activeProfile._id
          );

          // Filtros opcionais
          if (type) tempTransactions = tempTransactions.filter(t => t.type === type);
          if (category) tempTransactions = tempTransactions.filter(t => t.category === category);
          if (isFixed !== undefined) tempTransactions = tempTransactions.filter(t => t.isFixed === (isFixed === 'true'));

          // Ordenar por data
          tempTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          console.log(`Buscando transações para período ${periodKey}:`, tempTransactions.length, 'transações encontradas');

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

          // Determinar o período da transação baseado na data
          const transactionDate = new Date(date);
          const year = transactionDate.getFullYear();
          const month = transactionDate.getMonth();
          const periodKey = `${year}-${month}`;

          // Inicializar array do período se não existir
          if (!global.tempTransactionsByPeriod[periodKey]) {
            global.tempTransactionsByPeriod[periodKey] = [];
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
            date: transactionDate,
            note: note || '',
            isFixed: isFixed || false,
            createdAt: new Date(),
            periodKey // Adicionar chave do período para referência
          };

          // Armazenar no período específico
          global.tempTransactionsByPeriod[periodKey].push(transaction);

          console.log(`Transação criada no período ${periodKey}:`, transaction);
          console.log(`Total de transações no período ${periodKey}:`, global.tempTransactionsByPeriod[periodKey].length);

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