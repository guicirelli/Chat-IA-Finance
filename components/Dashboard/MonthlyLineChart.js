import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { normalizeAmount } from '../../utils/transactionHelpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// CORES FIXAS PARA LINHAS
const INCOME_LINE_COLOR = 'rgb(34, 197, 94)';      // Verde - SEMPRE para receitas
const INCOME_FILL_COLOR = 'rgba(34, 197, 94, 0.1)'; // Verde claro - SEMPRE para receitas
const EXPENSE_LINE_COLOR = 'rgb(239, 68, 68)';     // Vermelho - SEMPRE para despesas
const EXPENSE_FILL_COLOR = 'rgba(239, 68, 68, 0.1)'; // Vermelho claro - SEMPRE para despesas

export default function MonthlyLineChart({ data }) {
  const months = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('en-US', { month: 'short' });
    });
  }, []);

  // Normalizar dados com useMemo
  const normalizedData = useMemo(() => {
    const incomeHistory = (data?.incomeHistory || Array(6).fill(0)).map(val => normalizeAmount(val));
    const expenseHistory = (data?.expenseHistory || Array(6).fill(0)).map(val => normalizeAmount(val));
    
    return {
      incomeHistory,
      expenseHistory
    };
  }, [data?.incomeHistory, data?.expenseHistory]);

  const chartData = useMemo(() => {
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: normalizedData.incomeHistory,
          borderColor: INCOME_LINE_COLOR,      // VERDE FIXO
          backgroundColor: INCOME_FILL_COLOR,  // VERDE FIXO
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: normalizedData.expenseHistory,
          borderColor: EXPENSE_LINE_COLOR,     // VERMELHO FIXO
          backgroundColor: EXPENSE_FILL_COLOR, // VERMELHO FIXO
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [months, normalizedData]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Desabilitar animação para atualização rápida
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            },
            // Garantir cores corretas na legenda
            generateLabels: (chart) => {
              return chart.data.datasets.map((dataset, index) => {
                const isIncome = dataset.label === 'Income';
                return {
                  text: dataset.label,
                  fillStyle: isIncome ? INCOME_LINE_COLOR : EXPENSE_LINE_COLOR,
                  strokeStyle: isIncome ? INCOME_LINE_COLOR : EXPENSE_LINE_COLOR,
                  fontColor: '#6b7280',
                  pointStyle: 'circle',
                  hidden: false,
                  index: index
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = normalizeAmount(context.raw);
              return `${context.dataset.label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${normalizeAmount(value).toLocaleString('en-US')}`,
          },
        },
      },
    };
  }, []);

  // Chave única para forçar re-renderização
  const chartKey = useMemo(() => {
    const incomeSum = normalizedData.incomeHistory.reduce((a, b) => a + b, 0);
    const expenseSum = normalizedData.expenseHistory.reduce((a, b) => a + b, 0);
    return `line-${incomeSum.toFixed(2)}-${expenseSum.toFixed(2)}`;
  }, [normalizedData]);

  return (
    <div className="relative h-full">
      <Line 
        key={chartKey}
        data={chartData} 
        options={options}
        redraw={true}
      />
    </div>
  );
}
