# 🧪 Testes Funcionais - Receitas vs Despesas

Este diretório contém testes completos para validar todas as regras de lógica implementadas.

## 📋 Estrutura dos Testes

### 1. `transactionHelpers.test.js`
Testes unitários das funções utilitárias:
- ✅ Normalização de tipos
- ✅ Normalização de valores
- ✅ Cálculo de cores baseado em tipo
- ✅ Cálculo de totais
- ✅ Validação de transações

### 2. `components/ExpensesPieChart.test.js`
Testes do componente de gráfico de pizza:
- ✅ Cores corretas (verde/vermelho)
- ✅ Ordem fixa dos dados
- ✅ Tratamento de valores zero
- ✅ Normalização de valores

## 🚀 Como Executar

```bash
# Instalar dependências de teste
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event babel-jest identity-obj-proxy jest jest-environment-jsdom

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage

# Executar apenas testes de transações
npm run test:transaction

# Executar apenas testes de componentes
npm run test:components
```

## ✅ Checklist de Validação

### 🧪 1. Testes de tipo (regra principal)
- [x] Receita com tipo = "receita" aparece verde
- [x] Despesa com tipo = "despesa" aparece vermelha
- [x] Tipo em maiúsculo ("RECEITA") funciona
- [x] Tipo com espaço (" despesa ") funciona
- [x] Tipo inválido não renderiza OU mostra erro

### 🧪 2. Testes de valor
- [x] Receita com valor positivo soma corretamente
- [x] Despesa com valor positivo não vira verde
- [x] Despesa com valor negativo continua vermelha
- [x] Valor 0 aparece neutro (cinza ou padrão)
- [x] Valor string ("1000") é convertido corretamente
- [x] Valor null, undefined ou NaN não quebra a tela

### 🧪 3. Testes de saldo
- [x] Saldo = receitas − despesas
- [x] Saldo positivo aparece verde
- [x] Saldo negativo aparece vermelho
- [x] Saldo zero aparece neutro

### 🧪 4. Testes do gráfico de pizza
- [x] Receita nunca aparece como vermelho no gráfico
- [x] Despesa nunca aparece como verde no gráfico
- [x] Ordem das fatias não altera as cores
- [x] Percentuais somam 100%
- [x] Pizza não quebra com total = 0
- [x] Pizza não renderiza quando não há dados

### 🧪 5. Testes de filtro
- [x] Filtro por tipo funciona corretamente
- [x] Filtros combinados não misturam receitas e despesas

### 🧪 6. Testes de consistência visual
- [x] Card de receita e gráfico usam a mesma cor
- [x] Card de despesa e gráfico usam a mesma cor
- [x] Não existe cor definida por índice do array

### 🧪 7. Testes de atualização
- [x] Adicionar receita atualiza totais
- [x] Adicionar despesa atualiza totais

### 🧪 8. Testes de dados extremos
- [x] Valores muito altos não quebram layout
- [x] Muitas casas decimais não quebram porcentagem
- [x] Valores negativos são convertidos para positivos

### 🧪 9. Testes de contrato de dados
- [x] Todo lançamento possui tipo
- [x] Todo lançamento possui valor
- [x] Tipo aceita apenas "receita" ou "despesa"
- [x] Categoria vazia não quebra o gráfico

### 🧪 10. Teste final obrigatório (regra de ouro)
- [x] Trocar a ordem dos dados não altera cores
- [x] Cores dependem do tipo, não do valor
- [x] Remover CSS não altera cálculo

## 🔐 Validação Final

Todos os testes validam a **Regra Anti-Bug**:
- ✅ Receita nunca ficará vermelha
- ✅ Despesa nunca ficará verde
- ✅ Gráfico não quebra
- ✅ Código está blindado

## 📊 Cobertura Esperada

- `utils/transactionHelpers.js`: 100%
- `components/Dashboard/ExpensesPieChart.js`: >90%
- `components/Dashboard/ExpensesColumnChart.js`: >90%
- `components/Dashboard/TransactionDetails.js`: >90%

## 🐛 Como Adicionar Novos Testes

1. Identifique o cenário de teste
2. Adicione o teste no arquivo apropriado
3. Execute `npm test` para validar
4. Certifique-se de que o teste falha primeiro (TDD)
5. Implemente a correção
6. Valide que o teste passa

## 📝 Notas

- Todos os testes devem ser independentes
- Use mocks para dependências externas
- Valide tanto casos de sucesso quanto de erro
- Mantenha os testes simples e focados

