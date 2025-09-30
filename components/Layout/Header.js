import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { ChevronDown, Settings, Users, LogOut, Edit, User, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Inicializar nickname quando o usuário estiver disponível
  useEffect(() => {
    if (user?.firstName && !nickname) {
      setNickname(user.firstName);
    }
  }, [user, nickname]);

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    setIsLoading(true);
    try {
      // Atualizar o primeiro nome do usuário no Clerk
      await user.update({
        firstName: nickname.trim()
      });
      
      setIsEditingNickname(false);
    } catch (error) {
      console.error('Erro ao atualizar nickname:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <header className="h-16 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 right-0 left-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 right-0 left-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo e título */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/images/robo-logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full"
          />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Controle Financeiro
          </h1>
        </button>

        {/* Área do usuário */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {isEditingNickname ? (
                    <form onSubmit={handleNicknameSubmit} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                        autoFocus
                        onBlur={() => setIsEditingNickname(false)}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        {isLoading ? '...' : '✓'}
                      </button>
                    </form>
                  ) : (
                    <span 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setIsEditingNickname(true)}
                    >
                      {user.firstName || 'Usuário'}
                    </span>
                  )}
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
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user.firstName || 'Usuário'}
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
                      onClick={() => router.push('/dashboard')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
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
    </header>
  );
}