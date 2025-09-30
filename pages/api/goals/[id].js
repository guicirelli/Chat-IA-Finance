import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID da meta é obrigatório" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempGoals) {
      global.tempGoals = {};
    }

    const goals = global.tempGoals[userId] || [];
    const goal = goals.find(g => g._id === id);

    if (!goal) {
      return res.status(404).json({ error: "Meta não encontrada" });
    }

    switch (req.method) {
      case "GET":
        return res.status(200).json({ goal });

      case "PUT":
        try {
          const {
            title,
            targetAmount,
            currentAmount,
            startDate,
            endDate,
            category,
            description,
            status
          } = req.body;

          // Validações básicas
          if (targetAmount && (typeof targetAmount !== 'number' || targetAmount <= 0)) {
            return res.status(400).json({
              error: "Valor da meta deve ser um número positivo"
            });
          }

          // Atualizar meta
          const goalIndex = goals.findIndex(g => g._id === id);
          if (goalIndex === -1) {
            return res.status(404).json({ error: "Meta não encontrada" });
          }

          const updatedGoal = {
            ...goals[goalIndex],
            ...(title && { title }),
            ...(targetAmount && { targetAmount }),
            ...(currentAmount !== undefined && { currentAmount }),
            ...(startDate && { startDate: new Date(startDate).toISOString() }),
            ...(endDate && { endDate: new Date(endDate).toISOString() }),
            ...(category !== undefined && { category }),
            ...(description !== undefined && { description }),
            ...(status && { status }),
            updatedAt: new Date().toISOString()
          };

          global.tempGoals[userId][goalIndex] = updatedGoal;

          return res.status(200).json({
            message: "Meta atualizada com sucesso",
            goal: updatedGoal
          });
        } catch (error) {
          console.error("Erro ao atualizar meta:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "DELETE":
        try {
          const goalIndex = goals.findIndex(g => g._id === id);
          if (goalIndex === -1) {
            return res.status(404).json({ error: "Meta não encontrada" });
          }

          global.tempGoals[userId].splice(goalIndex, 1);

          return res.status(200).json({
            message: "Meta excluída com sucesso"
          });
        } catch (error) {
          console.error("Erro ao excluir meta:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de meta individual:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}