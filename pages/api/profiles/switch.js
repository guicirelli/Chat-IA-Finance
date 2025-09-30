import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ error: "ID do perfil é obrigatório" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempProfiles) {
      global.tempProfiles = {};
    }

    const profiles = global.tempProfiles[userId] || [];
    const targetProfile = profiles.find(p => p._id === profileId);

    if (!targetProfile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    // Atualizar todos os perfis para remover isDefault
    profiles.forEach(profile => {
      profile.isDefault = false;
      profile.updatedAt = new Date().toISOString();
    });

    // Definir o perfil selecionado como padrão
    targetProfile.isDefault = true;
    targetProfile.updatedAt = new Date().toISOString();

    return res.status(200).json({
      message: "Perfil ativo alterado com sucesso",
      activeProfile: targetProfile,
      profiles
    });

  } catch (error) {
    console.error("Erro ao alterar perfil ativo:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}