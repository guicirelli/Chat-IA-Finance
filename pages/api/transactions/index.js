import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // CRÍTICO: Sempre inicializar estrutura global no Netlify
    // No serverless, cada requisição pode estar em um container diferente
    if (!global.tempTransactionsByPeriod) {
      global.tempTransactionsByPeriod = {};
      console.log('🔧 Inicializando global.tempTransactionsByPeriod');
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

          // CRÍTICO: Garantir que transactions é um array válido
          if (!Array.isArray(transactions)) {
            console.warn(`⚠️ Transactions não é array para ${periodKey}, inicializando...`);
            global.tempTransactionsByPeriod[periodKey] = [];
            transactions = [];
          }

          console.log(`📊 GET /api/transactions - periodKey: ${periodKey}, encontrado: ${transactions.length} transações`);

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

          // CRÍTICO: Headers para evitar cache no Netlify
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('X-Content-Type-Options', 'nosniff');

          console.log(`✅ GET /api/transactions - retornando ${paginatedTransactions.length} de ${transactions.length} transações`);
          
          return res.status(200).json(paginatedTransactions);
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

          console.log('✅ Criando nova transação:', newTransaction);
          console.log('📍 PeriodKey:', periodKey);

          global.tempTransactionsByPeriod[periodKey].push(newTransaction);

          console.log('✅ Transação salva! Total no período:', global.tempTransactionsByPeriod[periodKey].length);
          console.log('📊 Todas as transações do período:', global.tempTransactionsByPeriod[periodKey]);
          console.log('📍 Estado global após salvar:', {
            periodKey,
            totalTransactions: global.tempTransactionsByPeriod[periodKey].length,
            allPeriodKeys: Object.keys(global.tempTransactionsByPeriod)
          });

          // CRÍTICO: Headers para evitar cache no Netlify
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');

          return res.status(201).json({
            message: "Transação criada com sucesso",
            transaction: newTransaction,
            periodKey: periodKey,
            totalInPeriod: global.tempTransactionsByPeriod[periodKey].length
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