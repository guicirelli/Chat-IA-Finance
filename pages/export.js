import { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Calendar,
  Filter
} from 'lucide-react';

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startMonth: new Date().getMonth(),
    startYear: new Date().getFullYear(),
    endMonth: new Date().getMonth(),
    endYear: new Date().getFullYear(),
    format: 'pdf'
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startMonth: filters.startMonth,
        startYear: filters.startYear,
        endMonth: filters.endMonth,
        endYear: filters.endYear,
        format: filters.format
      });

      const response = await fetch(`/api/export/${filters.format}?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-financeiro-${filters.startMonth + 1}-${filters.startYear}-${filters.endMonth + 1}-${filters.endYear}.${filters.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Exportar Relatórios
          </h1>
        </div>

        {/* Configurações de Exportação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Configurações do Relatório
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Período Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Período Inicial
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Mês
                  </label>
                  <select
                    value={filters.startMonth}
                    onChange={(e) => setFilters(prev => ({ ...prev, startMonth: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Ano
                  </label>
                  <select
                    value={filters.startYear}
                    onChange={(e) => setFilters(prev => ({ ...prev, startYear: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Período Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Período Final
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Mês
                  </label>
                  <select
                    value={filters.endMonth}
                    onChange={(e) => setFilters(prev => ({ ...prev, endMonth: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Ano
                  </label>
                  <select
                    value={filters.endYear}
                    onChange={(e) => setFilters(prev => ({ ...prev, endYear: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opções de Formato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Formato do Relatório
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PDF */}
            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              filters.format === 'pdf'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={filters.format === 'pdf'}
                onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  filters.format === 'pdf'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    filters.format === 'pdf'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">PDF</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Relatório formatado para impressão
                  </p>
                </div>
              </div>
            </label>

            {/* Excel */}
            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              filters.format === 'excel'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name="format"
                value="excel"
                checked={filters.format === 'excel'}
                onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  filters.format === 'excel'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <FileSpreadsheet className={`w-6 h-6 ${
                    filters.format === 'excel'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Excel</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Planilha editável com dados detalhados
                  </p>
                </div>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Botão de Exportação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span className="text-lg font-medium">
              {loading ? 'Gerando Relatório...' : 'Exportar Relatório'}
            </span>
          </button>
        </motion.div>

        {/* Informações do Relatório */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                O que será incluído no relatório
              </h3>
              <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                <li>• Resumo financeiro do período selecionado</li>
                <li>• Lista detalhada de todas as transações</li>
                <li>• Gráficos de distribuição de gastos</li>
                <li>• Análise de receitas e despesas por categoria</li>
                <li>• Comparação mensal (quando aplicável)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
