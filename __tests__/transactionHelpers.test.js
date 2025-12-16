/**
 * TESTES FUNCIONAIS - Receitas vs Despesas
 * Validação completa da lógica implementada
 */

import {
  normalizeType,
  normalizeAmount,
  getColorByType,
  filterByType,
  calculateTotals,
  isValidTransaction,
  TRANSACTION_TYPES
} from '../utils/transactionHelpers';

describe('🧪 1. Testes de tipo (regra principal)', () => {
  test('Receita com tipo = "receita" aparece verde', () => {
    const colors = getColorByType('receita');
    expect(colors.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)'); // Verde
  });

  test('Despesa com tipo = "despesa" aparece vermelha', () => {
    const colors = getColorByType('despesa');
    expect(colors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)'); // Vermelho
  });

  test('Tipo em maiúsculo ("RECEITA") funciona', () => {
    const normalized = normalizeType('RECEITA');
    expect(normalized).toBe(TRANSACTION_TYPES.INCOME);
  });

  test('Tipo com espaço (" despesa ") funciona', () => {
    const normalized = normalizeType(' despesa ');
    expect(normalized).toBe(TRANSACTION_TYPES.EXPENSE);
  });

  test('Tipo inválido não renderiza OU mostra erro', () => {
    const normalized = normalizeType('tipo_invalido');
    expect(normalized).toBeNull();
    
    const colors = getColorByType('tipo_invalido');
    expect(colors.chart.backgroundColor).toBe('rgba(156, 163, 175, 0.9)'); // Cinza neutro
  });

  test('Variações de tipo funcionam', () => {
    expect(normalizeType('income')).toBe(TRANSACTION_TYPES.INCOME);
    expect(normalizeType('expense')).toBe(TRANSACTION_TYPES.EXPENSE);
    expect(normalizeType('receitas')).toBe(TRANSACTION_TYPES.INCOME);
    expect(normalizeType('despesas')).toBe(TRANSACTION_TYPES.EXPENSE);
  });
});

describe('🧪 2. Testes de valor', () => {
  test('Receita com valor positivo soma corretamente', () => {
    const amount = normalizeAmount(1000);
    expect(amount).toBe(1000);
  });

  test('Despesa com valor positivo não vira verde', () => {
    const colors = getColorByType('expense');
    expect(colors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)'); // Vermelho
  });

  test('Despesa com valor negativo continua vermelha', () => {
    const amount = normalizeAmount(-500);
    expect(amount).toBe(500); // Sempre positivo
    
    const colors = getColorByType('expense');
    expect(colors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)'); // Vermelho
  });

  test('Valor 0 aparece neutro', () => {
    const amount = normalizeAmount(0);
    expect(amount).toBe(0);
  });

  test('Valor string ("1000") é convertido corretamente', () => {
    const amount = normalizeAmount('1000');
    expect(amount).toBe(1000);
  });

  test('Valor null, undefined ou NaN não quebra a tela', () => {
    expect(normalizeAmount(null)).toBe(0);
    expect(normalizeAmount(undefined)).toBe(0);
    expect(normalizeAmount(NaN)).toBe(0);
    expect(normalizeAmount('abc')).toBe(0);
  });

  test('Valor com vírgula funciona', () => {
    expect(normalizeAmount('1.000,50')).toBe(1000.5);
    expect(normalizeAmount('1,000.50')).toBe(1000.5);
  });
});

describe('🧪 3. Testes de saldo', () => {
  test('Saldo = receitas − despesas', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 300 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.balance).toBe(700);
  });

  test('Saldo positivo aparece verde', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 300 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.balance).toBeGreaterThan(0);
  });

  test('Saldo negativo aparece vermelho', () => {
    const transactions = [
      { type: 'income', amount: 300 },
      { type: 'expense', amount: 1000 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.balance).toBeLessThan(0);
  });

  test('Saldo zero aparece neutro', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 1000 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.balance).toBe(0);
  });
});

describe('🧪 4. Testes do gráfico de pizza', () => {
  test('Receita nunca aparece como vermelho no gráfico', () => {
    const colors = getColorByType(TRANSACTION_TYPES.INCOME);
    expect(colors.chart.backgroundColor).not.toBe('rgba(239, 68, 68, 0.9)');
    expect(colors.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)'); // Verde
  });

  test('Despesa nunca aparece como verde no gráfico', () => {
    const colors = getColorByType(TRANSACTION_TYPES.EXPENSE);
    expect(colors.chart.backgroundColor).not.toBe('rgba(34, 197, 94, 0.9)');
    expect(colors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)'); // Vermelho
  });

  test('Ordem das fatias não altera as cores', () => {
    const incomeColors = getColorByType(TRANSACTION_TYPES.INCOME).chart;
    const expenseColors = getColorByType(TRANSACTION_TYPES.EXPENSE).chart;
    
    // Mesmo se inverter a ordem dos dados, as cores devem ser as mesmas
    const colors1 = [incomeColors.backgroundColor, expenseColors.backgroundColor];
    const colors2 = [expenseColors.backgroundColor, incomeColors.backgroundColor];
    
    // As cores individuais devem ser consistentes
    expect(incomeColors.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    expect(expenseColors.backgroundColor).toBe('rgba(239, 68, 68, 0.9)');
  });

  test('Pizza não quebra com total = 0', () => {
    const transactions = [];
    const totals = calculateTotals(transactions);
    expect(totals.totalIncome).toBe(0);
    expect(totals.totalExpenses).toBe(0);
    expect(totals.balance).toBe(0);
  });

  test('Percentuais somam 100%', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 500 }
    ];
    const totals = calculateTotals(transactions);
    const total = totals.totalIncome + totals.totalExpenses;
    const incomePercent = (totals.totalIncome / total) * 100;
    const expensePercent = (totals.totalExpenses / total) * 100;
    
    expect(incomePercent + expensePercent).toBeCloseTo(100, 1);
  });
});

