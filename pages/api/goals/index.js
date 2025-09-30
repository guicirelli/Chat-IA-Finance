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

  // Busca o perfil ativo do usuário
  const activeProfile = await Profile.findOne({ userId, isDefault: true });
  if (!activeProfile) {
    return res.status(400).json({ error: "Nenhum perfil ativo encontrado" });
  }

  switch (req.method) {
    case "GET":
      try {
        const goals = await Goal.find({ userId, profileId: activeProfile._id })
          .sort({ createdAt: -1 });

        return res.status(200).json(goals);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar metas" });
      }

    case "POST":
      try {
        const { name, targetAmount, targetDate, currentAmount = 0 } = req.body;

        // Validações básicas
        if (!name || !targetAmount || !targetDate) {
          return res.status(400).json({ error: "Dados incompletos" });
        }

        // Cria a meta
        const goal = await Goal.create({
          userId,
          profileId: activeProfile._id,
          name,
          targetAmount,
          currentAmount,
          targetDate: new Date(targetDate)
        });

        return res.status(201).json(goal);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao criar meta" });
      }

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
