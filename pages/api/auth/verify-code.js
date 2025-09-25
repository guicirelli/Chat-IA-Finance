import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, phone, code, type } = req.body; // type: 'email' ou 'phone'

    if (!code || (!email && !phone)) {
      return res.status(400).json({ 
        error: 'Código e email/telefone são obrigatórios',
        field: 'required'
      });
    }

    try {
      await connectToDatabase();
      
      // Buscar usuário
      const user = await User.findOne({
        $or: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado',
          field: 'user'
        });
      }

      // Verificar código e expiração
      let isValid = false;
      let isExpired = false;

      if (type === 'email') {
        isValid = user.emailVerificationCode === code;
        isExpired = user.emailVerificationExpires && user.emailVerificationExpires < Date.now();
      } else if (type === 'phone') {
        isValid = user.phoneVerificationCode === code;
        isExpired = user.phoneVerificationExpires && user.phoneVerificationExpires < Date.now();
      }

      if (isExpired) {
        return res.status(400).json({ 
          error: 'Código expirado. Solicite um novo código.',
          field: 'expired'
        });
      }

      if (!isValid) {
        return res.status(400).json({ 
          error: 'Código inválido',
          field: 'code'
        });
      }

      // Marcar como verificado
      if (type === 'email') {
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
      } else if (type === 'phone') {
        user.isPhoneVerified = true;
        user.phoneVerificationCode = undefined;
        user.phoneVerificationExpires = undefined;
      }

      await user.save();

      return res.status(200).json({
        message: `${type === 'email' ? 'Email' : 'Telefone'} verificado com sucesso!`,
        verified: true
      });

    } catch (dbError) {
      console.warn('Banco de dados não disponível:', dbError.message);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        field: 'server'
      });
    }
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', field: 'server' });
  }
}
