import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './db';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Tentar autenticação com banco de dados
          try {
            await connectToDatabase();
            
            const user = await User.findOne({ email: credentials.email.toLowerCase() });
            
            if (user) {
              const isPasswordValid = await user.comparePassword(credentials.password);
              
              if (isPasswordValid) {
                return {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  image: user.image,
                };
              }
            }
          } catch (dbError) {
            console.warn('Banco de dados não disponível, verificando usuários temporários:', dbError.message);
          }

          // Fallback: verificar usuários em memória
          if (global.tempUsers) {
            const user = global.tempUsers.find(u => 
              u.email.toLowerCase() === credentials.email.toLowerCase() && 
              u.password === credentials.password
            );
            
            if (user) {
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
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);