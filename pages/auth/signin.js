import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, TrendingUp, Shield, BarChart3, Target, CreditCard, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
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
          } else if (data.field === 'phone') {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex min-h-screen">
        {/* Lado Esquerdo - Informações e Features */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Seu dinheiro sob controle,<br />
                <span className="text-indigo-200">sem esforço</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Tudo o que você precisa para organizar suas finanças sem perder tempo.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src="/images/robo-logo.png"
                  alt="Robot Calculator"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-lg">Controle Financeiro Inteligente</h4>
                  <p className="text-indigo-100 text-sm">Mais de 500 mil pessoas confiam</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Seguro e confiável</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Interface intuitiva</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Relatórios detalhados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login/Registro */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Logo e Título */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/robo-logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full shadow-lg"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {isLogin ? 'Acesse seu dashboard financeiro' : 'Comece a controlar suas finanças'}
              </p>
            </div>

            {/* Formulário */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
            >
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                  {!isLogin && formData.password && (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`flex items-center space-x-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-red-500'}`}></div>
                          <span>8+ caracteres</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-red-500'}`}></div>
                          <span>Maiúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-red-500'}`}></div>
                          <span>Minúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-1 h-1 rounded-full ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-red-500'}`}></div>
                          <span>Número</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-600' : 'bg-red-500'}`}></div>
                          <span>Especial</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                    <>
                      <span>{isLogin ? 'Entrar' : 'Criar conta'}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-4">
                {isLogin && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        // Implementar modal de recuperação de senha
                        alert('Funcionalidade de recuperação de senha será implementada em breve!');
                      }}
                      className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
                
                <div>
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
              </div>
            </motion.div>

            {/* Benefícios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <span>Gratuito</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>Relatórios</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Metas</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}