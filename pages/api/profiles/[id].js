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
      return res.status(400).json({ error: "ID do perfil é obrigatório" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempProfiles) {
      global.tempProfiles = {};
    }

    const profiles = global.tempProfiles[userId] || [];
    const profile = profiles.find(p => p._id === id);

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    switch (req.method) {
      case "GET":
        return res.status(200).json({ profile });

      case "PUT":
        try {
          const {
            name,
            nickname,
            settings
          } = req.body;

          // Validações básicas
          if (!name) {
            return res.status(400).json({
              error: "Nome é obrigatório"
            });
          }

          // Atualizar perfil
          const profileIndex = profiles.findIndex(p => p._id === id);
          if (profileIndex === -1) {
            return res.status(404).json({ error: "Perfil não encontrado" });
          }

          const updatedProfile = {
            ...profiles[profileIndex],
            ...(name && { name }),
            ...(nickname !== undefined && { nickname }),
            ...(settings && { settings }),
            updatedAt: new Date().toISOString()
          };

          global.tempProfiles[userId][profileIndex] = updatedProfile;

          return res.status(200).json({
            message: "Perfil atualizado com sucesso",
            profile: updatedProfile
          });
        } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "DELETE":
        try {
          const profileIndex = profiles.findIndex(p => p._id === id);
          if (profileIndex === -1) {
            return res.status(404).json({ error: "Perfil não encontrado" });
          }

          // Não permitir deletar o perfil padrão se for o único
          if (profiles[profileIndex].isDefault && profiles.length === 1) {
            return res.status(400).json({ 
              error: "Não é possível deletar o único perfil" 
            });
          }

          global.tempProfiles[userId].splice(profileIndex, 1);

          // Se deletou o perfil padrão, tornar o primeiro como padrão
          if (profiles[profileIndex].isDefault && global.tempProfiles[userId].length > 0) {
            global.tempProfiles[userId][0].isDefault = true;
          }

          return res.status(200).json({
            message: "Perfil excluído com sucesso"
          });
        } catch (error) {
          console.error("Erro ao excluir perfil:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de perfil individual:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}