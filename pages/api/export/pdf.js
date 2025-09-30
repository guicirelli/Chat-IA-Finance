import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import Transaction from "../../../models/Transaction";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const userId = session.user.id;
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


