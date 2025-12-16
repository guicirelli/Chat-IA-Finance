import { useState } from 'react';
import { useSignIn, useSignUp, useClerk } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, User } from 'lucide-react';

export default function CustomLogin({ onSuccess }) {
  const { signIn, setActive } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const { signOut } = useClerk();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: ''
  });
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // Validações de login
        if (!formData.emailOrUsername?.trim()) {
          setError('Digite seu email ou username.');
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError('Digite sua senha.');
          setLoading(false);
          return;
        }

        // Login com email ou username
        const result = await signIn.create({
          identifier: formData.emailOrUsername.trim(),
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess();
          }
        } else {
          setError('Login incompleto. Tente novamente.');
        }
      } else {
        // Validações de cadastro
        if (!formData.username?.trim()) {
          setError('Digite um username.');
          setLoading(false);
          return;
        }

        if (formData.username.trim().length < 3) {
          setError('Username deve ter pelo menos 3 caracteres.');
          setLoading(false);
          return;
        }

        if (!formData.email?.trim()) {
          setError('Digite um email válido.');
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError('Digite uma senha.');
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError('A senha deve ter pelo menos 8 caracteres.');
          setLoading(false);
          return;
        }

        if (!formData.confirmPassword) {
          setError('Confirme sua senha.');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }

        // Registro com username e email
        const result = await signUp.create({
          username: formData.username.trim(),
          emailAddress: formData.email.trim(),
          password: formData.password,
        });

        if (result.status === 'missing_requirements') {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setPendingVerification(true);
        } else if (result.status === 'complete') {
          // Explicitamente NÃO ativar sessão - usuário deve fazer login
          // Desloga qualquer sessão que possa ter sido criada automaticamente
          try {
            await signOut();
          } catch (e) {
            // Ignora erro se não houver sessão para deslogar
          }
          
          // Limpa os dados do formulário
          setFormData({ emailOrUsername: '', username: '', email: '', password: '', confirmPassword: '', code: '' });
          setPendingVerification(false);
          setIsLogin(true);
          setError('');
          setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
        } else {
          setError('Registro incompleto. Tente novamente.');
        }
      }
    } catch (err) {
      console.error('Erro:', err);
      let errorMessage = err?.errors?.[0]?.message || err?.message || 'Erro inesperado. Tente novamente.';
      
      // Traduzir e melhorar mensagens de erro específicas
      if (errorMessage.includes('data breach') || errorMessage.includes('online data breach')) {
        errorMessage = 'Essa senha é muito comum e insegura. Use uma senha forte com letras maiúsculas, minúsculas, números e símbolos. Dica: evite nomes próprios, datas ou padrões comuns.';
      } else if (errorMessage.includes('Password is too common')) {
        errorMessage = 'Senha muito comum. Use uma combinação única de letras, números e símbolos.';
      } else if (errorMessage.includes('Session already exists')) {
        // Se já existe uma sessão ativa, redireciona para o dashboard
        if (onSuccess && typeof onSuccess === 'function') {
          setTimeout(() => onSuccess(), 500);
        }
        return; // Não mostra erro, apenas redireciona
      } else if (errorMessage.includes('Identifier already exists')) {
        errorMessage = 'Este email ou username já está em uso. Tente fazer login ou use outro.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'Email inválido. Verifique o formato.';
      } else if (errorMessage.includes('Username already exists')) {
        errorMessage = 'Este username já está em uso. Escolha outro.';
      } else if (errorMessage.includes('Email already exists')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (errorMessage.includes('Incorrect password')) {
        errorMessage = 'Senha incorreta. Tente novamente.';
      } else if (errorMessage.includes('not found') || errorMessage.includes('could not be found')) {
        errorMessage = 'Usuário não encontrado. Verifique seu email ou username.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação do código
      if (!formData.code?.trim()) {
        setError('Digite o código de verificação.');
        setLoading(false);
        return;
      }

      if (formData.code.trim().length !== 6) {
        setError('O código deve ter 6 dígitos.');
        setLoading(false);
        return;
      }

      const result = await signUp.attemptEmailAddressVerification({
        code: formData.code.trim(),
      });

      if (result.status === 'complete') {
        // IMPORTANTE: NÃO chamar setActiveSignUp - usuário deve fazer login manualmente
        // Desloga qualquer sessão que possa ter sido criada automaticamente
        try {
          await signOut();
        } catch (e) {
          // Ignora erro se não houver sessão para deslogar
        }
        
        // Limpa tudo e volta para tela de login
        setFormData({ emailOrUsername: '', username: '', email: '', password: '', confirmPassword: '', code: '' });
        setPendingVerification(false);
        setIsLogin(true);
        setError('');
        setSuccessMessage('Email verificado com sucesso! Faça login para acessar sua conta.');
      } else {
        setError('Código inválido. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err);
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Código inválido.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validação especial para username - apenas letras, números e underscore
    if (name === 'username') {
      const sanitized = value.replace(/[^a-zA-Z0-9_]/g, '');
      setFormData({
        ...formData,
        [name]: sanitized
      });
      return;
    }
    
    // Validação para código - apenas números
    if (name === 'code') {
      const sanitized = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: sanitized
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (pendingVerification) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Email Verification
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm mx-auto">
            Enviamos um código de verificação para <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleVerification} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="000000"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              minLength={6}
              autoComplete="one-time-code"
              title="Digite o código de 6 dígitos"
              className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-center text-xl tracking-widest font-bold"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-base shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Verificar Código'
              )}
            </span>
            <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <div className="text-center mb-8">
        <h3 className="text-[26px] font-extrabold text-slate-900 dark:text-white mb-2">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-[13px]">
          {isLogin ? 'Sign in with your credentials to continue' : 'Join us for free'}
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3"
        >
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-green-700 dark:text-green-300 text-sm font-medium">{successMessage}</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isLogin ? (
          // Campos de Login
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email or Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  placeholder="your@email.com or username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          // Campos de Cadastro
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="seunome"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  title="Apenas letras, números e underscore"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 text-[15px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isLogin ? 0.3 : 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-[17px] shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
        >
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </span>
          <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">or</span>
          </div>
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isLogin ? 0.4 : 0.6 }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline text-[13px]"
          >
            {isLogin ? "Don't have an account? Create one now" : 'Already have an account? Sign in'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