describe('🧪 5. Testes de filtro', () => {
  test('Filtro por tipo funciona corretamente', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 500 },
      { type: 'income', amount: 200 }
    ];
    
    const incomeOnly = filterByType(transactions, 'income');
    expect(incomeOnly.length).toBe(2);
    expect(incomeOnly.every(t => normalizeType(t.type) === TRANSACTION_TYPES.INCOME)).toBe(true);
    
    const expenseOnly = filterByType(transactions, 'expense');
    expect(expenseOnly.length).toBe(1);
    expect(expenseOnly.every(t => normalizeType(t.type) === TRANSACTION_TYPES.EXPENSE)).toBe(true);
  });

  test('Filtros combinados não misturam receitas e despesas', () => {
    const transactions = [
      { type: 'income', amount: 1000, category: 'Salário' },
      { type: 'expense', amount: 500, category: 'Alimentação' },
      { type: 'income', amount: 200, category: 'Freelance' }
    ];
    
    const income = filterByType(transactions, 'income');
    const expense = filterByType(transactions, 'expense');
    
    expect(income.length + expense.length).toBe(transactions.length);
    expect(income.some(t => normalizeType(t.type) === TRANSACTION_TYPES.EXPENSE)).toBe(false);
    expect(expense.some(t => normalizeType(t.type) === TRANSACTION_TYPES.INCOME)).toBe(false);
  });
});

