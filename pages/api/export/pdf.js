import { getAuth } from "@clerk/nextjs/server";
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  try {
    // Verificar autenticação com Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // Buscar transações do usuário
    const periodKey = `${userId}-${new Date().getFullYear()}-${new Date().getMonth()}`;
    const transactions = global.tempTransactionsByPeriod?.[periodKey] || [];

    // Criar PDF
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
      res.status(200).send(pdfData);
    });

    // Conteúdo do PDF
    doc.fontSize(20).text('Relatório Financeiro', 50, 50);
    doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 50, 80);
    
    let y = 120;
    
    // Resumo
    const totalReceitas = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDespesas = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const saldo = totalReceitas - totalDespesas;

    doc.fontSize(16).text('Resumo Financeiro', 50, y);
    y += 30;
    
    doc.fontSize(12)
       .text(`Total de Receitas: R$ ${totalReceitas.toFixed(2)}`, 70, y)
       .text(`Total de Despesas: R$ ${totalDespesas.toFixed(2)}`, 70, y + 20)
       .text(`Saldo: R$ ${saldo.toFixed(2)}`, 70, y + 40);
    
    y += 80;
    
    // Lista de transações
    doc.fontSize(16).text('Transações', 50, y);
    y += 30;
    
    if (transactions.length === 0) {
      doc.fontSize(12).text('Nenhuma transação encontrada.', 70, y);
    } else {
      doc.fontSize(10);
      transactions.forEach((transaction, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        const type = transaction.type === 'income' ? 'Receita' : 'Despesa';
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        
        doc.text(`${date} - ${type} - ${transaction.category} - R$ ${transaction.amount.toFixed(2)}`, 70, y);
        if (transaction.description) {
          doc.text(`   ${transaction.description}`, 90, y + 15);
          y += 30;
        } else {
          y += 20;
        }
      });
    }

    doc.end();

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}