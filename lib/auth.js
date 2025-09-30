import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './db';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Username, Email ou Telefone', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          // Tentar autenticação com banco de dados
          try {
            await connectToDatabase();
            
            const loginField = credentials.identifier.toLowerCase().trim();
            
            // Buscar usuário por username, email ou telefone
            const user = await User.findOne({
              $or: [
                { email: loginField },
                { username: loginField },
                { phone: loginField },
                { phone: loginField.replace(/\D/g, '') } // Buscar também sem formatação
              ]
            });
            
            if (user) {
              // Verificar se a conta está ativa
              if (!user.isActive) {
                throw new Error('Conta desativada. Entre em contato com o suporte.');
              }

              // Verificar se a conta está bloqueada
              if (user.isLocked) {
                throw new Error('Conta bloqueada devido a muitas tentativas de login. Tente novamente em 2 horas.');
              }

              const isPasswordValid = await user.comparePassword(credentials.password);
              
              if (isPasswordValid) {
                // Resetar tentativas de login em caso de sucesso
                await user.resetLoginAttempts();
                
                const userData = {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  image: user.image,
                };
                
                console.log('Login bem-sucedido - Retornando dados do usuário:', userData);
                return userData;
              } else {
                // Incrementar tentativas de login em caso de falha
                await user.incLoginAttempts();
                throw new Error('Senha incorreta');
              }
            } else {
              throw new Error('Usuário não encontrado');
            }
          } catch (dbError) {
            console.warn('Banco de dados não disponível, verificando usuários temporários:', dbError.message);
          }

          // Fallback: verificar usuários em memória
          if (global.tempUsers) {
            const loginField = credentials.identifier.toLowerCase().trim();
            console.log('Buscando usuário temporário com:', { loginField, totalUsers: global.tempUsers.length });
            
            const user = global.tempUsers.find(u => {
              const emailMatch = u.email.toLowerCase() === loginField;
              const usernameMatch = u.username?.toLowerCase() === loginField;
              const phoneMatch = u.phone === loginField || u.phone === loginField.replace(/\D/g, '');
              const passwordMatch = u.password === credentials.password;
              
              console.log('Verificando usuário:', {
                email: u.email,
                username: u.username,
                phone: u.phone,
                emailMatch,
                usernameMatch,
                phoneMatch,
                passwordMatch,
                storedPassword: u.password,
                inputPassword: credentials.password
              });
              
              return (emailMatch || usernameMatch || phoneMatch) && passwordMatch;
            });
            
            if (user) {
              console.log('Usuário encontrado:', user);
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);