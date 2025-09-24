import { getAuth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../../lib/db";
import Badge from "../../models/Badge";

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await connectToDatabase();

  if (req.method === "GET") {
    const items = await Badge.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const { code, name, description } = req.body || {};
    const item = await Badge.create({ userId, code, name, description });
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
