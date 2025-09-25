import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, TrendingUp, Shield, BarChart3, Target, CreditCard, AlertTriangle, FileText, CheckCircle, ArrowRight, Users, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('email'); // 'email' ou 'phone'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    loginField: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Hooks para animações de scroll
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Se já estiver logado, redireciona para o dashboard
  if (session) {
    router.push('/dashboard');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Para login, usar NextAuth diretamente
        let loginField = formData.loginField;
        
        // Se for telefone, remover formatação para buscar no banco
        if (loginType === 'phone') {
          loginField = loginField.replace(/\D/g, '');
        }
        
        const result = await signIn('credentials', {
          identifier: loginField,
          password: formData.password,
          redirect: false,
          callbackUrl: '/dashboard'
        });

        if (result?.error) {
          // Mapear erros específicos
          if (result.error.includes('Usuário não encontrado')) {
            setError('Usuário não encontrado. Verifique se o email/username está correto.');
          } else if (result.error.includes('Senha incorreta')) {
            setError('Senha incorreta. Tente novamente.');
          } else if (result.error.includes('Conta bloqueada')) {
            setError('Conta bloqueada devido a muitas tentativas de login. Tente novamente em 2 horas.');
          } else if (result.error.includes('Conta desativada')) {
            setError('Conta desativada. Entre em contato com o suporte.');
          } else {
            setError('Erro de autenticação. Tente novamente.');
          }
        } else {
          router.push('/dashboard');
        }
      } else {
        // Para registro, usar a API de registro
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Tratar erros específicos do registro
          if (data.field === 'email') {
            setError(data.error);
          } else if (data.field === 'username') {
            setError(data.error);
          } else if (data.field === 'password') {
            setError(data.error);
          } else if (data.field === 'required') {
            setError(data.error);
          } else if (data.field === 'server') {
            setError(data.error);
          } else {
            setError('Erro ao criar conta. Tente novamente.');
          }
          return;
        }

        // Após registro bem-sucedido, redirecionar para login
        setError('');
        setIsLogin(true);
        setLoginType('email');
        setFormData({ username: '', email: '', phone: '', loginField: '', password: '', confirmPassword: '' });
        
        // Mostrar mensagem de sucesso
        setTimeout(() => {
          alert('Conta criada com sucesso! Agora você pode fazer login.');
        }, 100);
      }
    } catch (error) {
      // Tratar erros de rede ou outros erros técnicos
      if (error.message.includes('fetch')) {
        setError('Problema de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('JSON')) {
        setError('Erro no servidor. Tente novamente em alguns instantes.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Controle Total',
      description: 'Gerencie receitas e despesas com precisão absoluta'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Inteligentes',
      description: 'Gráficos e análises que facilitam suas decisões'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Acompanhe objetivos e alcance sua independência'
    },
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Seus dados protegidos com tecnologia avançada'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Menos trabalho, mais tempo livre',
      description: 'Seus lançamentos chegam prontos direto do seu banco.'
    },
    {
      icon: FileText,
      title: 'Seus gastos sob controle desde o primeiro dia',
      description: 'Traga seu histórico de 90 dias e não comece do zero.'
    },
    {
      icon: Users,
      title: 'Conecte contas PF e PJ sem dor de cabeça',
      description: 'Finanças pessoais e do negócio organizadas no mesmo lugar.'
    },
    {
      icon: Shield,
      title: 'Segurança em primeiro lugar',
      description: 'Tecnologia do Banco Central para proteger seus dados e sua privacidade.'
    }
  ];

  const controls = [
    'Cadastre todos os seus gastos',
    'Saiba o destino de cada centavo',
    'Defina limites de gastos por categoria',
    'Receba alertas de contas a pagar',
    'Relatórios com gráficos completos'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Controle Financeiro
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  by Guilherme Cirelli
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden min-h-screen flex items-center"
      >
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Seu dinheiro sob controle,<br />
                <span className="text-indigo-600">sem esforço</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
              >
                Tudo o que você precisa para organizar suas finanças sem perder tempo.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault();
                    const loginSection = document.getElementById('login');
                    if (loginSection) {
                      const rect = loginSection.getBoundingClientRect();
                      const offsetTop = window.pageYOffset + rect.top + 80; // 80px abaixo do topo
                      window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                >
                  Ver Recursos
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    A melhor solução para uma vida financeira saudável
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Sistema para controle financeiro online
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  {controls.map((control, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{control}</span>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white dark:bg-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Como o Controle Financeiro vai me ajudar?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Proporcionando meios para você realizar seus sonhos, metas e objetivos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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
      </motion.section>


      {/* Login Section */}
      <motion.section 
        id="login" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Comece agora mesmo
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Completo, fácil e gratuito
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Formulário */}
            <motion.div
              id="login-form"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {isLogin ? 'Acesse seu dashboard financeiro' : 'Comece a controlar suas finanças'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {isLogin ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {loginType === 'phone' ? 'Telefone' : 'E-mail ou username'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginType(loginType === 'email' ? 'phone' : 'email');
                          setFormData(prev => ({ ...prev, loginField: '' }));
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                      >
                        {loginType === 'phone' ? 'Username/Email' : 'Telefone'}
                      </button>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={loginType === 'phone' ? 'tel' : 'text'}
                        name="loginField"
                        value={formData.loginField || ''}
                        onChange={(e) => {
                          let value = e.target.value;
                          
                          // Formatação de telefone brasileiro
                          if (loginType === 'phone') {
                            // Remove tudo que não é número
                            value = value.replace(/\D/g, '');
                            
                            // Aplica máscara: 55 11 99999-9999
                            if (value.length > 0) {
                              if (value.length <= 2) {
                                value = value;
                              } else if (value.length <= 4) {
                                value = `${value.slice(0, 2)} ${value.slice(2)}`;
                              } else if (value.length <= 9) {
                                value = `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4)}`;
                              } else {
                                value = `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 9)}-${value.slice(9, 13)}`;
                              }
                            }
                          }
                          
                          setFormData(prev => ({
                            ...prev,
                            loginField: value
                          }));
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder={loginType === 'phone' ? '55 11 99999-9999' : 'username ou email'}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Digite seu username"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Telefone <span className="text-slate-400 text-sm">(opcional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Remove tudo que não é número
                            value = value.replace(/\D/g, '');
                            
                            // Aplica máscara: 55 11 99999-9999
                            if (value.length > 0) {
                              if (value.length <= 2) {
                                value = value;
                              } else if (value.length <= 4) {
                                value = `${value.slice(0, 2)} ${value.slice(2)}`;
                              } else if (value.length <= 9) {
                                value = `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4)}`;
                              } else {
                                value = `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 9)}-${value.slice(9, 13)}`;
                              }
                            }
                            
                            setFormData(prev => ({
                              ...prev,
                              phone: value
                            }));
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="55 11 99999-9999"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Digite sua senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Confirme sua senha"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <span>{isLogin ? 'Entrar' : 'Criar conta'}</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setLoginType('email');
                    setFormData({ username: '', email: '', phone: '', loginField: '', password: '', confirmPassword: '' });
                  }}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login'}
                </button>
              </div>
            </motion.div>

            {/* Benefícios do Login */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/images/robo-logo.png"
                    alt="Robot Calculator"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                      Controle Financeiro Inteligente
                    </h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Seguro e confiável</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Interface intuitiva</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Relatórios detalhados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Suporte 24/7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white">100% Seguro</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Seus dados protegidos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <CreditCard className="w-8 h-8 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white">Completamente Gratuito</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sem taxas ocultas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Zap className="w-8 h-8 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white">Configuração Rápida</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Em menos de 2 minutos</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-slate-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <Image
                src="/images/robo-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-xl font-bold">Controle Financeiro</span>
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-slate-400 mb-4"
            >
              A melhor solução para uma vida financeira saudável
            </motion.p>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm text-slate-500"
            >
              © 2025 Controle Financeiro. Todos os direitos reservados.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}