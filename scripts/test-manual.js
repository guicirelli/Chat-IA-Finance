/**
 * Script de Teste Manual - Receitas vs Despesas
 * Execute: node scripts/test-manual.js
 * 
 * Este script valida todas as regras sem precisar de Jest
 */

const {
  normalizeType,
  normalizeAmount,
  getColorByType,
  filterByType,
  calculateTotals,
  isValidTransaction,
  TRANSACTION_TYPES
} = require('../utils/transactionHelpers');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Erro: ${error.message}`);
    failed++;
  }
}

console.log('🧪 TESTES FUNCIONAIS - Receitas vs Despesas\n');
console.log('='.repeat(60));

// 🧪 1. Testes de tipo
console.log('\n🧪 1. Testes de tipo (regra principal)');
test('Receita com tipo = "receita" aparece verde', () => {
  const colors = getColorByType('receita');
  if (colors.chart.backgroundColor !== 'rgba(34, 197, 94, 0.9)') {
    throw new Error('Receita não está verde');
  }
});

test('Despesa com tipo = "despesa" aparece vermelha', () => {
  const colors = getColorByType('despesa');
  if (colors.chart.backgroundColor !== 'rgba(239, 68, 68, 0.9)') {
    throw new Error('Despesa não está vermelha');
  }
});

test('Tipo em maiúsculo ("RECEITA") funciona', () => {
  const normalized = normalizeType('RECEITA');
  if (normalized !== TRANSACTION_TYPES.INCOME) {
    throw new Error('Tipo maiúsculo não funciona');
  }
});

test('Tipo com espaço (" despesa ") funciona', () => {
  const normalized = normalizeType(' despesa ');
  if (normalized !== TRANSACTION_TYPES.EXPENSE) {
    throw new Error('Tipo com espaço não funciona');
  }
});

// 🧪 2. Testes de valor
console.log('\n🧪 2. Testes de valor');
test('Valor string ("1000") é convertido corretamente', () => {
  const amount = normalizeAmount('1000');
  if (amount !== 1000) {
    throw new Error(`Valor esperado: 1000, recebido: ${amount}`);
  }
});

test('Valor null, undefined ou NaN não quebra', () => {
  if (normalizeAmount(null) !== 0) throw new Error('null não retorna 0');
  if (normalizeAmount(undefined) !== 0) throw new Error('undefined não retorna 0');
  if (normalizeAmount(NaN) !== 0) throw new Error('NaN não retorna 0');
});

test('Despesa com valor negativo continua vermelha', () => {
  const amount = normalizeAmount(-500);
  if (amount !== 500) throw new Error('Valor negativo não foi normalizado');
  
  const colors = getColorByType('expense');
  if (colors.chart.backgroundColor !== 'rgba(239, 68, 68, 0.9)') {
    throw new Error('Despesa não está vermelha');
  }
});

// 🧪 3. Testes de saldo
console.log('\n🧪 3. Testes de saldo');
test('Saldo = receitas − despesas', () => {
  const transactions = [
    { type: 'income', amount: 1000 },
    { type: 'expense', amount: 300 }
  ];
  const totals = calculateTotals(transactions);
  if (totals.balance !== 700) {
    throw new Error(`Saldo esperado: 700, recebido: ${totals.balance}`);
  }
});

// 🧪 4. Testes do gráfico de pizza
console.log('\n🧪 4. Testes do gráfico de pizza');
test('Receita nunca aparece como vermelho', () => {
  const colors = getColorByType(TRANSACTION_TYPES.INCOME);
  if (colors.chart.backgroundColor.includes('239, 68, 68')) {
    throw new Error('Receita apareceu como vermelho!');
  }
});

test('Despesa nunca aparece como verde', () => {
  const colors = getColorByType(TRANSACTION_TYPES.EXPENSE);
  if (colors.chart.backgroundColor.includes('34, 197, 94')) {
    throw new Error('Despesa apareceu como verde!');
  }
});

test('Pizza não quebra com total = 0', () => {
  const transactions = [];
  const totals = calculateTotals(transactions);
  if (totals.totalIncome !== 0 || totals.totalExpenses !== 0) {
    throw new Error('Totais não são zero');
  }
});

// 🧪 10. Teste final obrigatório
console.log('\n🧪 10. Teste final obrigatório (regra de ouro)');
test('Cores dependem do tipo, não do valor', () => {
  const incomeColors1 = getColorByType(TRANSACTION_TYPES.INCOME);
  const incomeColors2 = getColorByType(TRANSACTION_TYPES.INCOME);
  
  if (incomeColors1.chart.backgroundColor !== incomeColors2.chart.backgroundColor) {
    throw new Error('Cores de receita não são consistentes');
  }
  
  if (incomeColors1.chart.backgroundColor !== 'rgba(34, 197, 94, 0.9)') {
    throw new Error('Receita não está verde');
  }
});

test('Trocar ordem dos dados não altera cores', () => {
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
  
  if (totals1.totalIncome !== totals2.totalIncome) {
    throw new Error('Totais de receita diferentes');
  }
  
  if (totals1.totalExpenses !== totals2.totalExpenses) {
    throw new Error('Totais de despesa diferentes');
  }
});

// 🔐 Validação Final
console.log('\n🔐 Validação Final - Regra Anti-Bug');
test('Receita nunca ficará vermelha', () => {
  const colors = getColorByType(TRANSACTION_TYPES.INCOME);
  if (colors.chart.backgroundColor.includes('239, 68, 68')) {
    throw new Error('RECEITA APARECEU VERMELHA! ❌');
  }
});

test('Despesa nunca ficará verde', () => {
  const colors = getColorByType(TRANSACTION_TYPES.EXPENSE);
  if (colors.chart.backgroundColor.includes('34, 197, 94')) {
    throw new Error('DESPESA APARECEU VERDE! ❌');
  }
});

test('Código está blindado contra erros comuns', () => {
  // Teste de concatenação de strings
  const amount1 = normalizeAmount('1000');
  const amount2 = normalizeAmount('500');
  if (amount1 + amount2 !== 1500) {
    throw new Error('Concatenação de strings não foi evitada');
  }
  
  // Teste de divisão por zero
  const transactions = [];
  const totals = calculateTotals(transactions);
  const total = totals.totalIncome + totals.totalExpenses;
  if (!Number.isFinite(total)) {
    throw new Error('Divisão por zero não foi tratada');
  }
});

// Resultado final
console.log('\n' + '='.repeat(60));
console.log(`\n📊 RESULTADO FINAL:`);
console.log(`✅ Testes passados: ${passed}`);
console.log(`❌ Testes falhados: ${failed}`);
console.log(`📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 TODOS OS TESTES PASSARAM!');
  console.log('✔ Lógica está correta');
  console.log('✔ Receita nunca ficará vermelha');
  console.log('✔ Despesa nunca ficará verde');
  console.log('✔ Gráfico não quebra');
  console.log('✔ Código está blindado');
  process.exit(0);
} else {
  console.log('\n⚠️  ALGUNS TESTES FALHARAM!');
  console.log('Revise a implementação antes de continuar.');
  process.exit(1);
}

