import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard,
  Wallet,
  LineChart,
  Target,
  FileText,
  Menu as MenuIcon
} from 'lucide-react';

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral das finanças'
    },
    {
      name: 'Transações',
      href: '/transactions',
      icon: Wallet,
      description: 'Despesas e receitas'
    },
    {
      name: 'Análises',
      href: '/analytics',
      icon: LineChart,
      description: 'Gráficos e relatórios'
    },
    {
      name: 'Metas',
      href: '/goals',
      icon: Target,
      description: 'Objetivos financeiros'
    },
    {
      name: 'Exportar',
      href: '/export',
      icon: FileText,
      description: 'Exportar relatórios'
    }
  ];

  return (
    <>
      {/* Overlay para fechar o menu */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Botão de menu - sempre visível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed top-3 left-3 z-50 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
      >
        <MenuIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isExpanded ? 280 : 0,
          x: isExpanded ? 0 : -280,
        }}
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30 shadow-lg transition-all duration-300`}
      >
        {/* Botão fechar */}
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="p-4">
          {/* Header */}
          <div className="h-16 flex items-center">
            {isExpanded ? (
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Menu Principal
              </h2>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600" />
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mt-8">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`} />
                  </div>
                  
                  {isExpanded && (
                    <div className="flex-1 flex flex-col">
                      <span className={`font-medium ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
}
