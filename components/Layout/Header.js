import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { ChevronDown, LogOut, User, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header({
  showDashboardControls,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  isEditMode,
  setIsEditMode,
  isEditing,
  setIsEditing,
  handleSave,
  openModal
}) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!isLoaded) {
    return (
      <header className={`${showDashboardControls ? 'h-auto min-h-20 py-3' : 'h-16'} border-b border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl fixed top-0 right-0 left-0 z-20 shadow-lg transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="w-20 h-6 sm:w-24 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${showDashboardControls ? 'h-auto min-h-20 py-3' : 'h-16'} border-b border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl fixed top-0 right-0 left-0 z-20 shadow-lg transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Logo e título */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/images/robo-logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
          />
          <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            Controle Financeiro Cirelli
          </h1>
        </button>

        {/* Controles do Dashboard - aparecem apenas na página do dashboard */}
        {showDashboardControls && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => {
                if (isEditing) {
                  alert('Salve as alterações antes de mudar o mês.');
                  return;
                }
                setSelectedMonth(Number(e.target.value));
              }}
              disabled={isEditing}
              className={`px-2 sm:px-3 py-2 border border-white/20 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white ${
                isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString('pt-BR', { month: 'short' })}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => {
                if (isEditing) {
                  alert('Salve as alterações antes de mudar o ano.');
                  return;
                }
                setSelectedYear(Number(e.target.value));
              }}
              disabled={isEditing}
              className={`px-2 sm:px-3 py-2 border border-white/20 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white ${
                isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>

            {!isEditMode ? (
              <button
                onClick={() => {
                  setIsEditMode(true);
                  setIsEditing(true);
                }}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-xs sm:text-sm shadow-lg whitespace-nowrap"
              >
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => openModal('income')}
                  className="px-2 sm:px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-xs sm:text-sm shadow-lg flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Receita</span>
                </button>
                <button
                  onClick={() => openModal('expense')}
                  className="px-2 sm:px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-medium text-xs sm:text-sm shadow-lg flex items-center gap-1"
                >
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Despesa</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-xs sm:text-sm shadow-lg whitespace-nowrap"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Área do usuário */}
        <div className="flex items-center space-x-4">
          {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                {user.imageUrl || user.profileImageUrl ? (
                  <img 
                    src={user.imageUrl || user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user.username ? user.username.charAt(0).toUpperCase() : (user.firstName ? user.firstName.charAt(0).toUpperCase() : user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase())}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {user.username || user.firstName || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                      {user.username || user.firstName || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => router.push('/user/profile')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Perfil</span>
                    </button>

                    <button
                      onClick={() => router.push('/analytics')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Relatórios</span>
                    </button>

                    <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}