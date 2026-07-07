import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      // bcrypt hash only - the plain password is never stored
      type: String,
      required: true,
    },
    mustResetPassword: {
      // true until she changes the dummy password for the first time
      type: Boolean,
      default: true,
    },
    resetCodeHash: {
      // hashed 6-digit "forgot password" code, cleared after use
      type: String,
      default: null,
    },
    resetCodeExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
