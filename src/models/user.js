import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import env from '../config/enviroments/enviroment';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  id: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  access: { type: String, required: false, default: 'standard' },
  name: { type: String, required: true },
  username: {
    type: String, required: true, unique: true, trim: true,
  },
  password: { type: String, required: true, trim: true },
  dateBirth: { type: Date, required: true },
  registrationNumber: { type: String, required: true },
  picture: { type: imageSchema, required: false },
  folder: { type: String, required: false },
  deleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', function (next) {
  const user = this;
  console.log(user.isModified());
  if (!user.isModified()) {
    next();
  } else {
    bcrypt.hash(user.password, parseInt(`${env.SALTING_ROUNDS}`, 10), (err, hash) => {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});


const User = mongoose.model('Request', userSchema);

export default User;
