import { useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Target, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import ThemeToggle from '../../components/ThemeToggle';

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-2xl font-bold text-blue-600">
                Controle Financeiro
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                href="/"
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Seção Principal */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo da Esquerda */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Bem-vindo de
                  <span className="text-blue-600"> volta</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Entre na sua conta para continuar gerenciando suas finanças de forma inteligente.
                </p>
              </div>

              {/* Cards de Benefícios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Análise Inteligente</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Relatórios detalhados e insights sobre seus gastos
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">100% Seguro</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Seus dados protegidos com criptografia avançada
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Conteúdo da Direita - Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Entrar na sua conta
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Use seu email ou telefone para fazer login
                </p>
              </div>

              <div className="space-y-6">
                <SignInButton mode="modal">
                  <button className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg">
                    Entrar com Clerk
                  </button>
                </SignInButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">ou</span>
                  </div>
                </div>

                <Link href="/">
                  <button className="w-full py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold">
                    Voltar ao início
                  </button>
                </Link>
              </div>

              {/* Card de Confiança */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Login Seguro</h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Autenticação segura com Clerk</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Suporte a email e telefone</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Recuperação de senha automática</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}