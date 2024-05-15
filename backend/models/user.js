import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.isPasswordValid = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.generateToken = function () {
  const user = this;
  return jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: '1d',
  });
};

const user = mongoose.model('User', userSchema);

export default user;
