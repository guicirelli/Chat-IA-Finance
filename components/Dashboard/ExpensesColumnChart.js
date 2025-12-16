import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useMemo } from 'react';
import { normalizeAmount } from '../../utils/transactionHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// COR FIXA PARA DESPESAS - SEMPRE VERMELHO
const EXPENSE_BAR_COLOR = 'rgba(239, 68, 68, 0.9)'; // Vermelho - FIXO

export default function ExpensesColumnChart({ data }) {
  // Processar dados com useMemo para evitar recálculos
  const processedData = useMemo(() => {
    const expenseCategories = data?.expenseCategories || {};
    const hasData = Object.keys(expenseCategories).length > 0;
    
    // Converter para array, normalizar valores e ordenar por valor (maior para menor)
    const sortedCategories = Object.entries(expenseCategories)
      .map(([category, amount]) => ({ 
        category: String(category || 'Other').trim(), 
        amount: normalizeAmount(amount) 
      }))
      .filter(item => item.amount > 0) // Remover categorias com valor zero
      .sort((a, b) => b.amount - a.amount);

    const maxAmount = hasData && sortedCategories.length > 0 
      ? Math.max(...sortedCategories.map(i => i.amount)) 
      : 0;

    return {
      hasData,
      sortedCategories,
      maxAmount
    };
  }, [data?.expenseCategories]);

  // Criar dados do gráfico com useMemo
  const chartData = useMemo(() => {
    const { hasData, sortedCategories } = processedData;
    
    if (!hasData) {
      return {
        labels: ['No data'],
        datasets: [{
          label: 'Value ($)',
          data: [0],
          backgroundColor: ['rgba(209, 213, 219, 0.3)'],
          borderColor: ['rgba(209, 213, 219, 0.5)'],
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    return {
      labels: sortedCategories.map(item => item.category),
      datasets: [{
        label: 'Valor (R$)',
        data: sortedCategories.map(item => item.amount),
        backgroundColor: EXPENSE_BAR_COLOR, // COR FIXA - SEMPRE VERMELHO
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 10,
        borderSkipped: false,
        categoryPercentage: 0.6,
        barPercentage: 0.7,
      }]
    };
  }, [processedData]);

  // Plugin customizado para exibir os valores acima das colunas (com useMemo para estabilidade)
  const valueLabelsPlugin = useMemo(() => ({
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const { hasData } = processedData;
      if (!hasData) return;
      
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);
      
      if (!dataset || !meta) return;
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 13px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial';
      
      dataset.data.forEach((rawValue, index) => {
        const element = meta.data[index];
        if (!element) return;
        
        const { x, y } = element.tooltipPosition();
        const normalizedValue = normalizeAmount(rawValue);
        
        if (normalizedValue === 0) return; // Não exibir zero
        
        const displayValue = `$${normalizedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
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
  }), [processedData]);

  // Options com useMemo
  const options = useMemo(() => {
    const { maxAmount } = processedData;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Desabilitar animação para atualização mais rápida
      },
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
              const value = normalizeAmount(context.raw);
              return `Value: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
              return `$${value.toLocaleString('en-US')}`;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };
  }, [processedData]);

  // Chave única baseada nos dados (sem Date.now para evitar re-renderizações desnecessárias)
  const chartKey = useMemo(() => {
    const { sortedCategories } = processedData;
    const dataKey = sortedCategories.map(c => `${c.category}-${c.amount.toFixed(2)}`).join('|');
    return `column-${dataKey || 'empty'}`;
  }, [processedData]);

  return (
    <div className="relative h-full">
      <style jsx>{`
        :global(.chartjs-render-monitor) {
          animation: none !important;
        }
      `}</style>
      <Bar 
        key={chartKey}
        data={chartData} 
        options={options} 
        plugins={[valueLabelsPlugin]}
        redraw={true}
      />
    </div>
  );
}
