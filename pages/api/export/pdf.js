import { getAuth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../../../lib/db";
import Transaction from "../../../models/Transaction";

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await connectToDatabase();

  const items = await Transaction.find({ userId }).sort({ date: 1 });

  // Geração simples em PDF como texto (evita dependências pesadas);
  // Pode ser trocado por pdfkit/reportlab em outro serviço.
  const lines = [
    "Relatório Financeiro",
    "",
    "Data | Tipo | Categoria | Valor | Observação",
    ...items.map((t) => `${new Date(t.date).toLocaleDateString('pt-BR')} | ${t.type} | ${t.category} | R$ ${t.amount.toFixed(2)} | ${t.note || ''}`)
  ].join("\n");

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.txt");
  return res.status(200).send(lines);
}


