import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Inicializar estrutura global se não existir
    if (!global.tempReminders) {
      global.tempReminders = {};
    }

    switch (req.method) {
      case "GET":
        try {
          const reminders = global.tempReminders[userId] || [];
          
          return res.status(200).json({
            reminders,
            total: reminders.length,
            active: reminders.filter(r => r.isActive).length,
            completed: reminders.filter(r => !r.isActive).length
          });
        } catch (error) {
          console.error("Erro ao buscar lembretes:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      case "POST":
        try {
          const {
            title,
            description,
            date,
            type = 'reminder',
            isActive = true
          } = req.body;

          // Validações básicas
          if (!title || !date) {
            return res.status(400).json({
              error: "Título e data são obrigatórios"
            });
          }

          const newReminder = {
            _id: Date.now().toString(),
            userId,
            profileId: 'temp-profile',
            title,
            description: description || '',
            date: new Date(date).toISOString(),
            type,
            isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (!global.tempReminders[userId]) {
            global.tempReminders[userId] = [];
          }

          global.tempReminders[userId].push(newReminder);

          return res.status(201).json({
            message: "Lembrete criado com sucesso",
            reminder: newReminder
          });
        } catch (error) {
          console.error("Erro ao criar lembrete:", error);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de lembretes:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}