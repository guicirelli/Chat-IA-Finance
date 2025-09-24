import { getAuth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../../../lib/db";
import Profile from "../../../models/Profile";

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  await connectToDatabase();

  switch (req.method) {
    case "GET":
      try {
        const profiles = await Profile.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json(profiles);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar perfis" });
      }

    case "POST":
      try {
        const { name, nickname, photoUrl } = req.body;
        
        // Verifica se é o primeiro perfil do usuário
        const existingProfiles = await Profile.countDocuments({ userId });
        const isDefault = existingProfiles === 0;

        const profile = await Profile.create({
          userId,
          name,
          nickname,
          photoUrl,
          isDefault
        });

        return res.status(201).json(profile);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao criar perfil" });
      }

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
