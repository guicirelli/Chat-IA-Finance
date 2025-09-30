import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Target, CreditCard, FileText, CheckCircle, ArrowRight, Users, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToggle';
import CustomLogin from '../components/CustomLogin';

export default function Landing() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Hooks para animações de scroll
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Se já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (isLoaded && user) {
    router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header simples */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Controle Financeiro
                </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                Entrar
              </button>
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
                  Controle suas
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> finanças</span>
                  <br />
                  com inteligência
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Gerencie suas receitas, despesas e metas financeiras de forma simples e eficiente. 
                  Tome decisões mais inteligentes sobre seu dinheiro.
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

              {/* CTA Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                    <span>Começar Grátis</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
                <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold">
                  Ver Demonstração
                </button>
              </motion.div>
            </motion.div>

            {/* Conteúdo da Direita - Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CustomLogin onSuccess={() => router.push('/dashboard')} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de Features */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Ferramentas poderosas para você ter controle total das suas finanças
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Análise Completa",
                description: "Relatórios detalhados sobre seus gastos e receitas"
              },
              {
                icon: Target,
                title: "Metas Financeiras",
                description: "Defina e acompanhe seus objetivos financeiros"
              },
              {
                icon: CreditCard,
                title: "Categorização",
                description: "Organize automaticamente suas transações"
              },
              {
                icon: FileText,
                title: "Relatórios",
                description: "Exporte seus dados em PDF e Excel"
              },
              {
                icon: Users,
                title: "Multi-perfis",
                description: "Gerencie múltiplas contas familiares"
              },
              {
                icon: Zap,
                title: "Automação",
                description: "Lembretes e transações automáticas"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Por que escolher nossa plataforma?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                  Oferecemos as melhores ferramentas para você alcançar seus objetivos financeiros
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Segurança Total",
                    description: "Seus dados protegidos com criptografia de nível bancário"
                  },
                  {
                    icon: Clock,
                    title: "Sincronização em Tempo Real",
                    description: "Acesse suas informações de qualquer dispositivo"
                  },
                  {
                    icon: Users,
                    title: "Suporte Especializado",
                    description: "Equipe pronta para ajudar você a qualquer momento"
                  }
                ].map((benefit, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Comece hoje mesmo!</h3>
                <p className="text-blue-100 mb-6">
                  Junte-se a milhares de usuários que já transformaram suas finanças
                </p>
                <SignUpButton mode="modal">
                  <button className="w-full py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg">
                    Criar Conta Grátis
                  </button>
                </SignUpButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Usuários Ativos</div>
              <div className="text-slate-600 dark:text-slate-300">Confiam na nossa plataforma</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-green-600">R$ 2M+</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Economizados</div>
              <div className="text-slate-600 dark:text-slate-300">Pelos nossos usuários</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-purple-600">4.9/5</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Avaliação</div>
              <div className="text-slate-600 dark:text-slate-300">Dos nossos usuários</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-xl font-bold">Controle Financeiro</span>
              </div>
              <p className="text-slate-400">
                A melhor plataforma para gerenciar suas finanças pessoais
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Segurança</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Controle Financeiro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}