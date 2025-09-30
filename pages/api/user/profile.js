import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    switch (req.method) {
      case "GET":
        try {
          // Retornar informações básicas do usuário (simuladas)
          const userProfile = {
            id: userId,
            name: 'Usuário Clerk',
            email: 'user@clerk.com',
            image: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          return res.status(200).json({ user: userProfile });
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "PATCH":
        try {
          const { name } = req.body;

          // Validações básicas
          if (!name || typeof name !== 'string') {
            return res.status(400).json({
              error: "Nome é obrigatório e deve ser uma string"
            });
          }

          // Simular atualização do perfil
          const updatedProfile = {
            id: userId,
            name: name.trim(),
            email: 'user@clerk.com',
            image: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          return res.status(200).json({
            message: "Perfil atualizado com sucesso",
            user: updatedProfile
          });
        } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de perfil do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}