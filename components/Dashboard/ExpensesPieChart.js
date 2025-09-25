import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(59, 130, 246, 0.9)',   // Blue - mais vibrante
  'rgba(16, 185, 129, 0.9)',   // Green - mais vibrante
  'rgba(245, 158, 11, 0.9)',   // Yellow - mais vibrante
  'rgba(239, 68, 68, 0.9)',    // Red - mais vibrante
  'rgba(168, 85, 247, 0.9)',   // Purple - mais vibrante
  'rgba(236, 72, 153, 0.9)',   // Pink - mais vibrante
  'rgba(99, 102, 241, 0.9)',   // Indigo - mais vibrante
  'rgba(34, 197, 94, 0.9)',    // Emerald - mais vibrante
];

export default function ExpensesPieChart({ data }) {
  // Verificar se há dados de despesas
  const expenseCategories = data?.expenseCategories || {};
  const incomeCategories = data?.incomeCategories || {};
  const hasData = Object.keys(expenseCategories).length > 0 || Object.keys(incomeCategories).length > 0;
  
  // Calcular totais
  const totalIncome = data?.totalIncome || 0;
  const totalExpenses = data?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;
  
  // Calcular percentuais
  const incomePercentage = totalIncome > 0 ? (totalIncome / (totalIncome + totalExpenses)) * 100 : 0;
  const expensePercentage = totalExpenses > 0 ? (totalExpenses / (totalIncome + totalExpenses)) * 100 : 0;
  
  console.log('ExpensesPieChart - Dados recebidos:', data);
  console.log('ExpensesPieChart - Total Receitas:', totalIncome);
  console.log('ExpensesPieChart - Total Despesas:', totalExpenses);
  console.log('ExpensesPieChart - Saldo:', balance);

  // Criar dados do gráfico baseado em Receitas vs Despesas
  const chartData = hasData ? {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',   // Verde para receitas (sempre)
          'rgba(239, 68, 68, 0.9)'    // Vermelho para despesas (sempre)
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',     // Verde para receitas (sempre)
          'rgba(239, 68, 68, 1)'      // Vermelho para despesas (sempre)
        ],
        borderWidth: 2,
      },
    ],
  } : {
    labels: ['Sem dados'],
    datasets: [
      {
        data: [100],
        backgroundColor: ['rgba(209, 213, 219, 0.9)'],
        borderColor: 'transparent',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          },
          // Remover cor padrão para usar as cores específicas da generateLabels
          boxWidth: 12,
          boxHeight: 12,
          generateLabels: (chart) => {
            if (!hasData) {
              return [{
                text: 'Sem dados',
                fillStyle: 'rgba(209, 213, 219, 0.9)',
                strokeStyle: '#000000', // Contorno preto
                fontColor: '#6b7280', // Cor cinza para "Sem dados"
                pointStyle: 'circle',
                hidden: false,
                index: 0
              }];
            }
            return chart.data.datasets[0].data.map((value, index) => {
              // Definir cores específicas para cada tipo - cores muito escuras para contraste
              const isIncome = chart.data.labels[index] === 'Receitas';
              const textColor = isIncome ? '#064e3b' : '#7f1d1d'; // Verde muito escuro e vermelho muito escuro
              
              return {
                text: `${chart.data.labels[index]} (${((value / (totalIncome + totalExpenses)) * 100).toFixed(1)}%)`,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
                strokeStyle: chart.data.datasets[0].borderColor[index],
                fontColor: textColor,
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
            if (!hasData) {
              return 'Nenhum dado registrado';
            }
            const value = context.raw;
            const percentage = ((value / (totalIncome + totalExpenses)) * 100).toFixed(1);
            const label = context.label;
            const saldo = balance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo';
            return [
              `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              `${percentage}% do total`,
              `Status: ${saldo}`
            ];
          }
        }
      }
    }
  };

  // Criar uma chave única baseada nos dados para forçar re-renderização
  const chartKey = JSON.stringify(chartData);

  return (
    <div className="relative h-full">
      <style jsx>{`
        :global(canvas) {
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
        }
        :global(.chartjs-render-monitor) {
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
        }
        :global(.chartjs-legend) {
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
        }
        :global(.chartjs-legend li) {
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
        }
        :global(.chartjs-legend li span) {
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
        }
      `}</style>
      <Pie 
        key={chartKey}
        data={chartData} 
        options={options} 
      />
    </div>
  );
}
