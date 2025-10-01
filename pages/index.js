import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Sparkles } from 'lucide-react';
import Image from 'next/image';
import CustomLogin from '../components/CustomLogin';

export default function Landing() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userDisplay, setUserDisplay] = useState(null);

  // Captura os dados do usuário quando estiver disponível
  useEffect(() => {
    if (user) {
      // Salva no estado local
      setUserDisplay({
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        fullName: user.fullName
      });
    } else {
      setUserDisplay(null);
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-x-hidden">
      {/* Efeitos de fundo animados e mais sofisticados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Seção Principal */}
      <section className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start lg:items-center">
          {/* Lado Esquerdo - Logo e Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-white space-y-6"
          >
            {/* Logo e Brand */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-2xl"
              />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Controle Financeiro Cirelli
                </h1>
                <p className="text-[9px] sm:text-[10px] text-blue-200/70 mt-0.5 tracking-wide">Sua finança inteligente</p>
              </div>
            </motion.div>

            {/* Formulário ou Perfil do Usuário */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="w-full relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-15 group-hover:opacity-25 transition duration-500"></div>
              
              {/* Card principal */}
              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                {/* Decorative gradient top */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                {/* Content */}
                <div className="p-5 sm:p-6 lg:p-8">
                  {user && userDisplay ? (
                    // Usuário logado - Mostra perfil
                    <div className="text-center space-y-6">
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          {user.imageUrl || user.profileImageUrl ? (
                            <img 
                              src={user.imageUrl || user.profileImageUrl} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-white">
                              {userDisplay.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 capitalize">
                            Olá, {userDisplay.username}!
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {userDisplay.email}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Ir para o Dashboard
                      </button>
                    </div>
                  ) : user && !userDisplay ? (
                    // Aguardando dados do usuário
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    // Usuário não logado - Mostra formulário
                    <CustomLogin onSuccess={() => router.push('/dashboard')} />
                  )}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-16 right-8 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-16 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Lado Direito - Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-white space-y-6"
          >

            {/* Heading principal com tipografia melhorada */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-[28px] sm:text-[33px] lg:text-[44px] font-extrabold leading-tight tracking-tight">
                Gerencie suas{' '}
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  finanças
                </span>
                <br />
                com{' '}
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                  inteligência
                </span>
              </h2>
                </motion.div>

            {/* Descrição aprimorada */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-blue-50/90 leading-relaxed max-w-lg font-light"
            >
              A plataforma completa para controlar receitas, despesas e atingir suas metas financeiras com{' '}
              <span className="font-medium text-white">segurança</span> e{' '}
              <span className="font-medium text-white">simplicidade</span>.
            </motion.p>

            {/* Cards de Features - Grid 2x2 com Glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-2 sm:gap-3"
            >
              {[
                { icon: TrendingUp, title: 'Análise Inteligente', desc: 'Relatórios detalhados', gradient: 'from-blue-400 to-cyan-400' },
                { icon: BarChart3, title: 'Visualização', desc: 'Gráficos intuitivos', gradient: 'from-purple-400 to-pink-400' },
                { icon: Shield, title: '100% Seguro', desc: 'Dados protegidos', gradient: 'from-green-400 to-emerald-400' },
                { icon: Sparkles, title: 'Fácil de Usar', desc: 'Interface moderna', gradient: 'from-yellow-400 to-orange-400' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="relative bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg"
                >
                  <div className="relative z-10">
                    <div className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-2 shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-[13px] mb-1 text-white">{feature.title}</h3>
                    <p className="text-blue-100/80 text-[11px] leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8"
          >
            {/* Usuários Ativos */}
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-2 sm:space-y-3"
              >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                10K+
                </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                Usuários Ativos
          </div>
              <div className="text-xs sm:text-sm text-blue-200/70">
                Confiam na nossa plataforma
        </div>
            </motion.div>

            {/* Economizados */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-2 sm:space-y-3"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                R$ 2M+
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                Economizados
                    </div>
              <div className="text-xs sm:text-sm text-blue-200/70">
                Pelos nossos usuários
              </div>
            </motion.div>

            {/* Avaliação */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-2 sm:space-y-3"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                Avaliação
              </div>
              <div className="text-xs sm:text-sm text-blue-200/70">
                Dos nossos usuários
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Seção do Rodapé Aprimorado */}
      <footer className="relative z-10 py-8 sm:py-10 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between text-white/70 text-xs sm:text-sm"
          >
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="font-medium bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent text-xs sm:text-sm">
                © 2025 Controle Financeiro Cirelli
              </p>
              <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">Todos os direitos reservados.</p>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] sm:text-xs">
              <a href="#" className="relative group">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Privacidade</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Termos</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Contato</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </motion.div>

          {/* Linha decorativa */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-center text-white/40 text-[10px] sm:text-[11px]"
          >
            Desenvolvido por <span className="text-blue-300 font-semibold">Guilherme Cirelli</span> usando Next.js e Tailwind CSS
          </motion.div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        
        .animate-shine {
          animation: shine 0.75s ease-in-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(99, 102, 241, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
}