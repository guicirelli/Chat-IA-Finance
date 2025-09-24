import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['income', 'expense']
  },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: String,
  isFixed: { type: Boolean, default: false },
  isAutomated: { type: Boolean, default: false }, // Para despesas replicadas automaticamente
  parentTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, // Para rastrear despesas replicadas
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Categorias padrão
export const DEFAULT_CATEGORIES = {
  income: [
    'Salário',
    'Vale Alimentação',
    'Vale Refeição',
    'Vale Transporte',
    'Bônus',
    'Freelance',
    'Outros'
  ],
  expense: [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Outros'
  ]
};

// Atualiza o timestamp
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices para melhor performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, profileId: 1, date: -1 });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;