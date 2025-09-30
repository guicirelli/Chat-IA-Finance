import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempProfiles) {
      global.tempProfiles = {};
    }

    switch (req.method) {
      case "GET":
        try {
          let profiles = global.tempProfiles[userId] || [];
          
          // Se não há perfis, criar um padrão
          if (profiles.length === 0) {
            const defaultProfile = {
              _id: 'temp-profile',
              userId,
              name: 'Perfil Principal',
              nickname: 'Principal',
              isDefault: true,
              settings: {
                currency: 'BRL',
                theme: 'light',
                notifications: {
                  email: true,
                  push: true
                }
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            profiles = [defaultProfile];
            global.tempProfiles[userId] = profiles;
          }

          const activeProfile = profiles.find(p => p.isDefault) || profiles[0];
          
          return res.status(200).json({
            profiles,
            activeProfile,
            total: profiles.length
          });
        } catch (error) {
          console.error("Erro ao buscar perfis:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "POST":
        try {
          const {
            name,
            nickname,
            settings = {
              currency: 'BRL',
              theme: 'light',
              notifications: {
                email: true,
                push: true
              }
            }
          } = req.body;

          // Validações básicas
          if (!name) {
            return res.status(400).json({
              error: "Nome é obrigatório"
            });
          }

          const newProfile = {
            _id: Date.now().toString(),
            userId,
            name,
            nickname: nickname || '',
            isDefault: false,
            settings,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (!global.tempProfiles[userId]) {
            global.tempProfiles[userId] = [];
          }

          global.tempProfiles[userId].push(newProfile);

          return res.status(201).json({
            message: "Perfil criado com sucesso",
            profile: newProfile
          });
        } catch (error) {
          console.error("Erro ao criar perfil:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de perfis:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}