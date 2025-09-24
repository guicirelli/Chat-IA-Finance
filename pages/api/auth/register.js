import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se o email já existe (em memória temporariamente)
    if (global.tempUsers && global.tempUsers.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Este email já está em uso' });
    }

    try {
      await connectToDatabase();
      
      // Verificar se o email já existe no banco
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Este email já está em uso' });
      }

      // Criar novo usuário no banco
      const user = new User({
        name,
        email,
        password,
      });

      await user.save();

      // Retornar dados do usuário (sem a senha)
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      };

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userData,
      });

    } catch (dbError) {
      console.warn('Banco de dados não disponível, usando armazenamento temporário:', dbError.message);
      
      // Fallback: armazenar em memória
      if (!global.tempUsers) {
        global.tempUsers = [];
      }

      const userId = Date.now().toString();
      const userData = {
        id: userId,
        name,
        email,
        password, // Em produção, isso seria hasheado
        image: '',
      };

      global.tempUsers.push(userData);

      return res.status(201).json({
        message: 'Usuário criado com sucesso (modo temporário)',
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
      });
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
