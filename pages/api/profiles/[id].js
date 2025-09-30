import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import Profile from "../../../models/Profile";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  const userId = session.user.id;

  const { id } = req.query;
  await connectToDatabase();

  // Verifica se o perfil pertence ao usuário
  const profile = await Profile.findOne({ _id: id, userId });
  if (!profile) {
    return res.status(404).json({ error: "Perfil não encontrado" });
  }

  switch (req.method) {
    case "GET":
      return res.status(200).json(profile);

    case "PUT":
      try {
        const { name, nickname, photoUrl, isDefault, settings } = req.body;
        
        Object.assign(profile, {
          name,
          nickname,
          photoUrl,
          isDefault,
          settings,
          updatedAt: new Date()
        });

        await profile.save();
        return res.status(200).json(profile);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar perfil" });
      }

    case "DELETE":
      try {
        // Não permite deletar o perfil padrão se houver outros perfis
        if (profile.isDefault) {
          const otherProfiles = await Profile.countDocuments({ 
            userId, 
            _id: { $ne: id } 
          });
          
          if (otherProfiles > 0) {
            return res.status(400).json({ 
              error: "Não é possível excluir o perfil padrão. Defina outro perfil como padrão primeiro." 
            });
          }
        }

        await profile.deleteOne();
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: "Erro ao excluir perfil" });
      }

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
