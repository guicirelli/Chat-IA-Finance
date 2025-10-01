import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ExpensesColumnChart({ data }) {
  // Verificar se há dados de despesas
  const expenseCategories = data?.expenseCategories || {};
  const hasData = Object.keys(expenseCategories).length > 0;
  
  // Converter para array e ordenar por valor (maior para menor)
  const sortedCategories = Object.entries(expenseCategories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const maxAmount = hasData ? Math.max(...sortedCategories.map(i => Number(i.amount) || 0)) : 0;

  console.log('ExpensesColumnChart - Dados recebidos:', data);
  console.log('ExpensesColumnChart - Categorias de despesas:', expenseCategories);
  console.log('ExpensesColumnChart - Categorias ordenadas:', sortedCategories);

  // Criar dados do gráfico
  const chartData = hasData ? {
    labels: sortedCategories.map(item => item.category),
    datasets: [{
      label: 'Valor (R$)',
      data: sortedCategories.map(item => item.amount),
      backgroundColor: 'rgba(239, 68, 68, 0.9)', // Vermelho sólido moderno
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 10,
      borderSkipped: false,
      categoryPercentage: 0.6,
      barPercentage: 0.7,
    }]
  } : {
    labels: ['Sem dados'],
    datasets: [{
      label: 'Valor (R$)',
      data: [0],
      backgroundColor: ['rgba(209, 213, 219, 0.3)'],
      borderColor: ['rgba(209, 213, 219, 0.5)'],
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Plugin customizado para exibir os valores acima das colunas
  const valueLabelsPlugin = {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      if (!hasData) return;
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 13px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial';
      dataset.data.forEach((rawValue, index) => {
        const element = meta.data[index];
        if (!element) return;
        const { x, y } = element.tooltipPosition();
        const displayValue = `R$ ${Number(rawValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        // Apenas texto branco com sombra sutil para contraste
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(displayValue, x, y - 8);
      });
      ctx.restore();
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 0.5,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const value = context.raw;
            return `Valor: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 8,
        left: 8,
        bottom: 0
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '600',
            family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial'
          },
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxAmount ? maxAmount * 1.15 : undefined,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '600',
            family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial'
          },
          callback: function(value) {
            return `R$ ${value.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="relative h-full">
      <style jsx>{`
        :global(.chartjs-render-monitor) {
          animation: none !important;
        }
      `}</style>
      <Bar data={chartData} options={options} plugins={[valueLabelsPlugin]} />
    </div>
  );
}
