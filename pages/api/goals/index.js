import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempGoals) {
      global.tempGoals = {};
    }

    switch (req.method) {
      case "GET":
        try {
          const goals = global.tempGoals[userId] || [];
          
          return res.status(200).json({
            goals,
            total: goals.length,
            active: goals.filter(g => g.status === 'active').length,
            completed: goals.filter(g => g.status === 'completed').length
          });
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "POST":
        try {
          const {
            title,
            targetAmount,
            currentAmount = 0,
            startDate,
            endDate,
            category,
            description
          } = req.body;

          // Validações básicas
          if (!title || !targetAmount || !startDate || !endDate) {
            return res.status(400).json({
              error: "Campos obrigatórios: title, targetAmount, startDate, endDate"
            });
          }

          if (typeof targetAmount !== 'number' || targetAmount <= 0) {
            return res.status(400).json({
              error: "Valor da meta deve ser um número positivo"
            });
          }

          const newGoal = {
            _id: Date.now().toString(),
            userId,
            profileId: 'temp-profile',
            title,
            targetAmount,
            currentAmount,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            category: category || '',
            status: 'active',
            description: description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (!global.tempGoals[userId]) {
            global.tempGoals[userId] = [];
          }

          global.tempGoals[userId].push(newGoal);

          return res.status(201).json({
            message: "Meta criada com sucesso",
            goal: newGoal
          });
        } catch (error) {
          console.error("Erro ao criar meta:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de metas:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}