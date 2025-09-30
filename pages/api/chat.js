import { getAuth } from "@clerk/nextjs/server";

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
  if (lowerMessage.includes('gastos') || lowerMessage.includes('despesas')) {
    const topCategory = tx.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});
    
    const topCategoryName = Object.keys(topCategory).reduce((a, b) => 
      topCategory[a] > topCategory[b] ? a : b, '');
    
    return `Suas despesas totalizam R$ ${totalDespesas.toFixed(2)}. Sua categoria com maior gasto é ${topCategoryName} com R$ ${topCategory[topCategoryName]?.toFixed(2) || 0}.`;
  }
  
  // Respostas para consultas de metas
  if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
    if (goals.length === 0) {
      return `Você ainda não tem metas definidas. Que tal criar uma meta financeira para começar?`;
    }
    
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length === 0) {
      return `Você não tem metas ativas no momento.`;
    }
    
    return `Você tem ${activeGoals.length} meta(s) ativa(s). ${activeGoals.map(g => 
      `${g.title}: R$ ${g.currentAmount.toFixed(2)} de R$ ${g.targetAmount.toFixed(2)} (${((g.currentAmount/g.targetAmount)*100).toFixed(1)}%)`
    ).join(', ')}.`;
  }
  
  // Respostas para consultas de lembretes
  if (lowerMessage.includes('lembrete') || lowerMessage.includes('lembrar')) {
    if (reminders.length === 0) {
      return `Você não tem lembretes configurados.`;
    }
    
    return `Você tem ${reminders.length} lembrete(s) ativo(s). ${reminders.map(r => 
      `${r.title} - ${new Date(r.date).toLocaleDateString('pt-BR')}`
    ).join(', ')}.`;
  }
  
  // Respostas para consultas de economia
  if (lowerMessage.includes('economia') || lowerMessage.includes('economizar')) {
    const savingsRate = totalReceitas > 0 ? ((saldo / totalReceitas) * 100) : 0;
    return `Sua taxa de economia é de ${savingsRate.toFixed(1)}%. Você está economizando R$ ${saldo.toFixed(2)} de suas receitas totais de R$ ${totalReceitas.toFixed(2)}.`;
  }
  
  // Respostas para consultas de análise
  if (lowerMessage.includes('análise') || lowerMessage.includes('analise') || lowerMessage.includes('relatório')) {
    return `Aqui está uma análise rápida: Você tem R$ ${totalReceitas.toFixed(2)} em receitas e R$ ${totalDespesas.toFixed(2)} em despesas, resultando em um saldo de R$ ${saldo.toFixed(2)}. ${saldo > 0 ? 'Parabéns! Você está com saldo positivo.' : 'Atenção: Você está com saldo negativo.'}`;
  }
  
  // Resposta padrão
  return `Olá! Sou seu assistente financeiro. Posso ajudar você com informações sobre saldo, gastos, metas, lembretes e análises financeiras. O que você gostaria de saber?`;
}

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

    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Buscar dados do usuário (simulados)
    const periodKey = `${userId}-${new Date().getFullYear()}-${new Date().getMonth()}`;
    const transactions = global.tempTransactionsByPeriod?.[periodKey] || [];
    const goals = global.tempGoals?.[userId] || [];
    const reminders = global.tempReminders?.[userId] || [];

    // Calcular contexto financeiro
    const totalReceitas = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDespesas = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const saldo = totalReceitas - totalDespesas;

    const context = {
      totalReceitas,
      totalDespesas,
      saldo
    };

    const dbContext = {
      tx: transactions,
      goals,
      reminders
    };

    // Gerar resposta
    const response = generateResponse(message, context, dbContext);

    // Salvar conversa (opcional)
    if (!global.tempChatHistory) {
      global.tempChatHistory = {};
    }
    
    if (!global.tempChatHistory[userId]) {
      global.tempChatHistory[userId] = [];
    }

    const chatEntry = {
      id: Date.now().toString(),
      message,
      response,
      timestamp: new Date().toISOString()
    };

    global.tempChatHistory[userId].push(chatEntry);

    // Manter apenas os últimos 50 registros
    if (global.tempChatHistory[userId].length > 50) {
      global.tempChatHistory[userId] = global.tempChatHistory[userId].slice(-50);
    }

    return res.status(200).json({
      response,
      context: {
        saldo: saldo.toFixed(2),
        totalReceitas: totalReceitas.toFixed(2),
        totalDespesas: totalDespesas.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Erro no chat:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      response: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.'
    });
  }
}