// API para excluir transações específicas
export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "ID da transação é obrigatório" });
    }

    // Inicializar array global se não existir
    if (!global.tempTransactions) {
      global.tempTransactions = [];
    }

    // Encontrar e remover a transação
    const transactionIndex = global.tempTransactions.findIndex(t => t._id === id);
    
    if (transactionIndex === -1) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    // Remover a transação
    const deletedTransaction = global.tempTransactions.splice(transactionIndex, 1)[0];
    
    console.log('Transação excluída:', deletedTransaction);

    return res.status(200).json({ 
      message: "Transação excluída com sucesso",
      deletedTransaction 
    });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}