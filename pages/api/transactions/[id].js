// API para atualizar e excluir transações específicas
export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID da transação é obrigatório" });
    }

    // Inicializar estrutura global separada por período se não existir
    if (!global.tempTransactionsByPeriod) {
      global.tempTransactionsByPeriod = {};
    }

    // Encontrar transação e seu período atual
    let currentPeriod = null;
    let indexInPeriod = -1;
    for (const periodKey in global.tempTransactionsByPeriod) {
      const idx = global.tempTransactionsByPeriod[periodKey].findIndex(t => t._id === id);
      if (idx !== -1) {
        currentPeriod = periodKey;
        indexInPeriod = idx;
        break;
      }
    }
    if (!currentPeriod) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    if (req.method === 'DELETE') {
      const deletedTransaction = global.tempTransactionsByPeriod[currentPeriod].splice(indexInPeriod, 1)[0];
      console.log(`Transação excluída do período ${currentPeriod}:`, deletedTransaction);
      return res.status(200).json({ message: 'Transação excluída com sucesso', deletedTransaction, periodKey: currentPeriod });
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      const existing = global.tempTransactionsByPeriod[currentPeriod][indexInPeriod];

      // Validar campos básicos
      const allowedTypes = ['income', 'expense'];
      if (body.type && !allowedTypes.includes(body.type)) {
        return res.status(400).json({ error: 'Tipo inválido' });
      }
      if (body.amount !== undefined) {
        const parsed = parseFloat(body.amount);
        if (isNaN(parsed) || parsed <= 0) {
          return res.status(400).json({ error: 'Valor inválido' });
        }
        existing.amount = parsed;
      }
      if (body.category !== undefined) {
        existing.category = String(body.category);
      }
      if (body.note !== undefined) {
        existing.note = String(body.note || '');
      }
      if (body.type !== undefined) {
        existing.type = body.type;
      }

      // Atualizar data e mover de período se necessário
      if (body.date !== undefined) {
        const newDate = new Date(body.date);
        if (isNaN(newDate.getTime())) {
          return res.status(400).json({ error: 'Data inválida' });
        }
        existing.date = newDate;
        const newPeriod = `${newDate.getFullYear()}-${newDate.getMonth()}`;
        if (newPeriod !== currentPeriod) {
          // Remover do período atual
          global.tempTransactionsByPeriod[currentPeriod].splice(indexInPeriod, 1);
          // Criar período destino se necessário e adicionar
          if (!global.tempTransactionsByPeriod[newPeriod]) {
            global.tempTransactionsByPeriod[newPeriod] = [];
          }
          global.tempTransactionsByPeriod[newPeriod].push(existing);
          currentPeriod = newPeriod;
        }
      }

      // Marcar atualização
      existing.updatedAt = new Date();

      return res.status(200).json({ message: 'Transação atualizada com sucesso', transaction: existing, periodKey: currentPeriod });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}