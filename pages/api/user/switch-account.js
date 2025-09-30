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

    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: "ID da conta é obrigatório" });
    }

    // Simular troca de conta
    const result = {
      success: true,
      message: "Conta alterada com sucesso",
      currentAccountId: accountId,
      userId: userId
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error("Erro ao trocar conta:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}