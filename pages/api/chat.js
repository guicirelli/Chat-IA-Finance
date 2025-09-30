import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { connectToDatabase } from "../../lib/db";
import Transaction from "../../models/Transaction";
import Goal from "../../models/Goal";
import Reminder from "../../models/Reminder";

// Sistema de respostas baseado em regras
function generateResponse(message, context, dbContext) {
  const { totalReceitas = 0, totalDespesas = 0, saldo = 0 } = context;
  const { tx = [], goals = [], reminders = [] } = dbContext;
  
  const lowerMessage = message.toLowerCase();
  
  // Respostas para consultas de saldo
  if (lowerMessage.includes('saldo') || lowerMessage.includes('quanto tenho')) {
    return `Seu saldo atual é R$ ${saldo.toFixed(2)}. Você tem R$ ${totalReceitas.toFixed(2)} em receitas e R$ ${totalDespesas.toFixed(2)} em despesas.`;
  }
  
  // Respostas para consultas de gastos
  if (lowerMessage.includes('gasto') || lowerMessage.includes('despesa')) {
    const totalGastos = tx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const gastosRecentes = tx.filter(t => t.type === 'expense').slice(0, 5);
    const gastosText = gastosRecentes.length > 0 
      ? `\n\nGastos recentes:\n${gastosRecentes.map(t => `• ${t.category}: R$ ${t.amount.toFixed(2)}`).join('\n')}`
      : '';
    return `Você gastou R$ ${totalGastos.toFixed(2)} no total.${gastosText}`;
  }
  
  // Respostas para consultas de receitas
  if (lowerMessage.includes('receita') || lowerMessage.includes('entrada')) {
    const totalReceitasDB = tx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const receitasRecentes = tx.filter(t => t.type === 'income').slice(0, 5);
    const receitasText = receitasRecentes.length > 0 
      ? `\n\nReceitas recentes:\n${receitasRecentes.map(t => `• ${t.category}: R$ ${t.amount.toFixed(2)}`).join('\n')}`
      : '';
    return `Suas receitas totalizam R$ ${totalReceitasDB.toFixed(2)}.${receitasText}`;
  }
  
  // Respostas para consultas de metas
  if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
    if (goals.length === 0) {
      return "Você ainda não tem metas definidas. Que tal criar uma nova meta financeira?";
    }
    
    const metasText = goals.map(g => {
      const progresso = (g.currentAmount / g.targetAmount * 100).toFixed(1);
      return `• ${g.name}: R$ ${g.currentAmount.toFixed(2)} / R$ ${g.targetAmount.toFixed(2)} (${progresso}%)`;
    }).join('\n');
    
    return `Suas metas financeiras:\n${metasText}`;
  }
  
  // Respostas para consultas de lembretes
  if (lowerMessage.includes('lembrete') || lowerMessage.includes('lembrar')) {
    const lembretesPendentes = reminders.filter(r => !r.done);
    if (lembretesPendentes.length === 0) {
      return "Você não tem lembretes pendentes no momento.";
    }
    
    const lembretesText = lembretesPendentes.map(r => {
      const data = new Date(r.dueDate).toLocaleDateString('pt-BR');
      return `• ${r.description} - ${data}`;
    }).join('\n');
    
    return `Lembretes pendentes:\n${lembretesText}`;
  }
  
  // Respostas para dicas de economia
  if (lowerMessage.includes('dica') || lowerMessage.includes('economizar') || lowerMessage.includes('poupar')) {
    const dicas = [
      "💡 Dica: Analise seus gastos mensais e identifique categorias onde pode reduzir despesas.",
      "💡 Dica: Estabeleça um orçamento mensal e tente não ultrapassá-lo.",
      "💡 Dica: Considere investir uma parte do seu dinheiro para fazê-lo render.",
      "💡 Dica: Evite compras por impulso - pense 24h antes de fazer uma compra grande.",
      "💡 Dica: Use o sistema de metas para se motivar a poupar para objetivos específicos."
    ];
    
    const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
    return dicaAleatoria;
  }
  
  // Resposta padrão
  return `Olá! Sou seu assistente financeiro. Posso ajudar você com informações sobre:
  
💰 Saldo e receitas
💸 Gastos e despesas  
🎯 Metas financeiras
⏰ Lembretes
💡 Dicas de economia

Como posso ajudar você hoje?`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { message, history = [], context = {} } = req.body || {};
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  let dbContext = {};
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.id) {
      const userId = session.user.id;
      await connectToDatabase();
      const [tx, goals, reminders] = await Promise.all([
        Transaction.find({ userId }).sort({ date: -1 }).limit(200),
        Goal.find({ userId }).sort({ createdAt: -1 }).limit(50),
        Reminder.find({ userId }).sort({ dueDate: 1 }).limit(50),
      ]);
      dbContext = { tx, goals, reminders };
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }

  const reply = generateResponse(message, context, dbContext);
  
  return res.status(200).json({ reply });
}
