export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API funcionando', data: [] });
  }
  
  if (req.method === 'POST') {
    const { type, category, amount } = req.body;
    
    if (!type || !category || !amount) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    return res.status(201).json({ 
      message: 'Transação criada com sucesso',
      transaction: { type, category, amount, id: Date.now() }
    });
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
