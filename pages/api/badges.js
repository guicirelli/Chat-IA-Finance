import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempBadges) {
      global.tempBadges = {};
    }

    switch (req.method) {
      case "GET":
        try {
          const badges = global.tempBadges[userId] || [];
          
          // Badges padrão se não houver nenhum
          if (badges.length === 0) {
            const defaultBadges = [
              {
                _id: 'welcome',
                userId,
                name: 'Bem-vindo',
                description: 'Primeiro acesso à plataforma',
                icon: '🎉',
                earnedAt: new Date().toISOString(),
                category: 'system'
              }
            ];
            
            global.tempBadges[userId] = defaultBadges;
            return res.status(200).json({ badges: defaultBadges });
          }
          
          return res.status(200).json({ badges });
        } catch (error) {
          console.error("Erro ao buscar badges:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "POST":
        try {
          const {
            name,
            description,
            icon,
            category = 'achievement'
          } = req.body;

          // Validações básicas
          if (!name || !description) {
            return res.status(400).json({
              error: "Nome e descrição são obrigatórios"
            });
          }

          const newBadge = {
            _id: Date.now().toString(),
            userId,
            name,
            description,
            icon: icon || '🏆',
            category,
            earnedAt: new Date().toISOString()
          };

          if (!global.tempBadges[userId]) {
            global.tempBadges[userId] = [];
          }

          global.tempBadges[userId].push(newBadge);

          return res.status(201).json({
            message: "Badge criado com sucesso",
            badge: newBadge
          });
        } catch (error) {
          console.error("Erro ao criar badge:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de badges:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}