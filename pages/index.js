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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
          </div>
          <p className="text-white/80 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-x-hidden">
      {/* Efeitos de fundo animados e mais sofisticados - Responsivos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Blobs principais - Tamanhos responsivos */}
        <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[800px] xl:h-[800px] 2xl:w-[1000px] 2xl:h-[1000px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 sm:opacity-60 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[800px] xl:h-[800px] 2xl:w-[1000px] 2xl:h-[1000px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 sm:opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[800px] xl:h-[800px] 2xl:w-[1000px] 2xl:h-[1000px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 sm:opacity-60 animate-blob animation-delay-4000"></div>
        {/* Blobs adicionais - Apenas em telas maiores */}
        <div className="hidden sm:block absolute top-10 right-10 lg:top-20 lg:right-20 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 lg:opacity-40 animate-blob animation-delay-1000"></div>
        <div className="hidden sm:block absolute bottom-10 left-10 lg:bottom-20 lg:left-20 w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 lg:opacity-40 animate-blob animation-delay-3000"></div>
      </div>
      
      {/* Grid pattern overlay sutil - Responsivo */}
      <div className="fixed inset-0 opacity-[0.02] sm:opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: 'clamp(30px, 4vw, 50px) clamp(30px, 4vw, 50px)'
      }}></div>

      {/* Seção Principal - 100% Responsiva */}
      <section className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 items-start lg:items-center">
          {/* Lado Esquerdo - Logo e Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-white space-y-6"
          >
            {/* Logo e Brand - Responsivo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-6 sm:mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <Image
                  src="/images/robo-logo.png"
                  alt="Logo"
                  width={56}
                  height={56}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-full shadow-2xl ring-2 sm:ring-4 ring-white/20"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
                  Cirelli Financial Control
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-blue-100/80 mt-0.5 sm:mt-1 tracking-wide font-medium">Your smart finance</p>
              </div>
            </motion.div>

            {/* Formulário ou Perfil do Usuário - Responsivo */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="w-full relative group"
            >
              {/* Glow effect melhorado - Responsivo */}
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-30 transition duration-700"></div>
              
              {/* Card principal - Responsivo */}
              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 overflow-hidden ring-1 ring-white/20">
                {/* Decorative gradient top melhorado */}
                <div className="h-1.5 sm:h-2 lg:h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                
                {/* Content - Padding responsivo */}
                <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16">
                  {user && userDisplay ? (
                    // Usuário logado - Mostra perfil - Responsivo
                    <div className="text-center space-y-6 sm:space-y-8">
                      <div className="space-y-4 sm:space-y-5">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-50"></div>
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl ring-2 sm:ring-4 ring-white/30">
                            {user.imageUrl || user.profileImageUrl ? (
                              <img 
                                src={user.imageUrl || user.profileImageUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white">
                                {userDisplay.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-slate-900 dark:text-white mb-1 sm:mb-2 capitalize leading-tight">
                            Hello, {userDisplay.username}!
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-slate-600 dark:text-slate-400 font-medium break-all sm:break-normal">
                            {userDisplay.email}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="group relative w-full py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>Go to Dashboard</span>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
                
                {/* Decorative elements melhorados */}
                <div className="absolute top-20 right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-400/15 rounded-full blur-xl"></div>
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

            {/* Heading principal com tipografia melhorada - 100% Responsivo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold leading-[1.1] sm:leading-tight tracking-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                Manage your{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-yellow-300 drop-shadow-lg">finances</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 sm:h-2.5 md:h-3 lg:h-4 bg-yellow-300/20 -skew-x-12 transform"></span>
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-100 drop-shadow-lg">intelligence</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 sm:h-2.5 md:h-3 lg:h-4 bg-blue-100/20 -skew-x-12 transform"></span>
                </span>
              </h2>
                </motion.div>

            {/* Descrição aprimorada - Responsiva */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-blue-50/95 leading-relaxed sm:leading-relaxed max-w-2xl 2xl:max-w-4xl font-normal mb-6 sm:mb-8 md:mb-10"
            >
              The complete platform to control income, expenses and achieve your financial goals with{' '}
              <span className="font-semibold text-white relative">
                security
                <span className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/30"></span>
              </span>{' '}
              and{' '}
              <span className="font-semibold text-white relative">
                simplicity
                <span className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/30"></span>
              </span>.
            </motion.p>

            {/* Cards de Features - Grid 2x2 com Glassmorphism melhorado - 100% Responsivo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6"
            >
              {[
                { icon: TrendingUp, title: 'Smart Analysis', desc: 'Detailed reports', color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-500' },
                { icon: BarChart3, title: 'Visualization', desc: 'Intuitive charts', color: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-500' },
                { icon: Shield, title: '100% Secure', desc: 'Protected data', color: 'from-green-500 to-green-600', iconBg: 'bg-green-500' },
                { icon: Sparkles, title: 'Easy to Use', desc: 'Modern interface', color: 'from-yellow-500 to-yellow-600', iconBg: 'bg-yellow-500' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 border border-white/30 shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all duration-300 overflow-hidden min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px]"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 ${feature.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-1 sm:mb-1.5 text-white group-hover:text-white/90 transition-colors leading-tight">{feature.title}</h3>
                    <p className="text-blue-100/90 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed">{feature.desc}</p>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </motion.div>
              ))}
            </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas - 100% Responsiva */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 border-t border-white/20 backdrop-blur-sm">
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20"
          >
            {/* Usuários Ativos - Responsivo */}
              <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg leading-none">
                10K+
                </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white">
                Active Users
          </div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-blue-100/80 font-medium">
                Trust our platform
        </div>
            </motion.div>

            {/* Economizados - Responsivo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg leading-none">
                R$ 2M+
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white">
                Saved
                    </div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-blue-100/80 font-medium">
                By our users
              </div>
            </motion.div>

            {/* Avaliação - Responsivo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg leading-none">
                4.9/5
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white">
                Rating
              </div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-blue-100/80 font-medium">
                From our users
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Seção do Rodapé Aprimorado - 100% Responsivo */}
      <footer className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 border-t border-white/20 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-6 sm:mb-8 md:mb-10"
          >
            <div className="mb-4 sm:mb-6 md:mb-0 text-center md:text-left">
              <p className="font-semibold text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-1 sm:mb-2">
                © 2025 Cirelli Financial Control
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-white/60">All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
              <a href="#" className="relative group font-medium min-h-[44px] flex items-center">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Privacy</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group font-medium min-h-[44px] flex items-center">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Terms</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group font-medium min-h-[44px] flex items-center">
                <span className="relative z-10 hover:text-white transition-colors duration-300">Contact</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </motion.div>

          {/* Linha decorativa melhorada */}
          <div className="my-6 sm:my-8 md:my-10 h-px sm:h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-white/50 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl"
          >
            Developed with ❤️ by <span className="text-blue-300 font-semibold hover:text-blue-200 transition-colors cursor-pointer">Guilherme Cirelli</span> using Next.js and Tailwind CSS
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
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
        
        /* Custom scrollbar - Responsivo */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 10px;
          }
        }
        
        @media (min-width: 1920px) {
          ::-webkit-scrollbar {
            width: 12px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(99, 102, 241, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
        
        /* Touch targets para mobile - mínimo 44x44px */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Otimizações para TV */
        @media (min-width: 1920px) {
          body {
            font-size: 1.25rem;
          }
        }
        
        /* Prevenir zoom em inputs no iOS */
        @media screen and (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="number"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }
        
        /* Melhorar legibilidade em telas pequenas */
        @media (max-width: 640px) {
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
      `}</style>
    </div>
  );
}