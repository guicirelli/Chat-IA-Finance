import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { connectToDatabase } from "../../../lib/db";
import Transaction from "../../../models/Transaction";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });
  const userId = session.user.id;
  await connectToDatabase();

  const items = await Transaction.find({ userId }).sort({ date: 1 });

  const header = ["Data", "Tipo", "Categoria", "Valor", "Observação"]; 
  const rows = items.map((t) => [
    new Date(t.date).toLocaleDateString("pt-BR"),
    t.type,
    t.category,
    t.amount,
    t.note || "",
  ]);

  const csv = [header, ...rows]
    .map((r) => r.map((c) => (typeof c === 'string' && c.includes(',') ? `"${c}"` : c)).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.csv");
  return res.status(200).send('\uFEFF' + csv);
}


