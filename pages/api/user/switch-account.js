import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Para trocar de conta, simplesmente redirecionamos para a página de login
    // O NextAuth irá limpar a sessão atual automaticamente
    return res.status(200).json({
      message: "Redirecionando para troca de conta",
      redirectTo: "/auth/signin"
    });
  } catch (error) {
    console.error("Erro ao trocar conta:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
