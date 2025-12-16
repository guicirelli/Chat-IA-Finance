import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { normalizeType, normalizeAmount, TRANSACTION_TYPES } from '../utils/transactionHelpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [txRes, gRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/goals"),
        ]);
        if (txRes.ok) setTransactions(await txRes.json());
        if (gRes.ok) setGoals(await gRes.json());
      } catch {}
    })();
  }, []);

  // CORES FIXAS
  const INCOME_COLOR = "#22c55e";  // Verde - SEMPRE para receitas
  const EXPENSE_COLOR = "#ef4444"; // Vermelho - SEMPRE para despesas
  const BALANCE_COLOR = "#3b82f6"; // Azul - para saldo

  const summary = useMemo(() => {
    let income = 0, expenses = 0;
    for (const t of transactions) {
      const type = normalizeType(t.type);
      const amount = normalizeAmount(t.amount);
      if (type === TRANSACTION_TYPES.INCOME) income += amount;
      if (type === TRANSACTION_TYPES.EXPENSE) expenses += amount;
    }
    return { income, expenses, savings: income - expenses };
  }, [transactions]);

  const monthlySeries = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const current = map.get(key) || { income: 0, expense: 0 };
      const type = normalizeType(t.type);
      const amount = normalizeAmount(t.amount);
      if (type === TRANSACTION_TYPES.INCOME) current.income += amount;
      if (type === TRANSACTION_TYPES.EXPENSE) current.expense += amount;
      map.set(key, current);
    }
    const labels = Array.from(map.keys()).sort();
    const incomes = labels.map((k) => map.get(k).income);
    const expenses = labels.map((k) => map.get(k).expense);
    const balance = labels.map((_, i) => incomes[i] - expenses[i]);
    return { labels, incomes, expenses, balance };
  }, [transactions]);

  // CORES FIXAS
  const INCOME_COLOR = "#22c55e";  // Verde - SEMPRE para receitas
  const EXPENSE_COLOR = "#ef4444"; // Vermelho - SEMPRE para despesas
  const BALANCE_COLOR = "#3b82f6"; // Azul - para saldo

  const data = useMemo(() => {
    return {
      labels: monthlySeries.labels,
      datasets: [
        { 
          label: "Income", 
          data: monthlySeries.incomes, 
          borderColor: INCOME_COLOR,   // VERDE FIXO
          backgroundColor: `${INCOME_COLOR}33` 
        },
        { 
          label: "Expenses", 
          data: monthlySeries.expenses, 
          borderColor: EXPENSE_COLOR,   // VERMELHO FIXO
          backgroundColor: `${EXPENSE_COLOR}33` 
        },
        { 
          label: "Saldo", 
          data: monthlySeries.balance, 
          borderColor: BALANCE_COLOR, 
          backgroundColor: `${BALANCE_COLOR}33` 
        },
      ],
    };
  }, [monthlySeries]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-xs text-gray-500">Income</p>
          <p className="text-xl font-semibold">${summary.income.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-xs text-gray-500">Expenses</p>
          <p className="text-xl font-semibold">${summary.expenses.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-xs text-gray-500">Saldo</p>
          <p className="text-xl font-semibold">R$ {summary.savings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Image
              src="/images/Robo-grafico.png"
              alt="Gráfico"
              width={20}
              height={20}
              className="rounded"
            />
            <span>Evolução Mensal</span>
          </h3>
        </div>
        <div className="p-6">
          <Line data={data} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>

      {goals.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-sm font-semibold mb-2">Metas</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {goals.map((g) => {
              const progress = g.targetAmount > 0 ? (100 * (g.currentAmount || 0) / g.targetAmount) : 0;
              return (
                <li key={g._id} className="flex items-center gap-2">
                  <span className="min-w-[120px] font-medium">{g.name}</span>
                  <div className="w-full bg-gray-100 rounded h-2">
                    <div className="bg-blue-600 h-2 rounded" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{progress.toFixed(0)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
