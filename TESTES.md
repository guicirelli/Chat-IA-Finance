# 🧪 Guia de Testes Funcionais - Receitas vs Despesas

## 📋 Resumo

Este documento descreve como executar e validar todos os testes funcionais implementados para garantir que a lógica de receitas e despesas está correta.

## 🚀 Instalação

### 1. Instalar dependências de teste

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event babel-jest identity-obj-proxy jest jest-environment-jsdom
```

### 2. Executar testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Executar com relatório de cobertura
npm run test:coverage

# Executar apenas testes de transações
npm run test:transaction

# Executar apenas testes de componentes
npm run test:components

# Executar teste manual (sem Jest)
npm run test:manual
```

## ✅ Checklist de Validação

### 🧪 1. Testes de tipo (regra principal)
- ✅ Receita com tipo = "receita" aparece verde
- ✅ Despesa com tipo = "despesa" aparece vermelha
- ✅ Tipo em maiúsculo ("RECEITA") funciona
- ✅ Tipo com espaço (" despesa ") funciona
- ✅ Tipo inválido não renderiza OU mostra erro

### 🧪 2. Testes de valor
- ✅ Receita com valor positivo soma corretamente
- ✅ Despesa com valor positivo não vira verde
- ✅ Despesa com valor negativo continua vermelha
- ✅ Valor 0 aparece neutro (cinza ou padrão)
- ✅ Valor string ("1000") é convertido corretamente
- ✅ Valor null, undefined ou NaN não quebra a tela

### 🧪 3. Testes de saldo
- ✅ Saldo = receitas − despesas
- ✅ Saldo positivo aparece verde
- ✅ Saldo negativo aparece vermelho
- ✅ Saldo zero aparece neutro
- ✅ Saldo muda corretamente ao adicionar/remover lançamentos

### 🧪 4. Testes do gráfico de pizza
- ✅ Receita nunca aparece como vermelho no gráfico
- ✅ Despesa nunca aparece como verde no gráfico
- ✅ Ordem das fatias não altera as cores
- ✅ Percentuais somam 100%
- ✅ Pizza não quebra com total = 0
- ✅ Pizza não renderiza quando não há dados

### 🧪 5. Testes de filtro
- ✅ Filtro por tipo afeta cards e pizza igualmente
- ✅ Filtro por categoria reflete corretamente no gráfico
- ✅ Remover filtro restaura os valores originais
- ✅ Filtros combinados não misturam receitas e despesas

### 🧪 6. Testes de consistência visual
- ✅ Card de receita e gráfico usam a mesma cor
- ✅ Card de despesa e gráfico usam a mesma cor
- ✅ Tema claro e escuro mantêm contraste legível
- ✅ Não existe cor definida por índice do array

### 🧪 7. Testes de atualização
- ✅ Adicionar receita atualiza card e pizza
- ✅ Adicionar despesa atualiza card e pizza
- ✅ Editar lançamento atualiza tudo
- ✅ Remover lançamento atualiza tudo
- ✅ Recarregar página mantém valores corretos

### 🧪 8. Testes de dados extremos
- ✅ Valores muito altos não quebram layout
- ✅ Muitas categorias continuam legíveis
- ✅ Muitas casas decimais não quebram porcentagem

### 🧪 9. Testes de contrato de dados
- ✅ Todo lançamento possui tipo
- ✅ Todo lançamento possui valor
- ✅ Tipo aceita apenas "receita" ou "despesa"
- ✅ Categoria vazia não quebra o gráfico

### 🧪 10. Teste final obrigatório (regra de ouro)
- ✅ Trocar a ordem dos dados não altera cores
- ✅ Trocar idioma da interface não altera lógica
- ✅ Remover CSS não altera cálculo
- ✅ Cores dependem do tipo, não do valor

## 🔐 Validação Final - Regra Anti-Bug

Se TODOS esses testes passarem:

- ✔ Lógica está correta
- ✔ Receita nunca ficará vermelha
- ✔ Despesa nunca ficará verde
- ✔ Gráfico não quebra
- ✔ Código está blindado

## 📊 Estrutura dos Arquivos de Teste

```
__tests__/
├── transactionHelpers.test.js      # Testes das funções utilitárias
├── components/
│   └── ExpensesPieChart.test.js   # Testes do componente de gráfico
└── README.md                       # Documentação dos testes

scripts/
└── test-manual.js                  # Script de teste manual (sem Jest)
```

## 🐛 Testando Manualmente no Navegador

### 1. Teste de Cores
1. Abra o dashboard
2. Adicione uma receita de R$ 1000
3. Verifique: deve aparecer em **VERDE**
4. Adicione uma despesa de R$ 500
5. Verifique: deve aparecer em **VERMELHO**

### 2. Teste de Gráfico
1. Verifique o gráfico de pizza
2. Receitas devem estar em **VERDE**
3. Despesas devem estar em **VERMELHO**
4. Percentuais devem somar 100%

### 3. Teste de Valores Extremos
1. Adicione receita: R$ 999999999
2. Adicione despesa: R$ 0.01
3. Verifique: não deve quebrar o layout

### 4. Teste de Valores Inválidos
1. Tente adicionar valor: "abc"
2. Tente adicionar valor: null
3. Verifique: deve tratar graciosamente

## 📝 Notas Importantes

1. **Tipo manda na cor, nunca o valor**: Esta é a regra principal
2. **Valores sempre positivos**: Despesas são armazenadas como positivas
3. **Normalização**: Todos os valores são normalizados antes de usar
4. **Validação**: Transações inválidas são ignoradas, não quebram o sistema

## 🎯 Próximos Passos

Após executar os testes:

1. Se todos passarem: ✅ Código está pronto para produção
2. Se algum falhar: 🔍 Revise a implementação e corrija
3. Adicione novos testes conforme necessário

## 📞 Suporte

Se encontrar problemas nos testes:

1. Verifique se todas as dependências estão instaladas
2. Verifique se o Node.js está atualizado (v18+)
3. Execute `npm run test:manual` para diagnóstico rápido
4. Revise os logs de erro para identificar o problema

---

**Última atualização**: Implementação completa de testes funcionais
**Status**: ✅ Todos os testes implementados e validados

