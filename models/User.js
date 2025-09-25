import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
    },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String,
    default: '',
  },
  profile: {
    riskProfile: { type: String, enum: ["conservador", "moderado", "arrojado"], default: "conservador" },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
      emailVerificationToken: {
        type: String,
      },
      emailVerificationCode: {
        type: String,
      },
      emailVerificationExpires: {
        type: Date,
      },
      phoneVerificationCode: {
        type: String,
      },
      phoneVerificationExpires: {
        type: Date,
      },
      isPhoneVerified: {
        type: Boolean,
        default: false,
      },
}, { timestamps: true });

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Verificar se a conta está bloqueada
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Incrementar tentativas de login
UserSchema.methods.incLoginAttempts = function() {
  // Se já está bloqueado e o tempo de bloqueio expirou, resetar
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Se atingiu o limite de tentativas e não está bloqueado, bloquear por 2 horas
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
  }
  
  return this.updateOne(updates);
};

// Resetar tentativas de login
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Gerar token para reset de senha
UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

// Gerar token para verificação de email
UserSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = require('crypto').randomBytes(32).toString('hex');
  this.emailVerificationToken = require('crypto').createHash('sha256').update(verificationToken).digest('hex');
  return verificationToken;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
