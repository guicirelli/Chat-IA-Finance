import { useState, useEffect, useRef } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import MainLayout from '../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useHydration } from '../hooks/useHydration';

const ChatPage = () => {
  const { theme, transactions } = useFinanceStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isHydrated = useHydration();

  // Calcular dados financeiros para o contexto
  const receitas = transactions.filter(t => t.type === 'income');
  const despesas = transactions.filter(t => t.type === 'expense');
  const totalReceitas = receitas.reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = despesas.reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          context: {
            totalReceitas,
            totalDespesas,
            saldo,
            receitas: receitas.length,
            despesas: despesas.length
          }
        }),
      });

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <MainLayout currentPage="chat">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPage="chat">
      <div className="space-y-8">
        {/* Header do Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${
            theme === 'dark' 
              ? 'bg-purple-900/50 border border-purple-800' 
              : 'bg-purple-50 border border-purple-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="/images/Robo do mal.png"
                alt="Chat IA"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Chat Financeiro 💬
              </h1>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Tire dúvidas sobre suas finanças
              </p>
            </div>
          </div>
        </motion.div>

        {/* Área de Mensagens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 h-96 overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/70 border border-gray-200'
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Olá! Como posso ajudar?
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Faça perguntas sobre suas finanças
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <span className="text-white text-sm">U</span>
                      ) : (
                        <span className="text-white text-sm">🤖</span>
                      )}
                    </div>

                    {/* Mensagem */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : theme === 'dark' 
                            ? 'bg-gray-700 text-white border border-gray-600'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.timestamp && (
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' 
                            ? 'text-blue-100' 
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white border border-gray-600'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>Digitando...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        {/* Formulário de Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/70 border border-gray-200'
          }`}
        >
          <form onSubmit={handleSend} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta sobre finanças..."
                className={`w-full px-4 py-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                disabled={loading}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </motion.button>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
