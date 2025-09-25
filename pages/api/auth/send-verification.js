import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { validateEmail, validatePhone } from '../../../utils/validations';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, phone, type } = req.body; // type: 'email' ou 'phone'

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Email ou telefone é obrigatório',
        field: 'required'
      });
    }

    if (type === 'email' && !validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        field: 'email'
      });
    }

    if (type === 'phone' && phone && !validatePhone(phone)) {
      return res.status(400).json({ 
        error: 'Formato de telefone inválido',
        field: 'phone'
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

      // Gerar código de verificação (6 dígitos)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Salvar código no usuário (em produção, usar Redis ou similar)
      if (type === 'email') {
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
      } else if (type === 'phone') {
        user.phoneVerificationCode = verificationCode;
        user.phoneVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
      }

      await user.save();

      // Em produção, aqui você enviaria o email/SMS real
      // Por enquanto, vamos apenas retornar o código para desenvolvimento
      console.log(`Código de verificação ${type}: ${verificationCode}`);

      return res.status(200).json({
        message: `Código de verificação enviado para ${type === 'email' ? email : phone}`,
        // Em desenvolvimento, retornar o código. Em produção, remover esta linha
        verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });

    } catch (dbError) {
      console.warn('Banco de dados não disponível:', dbError.message);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        field: 'server'
      });
    }
  } catch (error) {
    console.error('Erro ao enviar verificação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', field: 'server' });
  }
}
