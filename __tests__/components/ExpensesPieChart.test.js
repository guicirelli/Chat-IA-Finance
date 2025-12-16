/**
 * Testes do componente ExpensesPieChart
 * Validação visual e lógica do gráfico de pizza
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpensesPieChart from '../../components/Dashboard/ExpensesPieChart';

// Mock do Chart.js
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data, options }) => {
    // Renderizar informações do gráfico para teste
    return (
      <div data-testid="pie-chart">
        <div data-testid="chart-labels">{JSON.stringify(data.labels)}</div>
        <div data-testid="chart-data">{JSON.stringify(data.datasets[0].data)}</div>
        <div data-testid="chart-colors">{JSON.stringify(data.datasets[0].backgroundColor)}</div>
      </div>
    );
  }
}));

describe('ExpensesPieChart - Testes Funcionais', () => {
  test('Receita aparece verde no gráfico', () => {
    const data = {
      totalIncome: 1000,
      totalExpenses: 500
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const colors = JSON.parse(screen.getByTestId('chart-colors').textContent);
    // Primeira cor (Receitas) deve ser verde
    expect(colors[0]).toBe('rgba(34, 197, 94, 0.9)');
  });

  test('Despesa aparece vermelha no gráfico', () => {
    const data = {
      totalIncome: 1000,
      totalExpenses: 500
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const colors = JSON.parse(screen.getByTestId('chart-colors').textContent);
    // Segunda cor (Despesas) deve ser vermelha
    expect(colors[1]).toBe('rgba(239, 68, 68, 0.9)');
  });

  test('Ordem fixa: Receitas sempre primeiro, Despesas sempre segundo', () => {
    const data = {
      totalIncome: 1000,
      totalExpenses: 500
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const labels = JSON.parse(screen.getByTestId('chart-labels').textContent);
    expect(labels[0]).toBe('Receitas');
    expect(labels[1]).toBe('Despesas');
  });

  test('Gráfico não quebra com total = 0', () => {
    const data = {
      totalIncome: 0,
      totalExpenses: 0
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const labels = JSON.parse(screen.getByTestId('chart-labels').textContent);
    expect(labels[0]).toBe('Sem dados');
  });

  test('Gráfico não renderiza dados inválidos', () => {
    const data = {
      totalIncome: null,
      totalExpenses: undefined
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const labels = JSON.parse(screen.getByTestId('chart-labels').textContent);
    expect(labels[0]).toBe('Sem dados');
  });

  test('Valores são normalizados corretamente', () => {
    const data = {
      totalIncome: '1000',
      totalExpenses: '500'
    };
    
    render(<ExpensesPieChart data={data} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent);
    expect(chartData[0]).toBe(1000);
    expect(chartData[1]).toBe(500);
  });
});

