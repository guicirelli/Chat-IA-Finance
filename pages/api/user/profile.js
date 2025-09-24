import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const { name, image } = req.body;

    if (req.method === "GET") {
      // Retornar dados do perfil atual
      return res.status(200).json({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || '',
      });
    }

    if (req.method === "PATCH") {
      // Atualizar perfil
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      try {
        await connectToDatabase();
        
        // Atualizar no banco de dados
        const updatedUser = await User.findByIdAndUpdate(
          session.user.id,
          { name: name.trim(), image: image || '' },
          { new: true }
        );

        if (updatedUser) {
          return res.status(200).json({
            message: "Perfil atualizado com sucesso",
            user: {
              id: updatedUser._id,
              name: updatedUser.name,
              email: updatedUser.email,
              image: updatedUser.image,
            },
          });
        } else {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
      } catch (dbError) {
        console.warn('Banco de dados não disponível, atualizando em memória:', dbError.message);
        
        // Fallback: atualizar em memória
        if (global.tempUsers) {
          const userIndex = global.tempUsers.findIndex(u => u.id === session.user.id);
          if (userIndex !== -1) {
            global.tempUsers[userIndex].name = name.trim();
            global.tempUsers[userIndex].image = image || '';
            
            return res.status(200).json({
              message: "Perfil atualizado com sucesso (modo temporário)",
              user: {
                id: global.tempUsers[userIndex].id,
                name: global.tempUsers[userIndex].name,
                email: global.tempUsers[userIndex].email,
                image: global.tempUsers[userIndex].image,
              },
            });
          }
        }
        
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
