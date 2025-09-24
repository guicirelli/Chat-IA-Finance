import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { ChevronDown, Settings, Users, LogOut, Edit, User, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(session?.user?.name || 'Usuário');
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

  // Atualizar nickname quando o usuário mudar
  useEffect(() => {
    if (session?.user?.name) {
      setNickname(session.user.name);
    }
  }, [session?.user?.name]);

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implementar atualização do nickname via Clerk
    setIsEditingNickname(false);
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 fixed top-0 right-0 left-0 z-20">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">
            {/* Logo/Title */}
            <div className="flex-1">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Controle Financeiro
          </h1>
        </div>

        {/* User Profile */}
        <div className="relative flex items-center space-x-4" ref={dropdownRef}>
          {/* Notificações */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* Menu de Usuário */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-medium shadow-lg overflow-hidden">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                ) : (
                  nickname.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">{nickname}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {session?.user?.email}
                    </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
                >
                  {/* Cabeçalho do Perfil */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-500">
                    {isEditingNickname ? (
                      <form onSubmit={handleNicknameSubmit} className="flex space-x-2">
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                        >
                          Salvar
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{nickname}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-200">
                                {session?.user?.email}
                              </p>
                            </div>
                        <button
                          onClick={() => setIsEditingNickname(true)}
                          className="p-2 hover:bg-indigo-100 dark:hover:bg-gray-500 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Menu de Opções */}
                  <div className="py-2">
                        <button 
                          onClick={() => router.push('/user/profile')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-700 dark:text-white" />
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium">Meu Perfil</span>
                        </button>

                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-3 transition-colors">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-gray-700 dark:text-white" />
                      </div>
                      <span className="text-gray-800 dark:text-white font-medium">Configurações</span>
                    </button>

                        <button 
                          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-700 dark:text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 dark:text-white font-medium">Trocar Conta</span>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Fazer login com outra conta</p>
                          </div>
                        </button>

                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-3 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                              <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="font-medium">Sair</span>
                          </button>
                        </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}