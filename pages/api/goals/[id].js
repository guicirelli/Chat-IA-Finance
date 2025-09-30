import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import Goal from "../../../models/Goal";
import Profile from "../../../models/Profile";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const userId = session.user.id;

  await connectToDatabase();
  const { id } = req.query;

  // Busca o perfil ativo do usuário
  const activeProfile = await Profile.findOne({ userId, isDefault: true });
  if (!activeProfile) {
    return res.status(400).json({ error: "Nenhum perfil ativo encontrado" });
  }

  switch (req.method) {
    case "PATCH":
      try {
        const { name, targetAmount, currentAmount, targetDate } = req.body;
        const updates = { name, targetAmount, currentAmount, targetDate };

        // Remove campos undefined
        Object.keys(updates).forEach(key => 
          updates[key] === undefined && delete updates[key]
        );

        if (targetDate) {
          updates.targetDate = new Date(targetDate);
        }

        const goal = await Goal.findOneAndUpdate(
          { _id: id, userId, profileId: activeProfile._id },
          updates,
          { new: true }
        );

        if (!goal) {
          return res.status(404).json({ error: "Meta não encontrada" });
        }

        return res.status(200).json(goal);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar meta" });
      }

    case "DELETE":
      try {
        const goal = await Goal.findOneAndDelete({
          _id: id,
          userId,
          profileId: activeProfile._id
        });

        if (!goal) {
          return res.status(404).json({ error: "Meta não encontrada" });
        }

        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: "Erro ao excluir meta" });
      }

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
