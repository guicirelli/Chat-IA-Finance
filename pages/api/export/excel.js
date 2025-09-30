import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // Buscar transações do usuário
    const periodKey = `${userId}-${new Date().getFullYear()}-${new Date().getMonth()}`;
    const transactions = global.tempTransactionsByPeriod?.[periodKey] || [];

    const header = ["Data", "Tipo", "Categoria", "Valor", "Observação"]; 
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("pt-BR"),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      t.amount,
      t.description || "",
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map((c) => (typeof c === 'string' && c.includes(',') ? `"${c}"` : c)).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.csv");
    return res.status(200).send('\uFEFF' + csv);

  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}