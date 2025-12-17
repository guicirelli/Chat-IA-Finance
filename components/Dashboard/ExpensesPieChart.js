import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useMemo } from 'react';
import { normalizeAmount, getColorByType, TRANSACTION_TYPES } from '../../utils/transactionHelpers';

ChartJS.register(ArcElement, Tooltip, Legend);

// CORES PREMIUM PARA CAPA - Vibrantes e Modernas
const INCOME_COLOR = 'rgba(16, 185, 129, 0.95)';      // Verde vibrante - SEMPRE para receitas
const INCOME_BORDER = 'rgba(5, 150, 105, 1)';          // Verde escuro para borda
const INCOME_SHADOW = 'rgba(16, 185, 129, 0.4)';      // Sombra verde
const EXPENSE_COLOR = 'rgba(239, 68, 68, 0.95)';      // Vermelho vibrante - SEMPRE para despesas
const EXPENSE_BORDER = 'rgba(220, 38, 38, 1)';        // Vermelho escuro para borda
const EXPENSE_SHADOW = 'rgba(239, 68, 68, 0.4)';       // Sombra vermelha

export default function ExpensesPieChart({ data }) {
  // Normalizar e validar dados com useMemo para evitar recálculos desnecessários
  const normalizedData = useMemo(() => {
    // CRÍTICO: Validação extra para garantir que data não é undefined/null
    if (!data || (data.totalIncome === undefined && data.totalExpenses === undefined)) {
      console.warn('⚠️ ExpensesPieChart: dados inválidos recebidos', data);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        total: 0,
        balance: 0,
        hasData: false,
        displayIncome: 0,
        displayExpenses: 0
      };
    }

    const totalIncome = normalizeAmount(data?.totalIncome || 0);
    const totalExpenses = normalizeAmount(data?.totalExpenses || 0);
    
    // CRÍTICO: Garantir que valores zero ainda sejam tratados corretamente
    // Se ambos forem zero, mostrar "No data"
    if (totalIncome === 0 && totalExpenses === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        total: 0,
        balance: 0,
        hasData: false,
        displayIncome: 0,
        displayExpenses: 0
      };
    }
    
    const total = totalIncome + totalExpenses;
    const balance = totalIncome - totalExpenses;
    
    return {
      totalIncome,
      totalExpenses,
      total,
      balance,
      hasData: true,
      displayIncome: totalIncome,
      displayExpenses: totalExpenses
    };
  }, [data?.totalIncome, data?.totalExpenses]);

  // Criar dados do gráfico com useMemo - ORDEM FIXA E IMUTÁVEL
  const chartData = useMemo(() => {
    const { displayIncome, displayExpenses, hasData, totalIncome, totalExpenses } = normalizedData;
    
    if (!hasData) {
      return {
        labels: ['No data'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['rgba(209, 213, 219, 0.9)'],
            borderColor: ['transparent'],
            borderWidth: 1,
          },
        ],
      };
    }

    // Se receitas são zero mas há despesas, mostrar apenas despesas
    if (totalIncome === 0 && totalExpenses > 0) {
      return {
        labels: ['Expenses'],
        datasets: [
          {
            data: [displayExpenses],
            backgroundColor: [EXPENSE_COLOR],
            borderColor: [EXPENSE_BORDER],
            borderWidth: 4,
            hoverBorderWidth: 6,
            hoverOffset: 8,
          },
        ],
      };
    }
    
    // Se despesas são zero mas há receitas, mostrar apenas receitas
    if (totalExpenses === 0 && totalIncome > 0) {
      return {
        labels: ['Income'],
        datasets: [
          {
            data: [displayIncome],
            backgroundColor: [INCOME_COLOR],
            borderColor: [INCOME_BORDER],
            borderWidth: 4,
            hoverBorderWidth: 6,
            hoverOffset: 8,
          },
        ],
      };
    }

    // Ambos existem - ORDEM FIXA: Income ALWAYS first (index 0), Expenses ALWAYS second (index 1)
    return {
      labels: ['Income', 'Expenses'], // FIXED ORDER - NEVER CHANGE
      datasets: [
        {
          data: [displayIncome, displayExpenses], // ORDEM FIXA - Receitas primeiro
          backgroundColor: [
            INCOME_COLOR,  // Índice 0 = Receitas = VERDE (FIXO)
            EXPENSE_COLOR  // Índice 1 = Despesas = VERMELHO (FIXO)
          ],
          borderColor: [
            INCOME_BORDER,  // Índice 0 = Receitas = VERDE (FIXO)
            EXPENSE_BORDER  // Índice 1 = Despesas = VERMELHO (FIXO)
          ],
          borderWidth: 4, // Borda mais grossa para destaque
          hoverBorderWidth: 6, // Borda ainda maior no hover
          hoverOffset: 8, // Efeito de separação no hover
        },
      ],
    };
  }, [normalizedData]);

  // Calcular porcentagens com useMemo - CORRIGIDO para lidar com valores zero
  const percentages = useMemo(() => {
    const { totalIncome, totalExpenses, total, hasData } = normalizedData;
    
    if (!hasData || total === 0) {
      return { incomePercent: '0.0', expensePercent: '0.0' };
    }
    
    // CRÍTICO: Calcular porcentagem baseado no total REAL
    // Se totalIncome = 1000 e totalExpenses = 1000, cada um é 50%
    const incomePercent = totalIncome > 0 ? ((totalIncome / total) * 100).toFixed(1) : '0.0';
    const expensePercent = totalExpenses > 0 ? ((totalExpenses / total) * 100).toFixed(1) : '0.0';
    
    // Garantir que a soma seja exatamente 100% (ajustar arredondamento)
    const sum = parseFloat(incomePercent) + parseFloat(expensePercent);
    if (Math.abs(sum - 100) > 0.05 && total > 0) {
      // Ajustar a maior porcentagem para garantir soma = 100%
      if (totalIncome >= totalExpenses) {
        const adjusted = (100 - parseFloat(expensePercent)).toFixed(1);
        return { incomePercent: adjusted, expensePercent };
      } else {
        const adjusted = (100 - parseFloat(incomePercent)).toFixed(1);
        return { incomePercent, expensePercent: adjusted };
      }
    }
    
    return { incomePercent, expensePercent };
  }, [normalizedData]);

  // Options com useMemo para evitar recriação
  const options = useMemo(() => {
    const { totalIncome, totalExpenses, total, balance, hasData } = normalizedData;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        animateScale: true, // Ativar scale para efeito premium
        duration: 1200, // Animação mais suave e elegante
        easing: 'easeOutQuart'
      },
      // Forçar atualização completa
      onResize: null,
      onHover: null,
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            usePointStyle: true,
            padding: 25,
            font: {
              size: 16,
              weight: 'bold',
              family: "'Inter', 'Segoe UI', system-ui, sans-serif"
            },
            boxWidth: 18,
            boxHeight: 18,
            color: '#1f2937',
            generateLabels: (chart) => {
              if (!hasData) {
                return [{
                  text: 'No data',
                  fillStyle: 'rgba(209, 213, 219, 0.9)',
                  strokeStyle: '#000000',
                  fontColor: '#6b7280',
                  pointStyle: 'circle',
                  hidden: false,
                  index: 0
                }];
              }
              
              // EXTRA VALIDATION: Ensure data is in correct order
              const labels = chart.data.labels || [];
              const dataValues = chart.data.datasets[0]?.data || [];
              
              // Map labels to FIXED colors based on label, not index
              return labels.map((label, index) => {
                // COLOR BASED ON LABEL (type), NEVER ON INDEX OR VALUE
                const isIncome = label === 'Income';
                
                // VALIDATION: If label is not expected, use type based on fixed position
                // But always prioritize the label
                const finalIsIncome = label === 'Income' || (index === 0 && labels[0] !== 'Expenses');
                
                // Usar cores FIXAS baseadas no tipo - NUNCA MUDAM
                const fillColor = finalIsIncome ? INCOME_COLOR : EXPENSE_COLOR;
                const borderColor = finalIsIncome ? INCOME_BORDER : EXPENSE_BORDER;
                const textColor = finalIsIncome ? '#065f46' : '#991b1b'; // Cores mais escuras para contraste
                
                // Usar porcentagem pré-calculada baseada no tipo correto
                const percentage = finalIsIncome ? percentages.incomePercent : percentages.expensePercent;
                const value = finalIsIncome ? totalIncome : totalExpenses;
                
                return {
                  text: `${label} • ${percentage}% • $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  fillStyle: fillColor,  // COR FIXA baseada em tipo - NUNCA MUDA
                  strokeStyle: borderColor,  // COR FIXA baseada em tipo - NUNCA MUDA
                  fontColor: textColor,
                  pointStyle: 'circle',
                  hidden: false,
                  index: index,
                  lineWidth: 2
                };
              });
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 16,
          cornerRadius: 12,
          displayColors: true,
          titleFont: {
            size: 16,
            weight: 'bold',
            family: "'Inter', 'Segoe UI', system-ui, sans-serif"
          },
          bodyFont: {
            size: 14,
            weight: 'normal',
            family: "'Inter', 'Segoe UI', system-ui, sans-serif"
          },
          callbacks: {
            title: (context) => {
              return context[0].label;
            },
            label: (context) => {
              if (!hasData) {
                return 'No data recorded';
              }
              
              const value = normalizeAmount(context.raw);
              const label = context.label;
              
              // Determine type by label
              const isIncome = label === 'Income';
              const percentage = isIncome ? percentages.incomePercent : percentages.expensePercent;
              const balanceStatus = balance >= 0 ? 'Positive Balance ✅' : 'Negative Balance ⚠️';
              
              return [
                `💰 Value: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `📊 Percentage: ${percentage}% of total`,
                `💵 ${balanceStatus}`
              ];
            },
            labelColor: (context) => {
              const isIncome = context.label === 'Income';
              return {
                borderColor: isIncome ? INCOME_BORDER : EXPENSE_BORDER,
                backgroundColor: isIncome ? INCOME_COLOR : EXPENSE_COLOR,
                borderWidth: 2,
                borderRadius: 2
              };
            }
          }
        }
      }
    };
  }, [normalizedData, percentages]);

  // Chave única baseada nos valores - adicionar timestamp quando necessário para forçar atualização
  const chartKey = useMemo(() => {
    // Usar timestamp apenas quando os valores mudarem significativamente
    const timestamp = Date.now();
    return `pie-${normalizedData.totalIncome.toFixed(2)}-${normalizedData.totalExpenses.toFixed(2)}-${timestamp}`;
  }, [normalizedData.totalIncome, normalizedData.totalExpenses]);

  // VALIDAÇÃO FINAL: Garantir que as cores estão corretas antes de renderizar
  const validatedChartData = useMemo(() => {
    if (!chartData.datasets || !chartData.datasets[0]) {
      return chartData;
    }
    
    // VALIDAÇÃO CRÍTICA: Garantir que as cores estão na ordem correta
    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];
    
    // Criar nova referência para garantir que React detecte mudanças
    const validatedData = {
      labels: [...labels],
      datasets: [{
        ...dataset,
        data: [...dataset.data],
        backgroundColor: [...dataset.backgroundColor],
        borderColor: [...dataset.borderColor]
      }]
    };
    
    // Se Receitas está no índice 0, deve ser VERDE
    if (labels[0] === 'Receitas') {
      if (validatedData.datasets[0].backgroundColor[0] !== INCOME_COLOR) {
        console.warn('⚠️ Correção: Receitas não estava verde, corrigindo...');
        validatedData.datasets[0].backgroundColor[0] = INCOME_COLOR;
        validatedData.datasets[0].borderColor[0] = INCOME_BORDER;
      }
    }
    
    // Se Despesas está no índice 1, deve ser VERMELHO
    if (labels[1] === 'Despesas') {
      if (validatedData.datasets[0].backgroundColor[1] !== EXPENSE_COLOR) {
        console.warn('⚠️ Correção: Despesas não estava vermelho, corrigindo...');
        validatedData.datasets[0].backgroundColor[1] = EXPENSE_COLOR;
        validatedData.datasets[0].borderColor[1] = EXPENSE_BORDER;
      }
    }
    
    // VALIDAÇÃO EXTRA: Garantir que as cores estão corretas independente da ordem
    validatedData.datasets[0].backgroundColor = validatedData.datasets[0].backgroundColor.map((color, index) => {
      const label = labels[index];
      if (label === 'Receitas' || label === 'Income') return INCOME_COLOR;
      if (label === 'Despesas' || label === 'Expenses') return EXPENSE_COLOR;
      return color;
    });
    
    validatedData.datasets[0].borderColor = validatedData.datasets[0].borderColor.map((color, index) => {
      const label = labels[index];
      if (label === 'Receitas' || label === 'Income') return INCOME_BORDER;
      if (label === 'Despesas' || label === 'Expenses') return EXPENSE_BORDER;
      return color;
    });
    
    return validatedData;
  }, [chartData]);

  // Debug: Log para verificar dados (remover em produção)
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 ExpensesPieChart - Dados:', {
      totalIncome: normalizedData.totalIncome,
      totalExpenses: normalizedData.totalExpenses,
      total: normalizedData.total,
      percentages,
      chartData: {
        labels: validatedChartData.labels,
        data: validatedChartData.datasets[0].data,
        colors: validatedChartData.datasets[0].backgroundColor
      }
    });
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Container com efeitos visuais premium */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Efeito de brilho/gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 rounded-3xl opacity-30 blur-3xl"></div>
        
        {/* Valores destacados no centro (opcional, pode ser ativado) */}
        {normalizedData.hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {normalizedData.balance >= 0 ? '✅' : '⚠️'}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Balance: ${normalizedData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}

        {/* Estilos premium para o gráfico */}
        <style jsx>{`
          :global(.chartjs-render-monitor) {
            filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
          }
          
          :global(canvas) {
            filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15));
          }
          
          :global(.chartjs-legend) {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          :global(.chartjs-legend li) {
            margin: 8px 0;
            transition: transform 0.2s ease;
          }
          
          :global(.chartjs-legend li:hover) {
            transform: translateX(4px);
          }
          
          :global(.chartjs-legend li span) {
            font-weight: 600;
            letter-spacing: 0.025em;
          }
          
          /* Efeito de brilho nas fatias */
          :global(canvas) {
            animation: subtle-glow 3s ease-in-out infinite alternate;
          }
          
          @keyframes subtle-glow {
            0% {
              filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15)) brightness(1);
            }
            100% {
              filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15)) brightness(1.02);
            }
          }
        `}</style>
        
        <Pie 
          key={chartKey}
          data={validatedChartData} 
          options={options}
          redraw={true}
          updateMode="resize"
        />
      </div>
    </div>
  );
}
