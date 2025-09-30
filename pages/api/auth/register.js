import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { validateEmail, validatePassword, validateUsername, validatePhone } from '../../../utils/validations';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
        const { username, email, phone, password } = req.body;

        // Validações básicas
        if (!email || !password) {
          return res.status(400).json({ 
            error: 'Email e senha são obrigatórios',
            field: 'required'
          });
        }

    // Validar formato do email
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        field: 'email'
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

        // Validar username se fornecido
        if (username) {
          const usernameValidation = validateUsername(username);
          if (!usernameValidation.isValid) {
            return res.status(400).json({ 
              error: usernameValidation.errors.join('. '),
              field: 'username'
            });
          }
        }

        // Validar telefone se fornecido
        if (phone) {
          const phoneValidation = validatePhone(phone);
          if (!phoneValidation.isValid) {
            return res.status(400).json({ 
              error: phoneValidation.errors.join('. '),
              field: 'phone'
            });
          }
        }


        // Verificar se o email, username ou telefone já existem (em memória temporariamente)
        if (global.tempUsers) {
          const existingUser = global.tempUsers.find(u => 
            u.email === email || 
            (username && u.username === username) ||
            (phone && u.phone === phone)
          );
          if (existingUser) {
            if (existingUser.email === email) {
              return res.status(400).json({ 
                error: 'Este email já está cadastrado',
                field: 'email'
              });
            }
            if (username && existingUser.username === username) {
              return res.status(400).json({ 
                error: 'Este nome de usuário já existe',
                field: 'username'
              });
            }
            if (phone && existingUser.phone === phone) {
              return res.status(400).json({ 
                error: 'Este telefone já está cadastrado',
                field: 'phone'
              });
            }
          }
        }

    try {
      await connectToDatabase();
      
      // Verificar se o email, username ou telefone já existem no banco
      const existingUser = await User.findOne({
        $or: [
          { email },
          ...(username ? [{ username }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ 
            error: 'Este email já está cadastrado',
            field: 'email'
          });
        }
        if (username && existingUser.username === username) {
          return res.status(400).json({ 
            error: 'Este nome de usuário já existe',
            field: 'username'
          });
        }
        if (phone && existingUser.phone === phone) {
          return res.status(400).json({ 
            error: 'Este telefone já está cadastrado',
            field: 'phone'
          });
        }
      }

          // Criar novo usuário no banco
          const user = new User({
            username: username || undefined,
            name: username || email.split('@')[0], // Usar username como nome, ou parte do email se não tiver username
            email,
            phone: phone || undefined,
            password,
          });

          await user.save();

          // Retornar dados do usuário (sem a senha)
          const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            image: user.image,
          };

          return res.status(201).json({
            message: 'Conta criada com sucesso! Agora você pode fazer login.',
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
            name: username || email.split('@')[0],
            username: username || '',
            email,
            phone: phone || '',
            password, // Em produção, isso seria hasheado
            image: '',
          };

      global.tempUsers.push(userData);

      return res.status(201).json({
        message: 'Conta criada com sucesso! Agora você pode fazer login.',
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          image: userData.image,
        },
      });
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ 
      error: 'Problema de conexão. Verifique sua internet e tente novamente.',
      field: 'server'
    });
  }
}