import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Atualiza o timestamp
goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calcula a porcentagem de progresso
goalSchema.methods.getProgress = function() {
  return (this.currentAmount / this.targetAmount) * 100;
};

// Verifica se a meta foi atingida
goalSchema.methods.checkCompletion = function() {
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
    return true;
  }
  return false;
};

// Índices
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, profileId: 1, status: 1 });

const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);

export default Goal;