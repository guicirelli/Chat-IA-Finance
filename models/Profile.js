import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  name: { type: String, required: true },
  nickname: { type: String },
  photoUrl: { type: String },
  isDefault: { type: Boolean, default: false },
  settings: {
    currency: { type: String, default: 'BRL' },
    theme: { type: String, default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Garante que cada usuário tem apenas um perfil padrão
profileSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Atualiza o timestamp de atualização
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
