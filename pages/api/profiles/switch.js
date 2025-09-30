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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { profileId } = req.body;
  if (!profileId) {
    return res.status(400).json({ error: "ID do perfil é obrigatório" });
  }

  await connectToDatabase();

  try {
    // Verifica se o perfil existe e pertence ao usuário
    const profile = await Profile.findOne({ _id: profileId, userId });
    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    // Remove o status de padrão de todos os outros perfis
    await Profile.updateMany(
      { userId, _id: { $ne: profileId } },
      { $set: { isDefault: false } }
    );

    // Define o perfil selecionado como padrão
    profile.isDefault = true;
    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao trocar de perfil" });
  }
}
