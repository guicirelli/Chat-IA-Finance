import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useFinanceStore } from '../../store/useFinanceStore';

const Sidebar = ({ currentPage, onClose }) => {
  const router = useRouter();
  const { theme, metrics } = useFinanceStore();

  const menuItems = [
    {
      name: 'Controle',
      href: '/',
      icon: (
        <Image
          src="/images/Robo-calculadora.webp"
          alt="Controle"
          width={24}
          height={24}
          className="rounded"
        />
      ),
      badge: null,
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: (
        <Image
          src="/images/Robo do mal.png"
          alt="Chat"
          width={24}
          height={24}
          className="rounded"
        />
      ),
      badge: null,
    },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`h-full flex flex-col ${
        theme === 'dark' 
          ? 'bg-gray-900 border-r border-gray-800' 
          : 'bg-white/95 backdrop-blur-sm border-r border-gray-200/50'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <Image
              src="/images/Robo-calculadora.webp"
              alt="Finance Bot"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Finance Bot
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Controle Financeiro
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = currentPage === item.href || 
            (item.href === '/' && currentPage === 'dashboard');
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : `hover:bg-gray-100/50 ${
                          theme === 'dark' 
                            ? 'text-gray-300 hover:text-white' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200/50'
      }`}>
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <p className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Usuário Premium
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Conta ativa
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Saldo
              </p>
              <p className={`font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                R$ {metrics.totalIncome - metrics.totalExpenses}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Poupança
              </p>
              <p className={`font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {metrics.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
