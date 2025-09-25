import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { validatePassword } from '../../../utils/validations';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { token, password } = req.body;

    // Validações básicas
    if (!token || !password) {
      return res.status(400).json({ 
        error: 'Token e nova senha são obrigatórios',
        field: 'required'
      });
    }

    // Validar senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: passwordValidation.errors.join('. '),
        field: 'password'
      });
    }

    try {
      await connectToDatabase();
      
      // Hash do token para comparar com o armazenado
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      
      // Buscar usuário pelo token válido e não expirado
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({ 
          error: 'Link expirado ou inválido',
          field: 'token'
        });
      }

      // Verificar se a conta está ativa
      if (!user.isActive) {
        return res.status(400).json({ 
          error: 'Conta desativada. Entre em contato com o suporte.',
          field: 'account'
        });
      }

      // Atualizar senha e limpar tokens
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      
      await user.save();

      return res.status(200).json({
        message: 'Senha redefinida com sucesso! Agora você pode fazer login.'
      });

    } catch (dbError) {
      console.warn('Banco de dados não disponível:', dbError.message);
      
      return res.status(500).json({ 
        error: 'Problema de conexão. Verifique sua internet e tente novamente.',
        field: 'server'
      });
    }
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      field: 'server'
    });
  }
}
