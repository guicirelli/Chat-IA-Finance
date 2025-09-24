import { getAuth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../../lib/db";
import Reminder from "../../models/Reminder";

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await connectToDatabase();

  if (req.method === "GET") {
    const items = await Reminder.find({ userId }).sort({ dueDate: 1 });
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const { description, dueDate } = req.body || {};
    const item = await Reminder.create({ userId, description, dueDate });
    return res.status(201).json(item);
  }

  if (req.method === "PATCH") {
    const { id, ...updates } = req.body || {};
    const item = await Reminder.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    return res.status(200).json(item);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Reminder.deleteOne({ _id: id, userId });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
