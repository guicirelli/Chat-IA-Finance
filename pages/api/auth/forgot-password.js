import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { validateEmail } from '../../../utils/validations';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email } = req.body;

    // Validações básicas
    if (!email) {
      return res.status(400).json({ 
        error: 'Email é obrigatório',
        field: 'email'
      });
    }

    // Validar formato do email
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        field: 'email'
      });
    }

    try {
      await connectToDatabase();
      
      // Buscar usuário pelo email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Email não cadastrado',
          field: 'email'
        });
      }

      // Verificar se a conta está ativa
      if (!user.isActive) {
        return res.status(400).json({ 
          error: 'Conta desativada. Entre em contato com o suporte.',
          field: 'account'
        });
      }

      // Gerar token de reset
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Em produção, aqui você enviaria um email com o token
      // Por enquanto, vamos retornar o token para teste
      console.log('Token de reset para', email, ':', resetToken);

      return res.status(200).json({
        message: 'Link de redefinição enviado para seu email',
        // Em produção, não retornar o token
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });

    } catch (dbError) {
      console.warn('Banco de dados não disponível:', dbError.message);
      
      // Fallback: verificar usuários em memória
      if (global.tempUsers) {
        const user = global.tempUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return res.status(404).json({ 
            error: 'Email não cadastrado',
            field: 'email'
          });
        }

        return res.status(200).json({
          message: 'Link de redefinição enviado para seu email (modo temporário)',
        });
      }

      return res.status(500).json({ 
        error: 'Problema de conexão. Verifique sua internet e tente novamente.',
        field: 'server'
      });
    }
  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      field: 'server'
    });
  }
}
