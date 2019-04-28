import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import thumbnailPluginLib from 'mongoose-thumbnail';
import path from 'path';

const { thumbnailPlugin, make_upload_to_model } = thumbnailPluginLib;

const uploadsBase = path.join(__dirname, `${process.env.PATH_UPLOAD}`);
const uploads = path.join(uploadsBase, 'u');


const userSchema = new mongoose.Schema({
  access: { type: String, required: false, default: 'standard' },
  name: { type: String, required: true },
  username: {
    type: String, required: true, unique: true, trim: true,
  },
  password: { type: String, required: true, trim: true },
  dateBirth: { type: Date, required: true },
  registrationNumber: { type: String, required: true },
}, { timestamps: true, versionKey: false });

userSchema.set('toJSON', { virtuals: true });

userSchema.plugin(thumbnailPlugin, {
  name: 'profilePicture',
  format: 'png',
  size: 80,
  inline: true,
  save: true,
  // upload_to: make_upload_to_model(uploads, 'profiles'),
  // relative_to: uploadsBase,
});

// encrypt password before save
userSchema.pre('save', function (next) {
  const user = this;
  console.log(user.isModified());
  if (!user.isModified()) { // don't rehash if it's an old user
    next();
  } else {
    bcrypt.hash(user.password, parseInt(`${process.env.SALTING_ROUNDS}`, 10), (err, hash) => {
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
