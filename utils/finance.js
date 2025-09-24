const STORAGE_KEYS = {
  transactions: "pfb_transactions",
  messages: "pfb_messages",
  reminders: "pfb_reminders",
};

export function isBrowser() {
  return typeof window !== "undefined";
}

export function loadTransactions() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.transactions);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

export function addExpense({ amount, category, date = new Date().toISOString(), note = "" }) {
  const txs = loadTransactions();
  txs.push({ type: "expense", amount: Number(amount) || 0, category, date, note });
  saveTransactions(txs);
  return txs;
}

export function addIncome({ amount, source = "Salário", date = new Date().toISOString(), note = "" }) {
  const txs = loadTransactions();
  txs.push({ type: "income", amount: Number(amount) || 0, category: source, date, note });
  saveTransactions(txs);
  return txs;
}

export function calculateTotalsByCategory(transactions) {
  const byCategory = {};
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    byCategory[tx.category] = (byCategory[tx.category] || 0) + Number(tx.amount || 0);
  }
  return byCategory;
}

export function generateChartData(transactions) {
  const totals = calculateTotalsByCategory(transactions);
  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const palette = [
    "#60a5fa", "#f87171", "#fbbf24", "#34d399", "#a78bfa", "#fb7185", "#22d3ee",
  ];
  return {
    labels,
    datasets: [
      {
        label: "Despesas",
        data: values,
        backgroundColor: values.map((_, i) => palette[i % palette.length]),
        borderWidth: 1,
      },
    ],
  };
}

export function summarizeBudget(transactions) {
  let income = 0;
  let expenses = 0;
  for (const tx of transactions) {
    if (tx.type === "income") income += Number(tx.amount || 0);
    if (tx.type === "expense") expenses += Number(tx.amount || 0);
  }
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) : 0;
  return { income, expenses, savings, savingsRate };
}

export function generateSavingsTips(transactions) {
  const tips = [];
  const totals = calculateTotalsByCategory(transactions);
  const { income, expenses, savingsRate } = summarizeBudget(transactions);

  if (income === 0 && expenses > 0) {
    tips.push("Você registrou despesas mas nenhuma receita. Considere registrar receitas para acompanhar melhor seu orçamento.");
  }

  const totalExpenses = Object.values(totals).reduce((a, b) => a + b, 0);
  if (totalExpenses > 0) {
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const [topCat, topVal] = entries[0];
    const topShare = topVal / totalExpenses;
    if (topShare > 0.3) {
      tips.push(`Sua maior despesa é em "${topCat}" (${(topShare * 100).toFixed(0)}%). Tente estabelecer um teto de gasto para esta categoria.`);
    }
  }

  if (savingsRate < 0.1) {
    tips.push("Sua taxa de poupança está abaixo de 10%. Considere automatizar uma transferência mensal para investimentos.");
  } else if (savingsRate >= 0.2) {
    tips.push("Excelente taxa de poupança! Considere diversificar entre renda fixa e ETFs.");
  }

  if (totals["Assinaturas"] && totals["Assinaturas"] > 0) {
    tips.push("Revise assinaturas mensais e cancele as que usa pouco.");
  }

  if (totals["Alimentação"] && totals["Alimentação"] > 0) {
    tips.push("Planeje refeições da semana para reduzir gastos com alimentação fora de casa.");
  }

  if (totals["Transporte"] && totals["Transporte"] > 0) {
    tips.push("Considere caronas ou transporte público para diminuir custos com transporte.");
  }

  return tips;
}

// Reminders
export function loadReminders() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.reminders);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReminders(reminders) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
}

export function addReminder({ description, dueDate }) {
  const list = loadReminders();
  list.push({ id: `${Date.now()}`, description, dueDate });
  saveReminders(list);
  return list;
}

export function getUpcomingReminders(daysAhead = 7) {
  const list = loadReminders();
  const now = new Date();
  const limit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return list.filter((r) => new Date(r.dueDate) <= limit);
}

export function getConversationHistory() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.messages);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversationHistory(messages) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
}