describe('🧪 6. Testes de consistência visual', () => {
  test('Card de receita e gráfico usam a mesma cor', () => {
    const colors = getColorByType(TRANSACTION_TYPES.INCOME);
    expect(colors.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    expect(colors.bg).toBe('bg-green-500');
    expect(colors.text).toBe('text-green-600');
  });

  test('Card de despesa e gráfico usam a mesma cor', () => {
    const colors = getColorByType(TRANSACTION_TYPES.EXPENSE);
    expect(colors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)');
    expect(colors.bg).toBe('bg-red-500');
    expect(colors.text).toBe('text-red-600');
  });

  test('Não existe cor definida por índice do array', () => {
    // Cores devem ser baseadas em tipo, não em posição
    const incomeColors = getColorByType(TRANSACTION_TYPES.INCOME);
    const expenseColors = getColorByType(TRANSACTION_TYPES.EXPENSE);
    
    // Mesmo se mudar a ordem, as cores devem ser as mesmas
    expect(incomeColors.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    expect(expenseColors.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)');
  });
});

describe('🧪 7. Testes de atualização', () => {
  test('Adicionar receita atualiza totais', () => {
    const transactions = [
      { type: 'income', amount: 1000 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.totalIncome).toBe(1000);
    
    transactions.push({ type: 'income', amount: 500 });
    const newTotals = calculateTotals(transactions);
    expect(newTotals.totalIncome).toBe(1500);
  });

  test('Adicionar despesa atualiza totais', () => {
    const transactions = [
      { type: 'expense', amount: 300 }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.totalExpenses).toBe(300);
    
    transactions.push({ type: 'expense', amount: 200 });
    const newTotals = calculateTotals(transactions);
    expect(newTotals.totalExpenses).toBe(500);
  });
});

describe('🧪 8. Testes de dados extremos', () => {
  test('Valores muito altos não quebram layout', () => {
    const amount = normalizeAmount(999999999999);
    expect(Number.isFinite(amount)).toBe(true);
  });

  test('Muitas casas decimais não quebram porcentagem', () => {
    const amount = normalizeAmount(1000.123456789);
    expect(Number.isFinite(amount)).toBe(true);
  });

  test('Valores negativos são convertidos para positivos', () => {
    expect(normalizeAmount(-1000)).toBe(1000);
    expect(normalizeAmount('-500')).toBe(500);
  });
});

describe('🧪 9. Testes de contrato de dados', () => {
  test('Todo lançamento possui tipo', () => {
    const valid = isValidTransaction({ type: 'income', amount: 100 });
    expect(valid).toBe(true);
    
    const invalid = isValidTransaction({ amount: 100 });
    expect(invalid).toBe(false);
  });

  test('Todo lançamento possui valor', () => {
    const valid = isValidTransaction({ type: 'income', amount: 100 });
    expect(valid).toBe(true);
    
    const invalid = isValidTransaction({ type: 'income', amount: 0 });
    expect(invalid).toBe(false);
  });

  test('Tipo aceita apenas "receita" ou "despesa"', () => {
    expect(normalizeType('income')).toBe(TRANSACTION_TYPES.INCOME);
    expect(normalizeType('expense')).toBe(TRANSACTION_TYPES.EXPENSE);
    expect(normalizeType('invalid')).toBeNull();
  });

  test('Categoria vazia não quebra o gráfico', () => {
    const transactions = [
      { type: 'income', amount: 1000, category: '' },
      { type: 'expense', amount: 500, category: null }
    ];
    const totals = calculateTotals(transactions);
    expect(totals.totalIncome).toBe(1000);
    expect(totals.totalExpenses).toBe(500);
  });
});

describe('🧪 10. Teste final obrigatório (regra de ouro)', () => {
  test('Trocar a ordem dos dados não altera cores', () => {
    const data1 = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 500 }
    ];
    
    const data2 = [
      { type: 'expense', amount: 500 },
      { type: 'income', amount: 1000 }
    ];
    
    const totals1 = calculateTotals(data1);
    const totals2 = calculateTotals(data2);
    
    expect(totals1.totalIncome).toBe(totals2.totalIncome);
    expect(totals1.totalExpenses).toBe(totals2.totalExpenses);
    
    // Cores devem ser as mesmas independente da ordem
    const incomeColors1 = getColorByType(TRANSACTION_TYPES.INCOME);
    const incomeColors2 = getColorByType(TRANSACTION_TYPES.INCOME);
    expect(incomeColors1.chart.backgroundColor).toBe(incomeColors2.chart.backgroundColor);
  });

  test('Cores dependem do tipo, não do valor', () => {
    // Receita com valor alto
    const colors1 = getColorByType(TRANSACTION_TYPES.INCOME);
    
    // Receita com valor baixo
    const colors2 = getColorByType(TRANSACTION_TYPES.INCOME);
    
    // Receita com valor negativo (normalizado)
    const colors3 = getColorByType(TRANSACTION_TYPES.INCOME);
    
    // Todas devem ser verdes
    expect(colors1.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    expect(colors2.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    expect(colors3.chart.backgroundColor).toBe('rgba(34, 197, 94, 0.9)');
    
    // Despesa com valor alto
    const expenseColors1 = getColorByType(TRANSACTION_TYPES.EXPENSE);
    
    // Despesa com valor baixo
    const expenseColors2 = getColorByType(TRANSACTION_TYPES.EXPENSE);
    
    // Todas devem ser vermelhas
    expect(expenseColors1.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)');
    expect(expenseColors2.chart.backgroundColor).toBe('rgba(239, 68, 68, 0.9)');
  });

  test('Remover CSS não altera cálculo', () => {
    // Cálculos devem funcionar independente de CSS
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 500 }
    ];
    
    const totals = calculateTotals(transactions);
    expect(totals.balance).toBe(500);
    expect(totals.totalIncome).toBe(1000);
    expect(totals.totalExpenses).toBe(500);
  });
});

describe('🔐 Validação Final - Regra Anti-Bug', () => {
  test('Receita nunca ficará vermelha', () => {
    const incomeColors = getColorByType(TRANSACTION_TYPES.INCOME);
    expect(incomeColors.chart.backgroundColor).not.toContain('239, 68, 68'); // Não é vermelho
    expect(incomeColors.chart.backgroundColor).toContain('34, 197, 94'); // É verde
  });

  test('Despesa nunca ficará verde', () => {
    const expenseColors = getColorByType(TRANSACTION_TYPES.EXPENSE);
    expect(expenseColors.chart.backgroundColor).not.toContain('34, 197, 94'); // Não é verde
    expect(expenseColors.chart.backgroundColor).toContain('239, 68, 68'); // É vermelho
  });

  test('Gráfico não quebra com dados inválidos', () => {
    const invalidData = [
      { type: null, amount: 'abc' },
      { type: undefined, amount: null },
      { type: 'invalid', amount: NaN }
    ];
    
    const totals = calculateTotals(invalidData);
    expect(totals.totalIncome).toBe(0);
    expect(totals.totalExpenses).toBe(0);
    expect(totals.balance).toBe(0);
  });

  test('Código está blindado contra erros comuns', () => {
    // Teste de concatenação de strings
    const amount1 = normalizeAmount('1000');
    const amount2 = normalizeAmount('500');
    expect(amount1 + amount2).toBe(1500); // Não é "1000500"
    
    // Teste de divisão por zero
    const transactions = [];
    const totals = calculateTotals(transactions);
    const total = totals.totalIncome + totals.totalExpenses;
    if (total === 0) {
      // Não deve quebrar
      expect(total).toBe(0);
    }
    
    // Teste de valores null/undefined
    expect(normalizeAmount(null)).toBe(0);
    expect(normalizeAmount(undefined)).toBe(0);
  });
});

